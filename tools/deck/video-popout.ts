import { createElement, type Element as SlideElement } from '@webslides/schema';
import { type Box, detailPanel, onClickSetVisibility, SLIDE, video } from './kit';

/** Height of a video in its pop-out viewer, close to the slide's full height. */
const POPOUT_VIDEO_HEIGHT = 880;
/** Room for the pop-up's title bar above the video. */
const POPOUT_HEADER = 76;
const POPOUT_PADDING = 28;
const ENLARGE_BUTTON = { width: 112, height: 40, inset: 14 } as const;

/** Where the pop-out panel and its larger video sit, centred on the slide. */
function popoutLayout(box: Box) {
  const ratio = box.width / box.height;
  const videoWidth = Math.round(POPOUT_VIDEO_HEIGHT * ratio);
  const panel = {
    width: videoWidth + 2 * POPOUT_PADDING,
    height: POPOUT_HEADER + POPOUT_VIDEO_HEIGHT + POPOUT_PADDING,
  };
  const x = Math.round((SLIDE.width - panel.width) / 2);
  const y = Math.round((SLIDE.height - panel.height) / 2);
  return {
    panel: { x, y, ...panel },
    video: { x: x + POPOUT_PADDING, y: y + POPOUT_HEADER, width: videoWidth, height: POPOUT_VIDEO_HEIGHT },
  };
}

/**
 * A demo video with an Enlarge button on its top-right corner. The button pauses the video on
 * the slide and opens a pop-up playing a larger copy. On phones the video already fills the
 * width, so the button and pop-up are left out there.
 */
export function popoutVideo(id: string, file: string, box: Box, alt: string, heading: string): SlideElement[] {
  const layout = popoutLayout(box);
  const panelId = `${id}_popout`;
  const largeId = `${id}_large`;
  const onPhone = { hidden: true };
  const largeVideo = {
    ...video(largeId, file, layout.video, alt),
    autoplay: true,
    interactions: [],
    phone: onPhone,
  };
  const enlarge = createElement('button', {
    id: `${id}_enlarge`,
    label: 'Enlarge',
    variant: 'primary',
    x: box.x + box.width - ENLARGE_BUTTON.width - ENLARGE_BUTTON.inset,
    y: box.y + ENLARGE_BUTTON.inset,
    width: ENLARGE_BUTTON.width,
    height: ENLARGE_BUTTON.height,
    style: { radius: ENLARGE_BUTTON.height / 2 },
    phone: onPhone,
    interactions: [
      { id: `${id}_enlarge_pause`, trigger: 'click', action: { type: 'playMedia', targetId: id, mode: 'pause' } },
      onClickSetVisibility(`${id}_enlarge_open`, panelId, 'show'),
    ],
  });
  const panel = {
    ...detailPanel(panelId, heading, '', layout.panel, { modal: true }),
    contentIds: [largeId],
    phone: onPhone,
  };
  return [video(id, file, box, alt), enlarge, largeVideo, panel];
}
