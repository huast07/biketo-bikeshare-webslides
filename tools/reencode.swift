// Re-encodes a screen recording to H.264 at a given width and average bitrate, keeping the
// aspect ratio. Audio is dropped: the demo clips play muted on the slides.
// Usage: swift reencode.swift <input> <output> <width> <bitsPerSecond>
import AVFoundation
import Foundation

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

let args = CommandLine.arguments
guard args.count == 5, let targetWidth = Int(args[3]), let bitrate = Int(args[4]) else {
    fail("usage: swift reencode.swift <input> <output> <width> <bitsPerSecond>")
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: output)

let asset = AVURLAsset(url: input)
let semaphore = DispatchSemaphore(value: 0)
let keyFrameIntervalSeconds = 2
let writerPollNanoseconds: UInt64 = 2_000_000

Task {
    do {
        guard let track = try await asset.loadTracks(withMediaType: .video).first else {
            fail("no video track in \(input.path)")
        }
        let natural = try await track.load(.naturalSize)
        let transform = try await track.load(.preferredTransform)
        let width = targetWidth / 2 * 2
        let height = Int((natural.height * CGFloat(width) / natural.width).rounded()) / 2 * 2

        let reader = try AVAssetReader(asset: asset)
        let readerOutput = AVAssetReaderTrackOutput(
            track: track,
            outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
        )
        reader.add(readerOutput)

        let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
        writer.shouldOptimizeForNetworkUse = true
        let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: width,
            AVVideoHeightKey: height,
            AVVideoScalingModeKey: AVVideoScalingModeResizeAspect,
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: bitrate,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                AVVideoMaxKeyFrameIntervalDurationKey: keyFrameIntervalSeconds,
            ],
        ])
        writerInput.transform = transform
        writer.add(writerInput)

        guard reader.startReading() else { fail("reader: \(String(describing: reader.error))") }
        guard writer.startWriting() else { fail("writer: \(String(describing: writer.error))") }
        writer.startSession(atSourceTime: .zero)

        // A plain pull loop keeps the reader alive for the whole copy.
        while let sample = readerOutput.copyNextSampleBuffer() {
            while !writerInput.isReadyForMoreMediaData {
                try await Task.sleep(nanoseconds: writerPollNanoseconds)
            }
            guard writerInput.append(sample) else {
                fail("append: \(String(describing: writer.error))")
            }
        }
        if reader.status == .failed { fail("reader: \(String(describing: reader.error))") }
        writerInput.markAsFinished()
        await writer.finishWriting()
        if writer.status != .completed { fail("finish: \(String(describing: writer.error))") }
        print("wrote \(output.lastPathComponent) at \(width)x\(height)")
        semaphore.signal()
    } catch {
        fail("error: \(error)")
    }
}
semaphore.wait()
