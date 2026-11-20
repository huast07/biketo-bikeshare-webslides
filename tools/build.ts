/**
 * Builds the BikeTO deck and exports it with the Webslides exporter into site/, ready for
 * GitHub Pages. Run from biketo-deck/: see README.md.
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = resolve(import.meta.dirname, '..');
const SITE_DIR = join(ROOT, 'site');
const SOURCE_DIR = join(ROOT, 'site-src');
const WEBSLIDES = process.env.WEBSLIDES_DIR ?? join(homedir(), 'Coding/webslides');
const RUNTIME_DIR = join(WEBSLIDES, 'apps/viewer-runtime/dist');
const SITE_MARKER = 'This site was published with Webslides.\n';
const COPIED_FOLDERS = ['images', 'media'] as const;
/** Leftover temporary files a sandboxed writer can leave next to the real ones. */
const TEMP_FILE_MARKER = '.sb-';
const DOM_GLOBALS = ['window', 'document', 'navigator', 'Node', 'HTMLElement', 'DOMParser', 'Element'];

/** The exporter pre-renders slides and sanitizes rich text, so it needs a DOM. */
function installDom(): void {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://localhost/' });
  const source = dom.window as unknown as Record<string, unknown>;
  const target = globalThis as Record<string, unknown>;
  for (const key of DOM_GLOBALS) target[key] = source[key];
}

async function copyMedia(): Promise<void> {
  for (const folder of COPIED_FOLDERS) {
    await cp(join(SOURCE_DIR, folder), join(SITE_DIR, folder), {
      recursive: true,
      filter: (path) => !path.includes(TEMP_FILE_MARKER),
    });
  }
}

async function main(): Promise<void> {
  installDom();
  const { createBikeToDeck } = await import('./deck/deck');
  const { exportSite } = await import('@webslides/exporter');
  const deck = createBikeToDeck();
  const result = exportSite(deck, {
    runtimeJs: await readFile(join(RUNTIME_DIR, 'viewer.js'), 'utf8'),
    modelWorkerJs: await readFile(join(RUNTIME_DIR, 'model-worker.js'), 'utf8'),
  });
  if (!result.success) throw new Error(result.error);

  await rm(SITE_DIR, { recursive: true, force: true });
  for (const file of result.data.files) {
    const target = join(SITE_DIR, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.bytes);
  }
  await copyMedia();
  await writeFile(join(SITE_DIR, '.nojekyll'), '');
  await writeFile(join(SITE_DIR, '.webslides'), SITE_MARKER);
  await writeFile(join(ROOT, 'deck.json'), `${JSON.stringify(deck, null, 2)}\n`);
  process.stdout.write(`Exported ${deck.slides.length} slides to ${SITE_DIR}\n`);
}

// jsdom and the Vite runner keep handles open, so exit once the files are written.
main().then(() => process.exit(0)).catch((error: unknown) => {
  process.stderr.write(`Build failed: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});
