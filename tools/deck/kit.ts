import {
  createElement,
  DEFAULT_EXTRA_ACCENTS,
  type Element as SlideElement,
  type TextStyle,
  type Theme,
} from '@webslides/schema';

/** BikeTO's colours, taken from the App Store artwork: navy page, Go-button green, sky blue. */
export const COLORS = {
  navy: '#091a2a',
  card: '#11283d',
  cardEdge: '#1d3a55',
  white: '#ffffff',
  muted: '#a9bccd',
  green: '#22a05a',
  greenSoft: '#7fdaa6',
  sky: '#5bb8f0',
  gold: '#f2c14e',
} as const;

const FONT_STACK =
  '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const BIKETO_THEME: Theme = {
  name: 'BikeTO',
  colors: {
    background: COLORS.navy,
    surface: COLORS.card,
    text: COLORS.white,
    muted: COLORS.muted,
    accent: COLORS.green,
    accent2: COLORS.sky,
    ...DEFAULT_EXTRA_ACCENTS,
  },
  fonts: { heading: FONT_STACK, body: FONT_STACK, mono: 'Menlo, Consolas, monospace' },
  baseFontSize: 28,
};

export const APP_STORE_URL = 'https://apps.apple.com/ca/app/biketo/id6761314510';

/** Slide geometry, in slide pixels of the 1920x1080 canvas. */
export const SLIDE = { width: 1920, height: 1080, left: 110, right: 1810 } as const;
export const CONTENT_WIDTH = SLIDE.right - SLIDE.left;
/** Width over height of the App Store screenshots and the screen recordings. */
export const SCREENSHOT_RATIO = 640 / 1391;
export const RECORDING_RATIO = 720 / 1564;
export const BIKE_SHARE_RECORDING_RATIO = 720 / 1280;

const CARD_RADIUS = 28;
const PHONE_RADIUS = 36;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function text(id: string, box: Box, html: string, textStyle: TextStyle = {}): SlideElement {
  return createElement('text', { id, ...box, html, textStyle });
}

/** A small green label above a slide title, such as "CORE FEATURE". */
export function eyebrow(id: string, label: string, y = 92): SlideElement {
  return text(id, { x: SLIDE.left, y, width: 1200, height: 40 }, `<p>${label}</p>`, {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 3,
    color: COLORS.greenSoft,
  });
}

/** The slide title as a Heading 2, which the viewer also uses as the slide's name. */
export function title(id: string, heading: string, box: Partial<Box> = {}): SlideElement {
  return text(
    id,
    { x: SLIDE.left, y: 136, width: CONTENT_WIDTH, height: 90, ...box },
    `<h2>${heading}</h2>`,
    { fontSize: 32, fontWeight: 700, color: COLORS.white },
  );
}

/** A rounded card behind other elements. */
export function card(id: string, box: Box, fill: string = COLORS.card): SlideElement {
  return createElement('shape', {
    id,
    shape: 'roundRect',
    ...box,
    style: { fill, stroke: COLORS.cardEdge, strokeWidth: 2, radius: CARD_RADIUS },
    phone: { hidden: true },
  });
}

/** An App Store screenshot of BikeTO, `height` tall, with its top-left corner at x, y. */
export function phone(id: string, file: string, x: number, y: number, height: number, alt: string) {
  return createElement('image', {
    id,
    src: `images/${file}.jpg`,
    x,
    y,
    width: Math.round(height * SCREENSHOT_RATIO),
    height,
    fit: 'contain',
    altText: alt,
    style: { radius: PHONE_RADIUS, shadow: true },
  });
}

/**
 * A muted, looping screen recording that starts playing when its slide opens and keeps its
 * controls so the presenter can pause or scrub.
 */
export function video(id: string, file: string, box: Box, alt: string): SlideElement {
  return createElement('media', {
    id,
    mediaKind: 'video',
    src: `media/${file}.mp4`,
    ...box,
    controls: true,
    loop: true,
    altText: alt,
    style: { radius: PHONE_RADIUS, fill: '#000000', shadow: true },
    interactions: [
      {
        id: `${id}_autoplay`,
        trigger: 'slideEnter',
        action: { type: 'playMedia', targetId: id, mode: 'play' },
      },
    ],
  });
}

/** A video box `height` tall with the recording's width over height. */
export function videoBox(x: number, y: number, height: number, ratio = RECORDING_RATIO): Box {
  return { x, y, width: Math.round(height * ratio), height };
}

/** A bulleted list with a bold lead-in on each item. */
export function bullets(items: readonly (readonly [string, string])[]): string {
  const rows = items.map(([lead, body]) => `<li><strong>${lead}</strong> ${body}</li>`).join('');
  return `<ul>${rows}</ul>`;
}

/** A short caption under a video or screenshot. */
export function caption(id: string, box: Box, heading: string, body: string): SlideElement {
  return text(
    id,
    box,
    `<p><strong>${heading}</strong></p><p style="color: ${COLORS.muted}">${body}</p>`,
    { fontSize: 22, align: 'center', lineHeight: 1.25 },
  );
}

type VisibilityMode = 'show' | 'hide' | 'toggle';

/** A click interaction that shows, hides or toggles another element (a pop-up panel here). */
export function onClickSetVisibility(id: string, targetId: string, mode: VisibilityMode) {
  return { id, trigger: 'click' as const, action: { type: 'setVisibility' as const, targetId, mode } };
}

/** A pop-up panel, hidden until a hotspot or button opens it. */
export function detailPanel(
  id: string,
  heading: string,
  html: string,
  box: Box,
  options: { modal?: boolean; placement?: 'center' | 'left' | 'right' | 'bottom'; size?: number } = {},
): SlideElement {
  return createElement('panel', { id, title: heading, html, ...box, ...options });
}
