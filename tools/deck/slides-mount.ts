import { createElement, createSlide, type Element as SlideElement, type Slide } from '@webslides/schema';
import { card, COLORS, detailPanel, eyebrow, onClickSetVisibility, SLIDE, text, title } from './kit';

/** Width over height of the concept SVG's view box. */
const RENDER_RATIO = 1000 / 1100;
const RENDER = { x: SLIDE.left + 20, y: 215, height: 800 } as const;
const COLUMN = { x: 930, width: SLIDE.right - 930 } as const;
const ROW = { top: 270, height: 150, marker: 60 } as const;
/** Scale from the SVG's view box units to slide pixels. */
const RENDER_SCALE = RENDER.height / 1100;
const HOTSPOT_SIZE = 48;
/** The numbered markers' centres in the SVG (tools/mount_concept.py draws them). */
const SVG_MARKERS = [
  [712, 868],
  [690, 150],
  [500, 800],
] as const;
/** Detail panels cover the parts column, so the render stays in view beside them. */
const PANEL_BOX = { x: COLUMN.x, y: RENDER.y, width: COLUMN.width, height: 640 } as const;

const PARTS = [
  ['Tool-free clamp', 'Fits beside the stem, with no changes to the bike.'],
  ['Four-corner cradle', 'Spring-loaded corners hold most phones, with or without a case.'],
  ['Tilt joint', 'Angles the screen toward the rider, so a glance is enough.'],
] as const;

const PART_DETAILS = [
  `<p>Wraps the handlebar beside the stem and closes with a quick-release lever, so it goes on and comes off in seconds without tools.</p>
<h3 style="color: ${COLORS.greenSoft}">Design notes</h3><ul><li>Rubber-lined jaws grip firmly without scratching the bar</li><li>Sits clear of the bell, brake levers and basket</li><li>Nothing on the bike is drilled or replaced</li></ul>
<h3 style="color: ${COLORS.greenSoft}">To work out with Bike Share</h3><ul><li>Handlebar sizes on each bike model, including e-bikes</li><li>Whether mounts stay on the bikes or riders bring their own</li></ul>`,
  `<p>Four spring-loaded corners hold the phone by its edges, so one design fits most phones, with or without a case.</p>
<h3 style="color: ${COLORS.greenSoft}">Design notes</h3><ul><li>Open sides keep the buttons, charging port and camera free</li><li>Padded corners soften bumps from potholes and streetcar tracks</li><li>One hand to put the phone in and take it out</li></ul>
<h3 style="color: ${COLORS.greenSoft}">To work out with Bike Share</h3><ul><li>Which phone sizes to support</li><li>Ride tests on rough Toronto streets</li></ul>`,
  `<p>A ball joint between the arm and the cradle angles the screen toward the rider and holds it there.</p>
<h3 style="color: ${COLORS.greenSoft}">Design notes</h3><ul><li>Tilts for riders of different heights</li><li>Turns for portrait or landscape</li><li>Firm enough to stay put over bumps</li></ul>
<h3 style="color: ${COLORS.greenSoft}">To work out with Bike Share</h3><ul><li>Readability in bright sun and glare</li><li>Durability for a fleet that lives outdoors all year</li></ul>`,
] as const;

const panelId = (index: number) => `mount_panel${index + 1}`;

/**
 * Phone reading order: title, render, then each part's text, its details button and its panel,
 * then the callout. Without it the hotspots would follow their spots on the render (2, 3, 1).
 */
const PHONE_ORDER = { eyebrow: 0, title: 1, render: 2, firstPart: 3, perPart: 3, callout: 12 } as const;
const partOrder = (index: number, offset: 0 | 1 | 2) => ({ order: PHONE_ORDER.firstPart + index * PHONE_ORDER.perPart + offset });

/** A pulsing hotspot over a numbered marker on the render; it opens that part's panel and closes the others. */
function partHotspot(index: number) {
  const [svgX, svgY] = SVG_MARKERS[index] ?? [0, 0];
  const [heading] = PARTS[index] ?? [''];
  const others = [0, 1, 2].filter((other) => other !== index);
  return createElement('hotspot', {
    id: `mount_hotspot${index + 1}`,
    label: `${heading} details`,
    phone: partOrder(index, 1),
    x: Math.round(RENDER.x + svgX * RENDER_SCALE - HOTSPOT_SIZE / 2),
    y: Math.round(RENDER.y + svgY * RENDER_SCALE - HOTSPOT_SIZE / 2),
    width: HOTSPOT_SIZE,
    height: HOTSPOT_SIZE,
    interactions: [
      onClickSetVisibility(`mount_hotspot${index + 1}_toggle`, panelId(index), 'toggle'),
      ...others.map((other) => onClickSetVisibility(`mount_hotspot${index + 1}_hide${other + 1}`, panelId(other), 'hide')),
    ],
  });
}

function partPanel(index: number) {
  const [heading] = PARTS[index] ?? [''];
  return { ...detailPanel(panelId(index), `${index + 1}. ${heading}`, PART_DETAILS[index] ?? '', PANEL_BOX), phone: partOrder(index, 2) };
}

function withPhoneOrder(element: SlideElement, order: number): SlideElement {
  return { ...element, phone: { ...element.phone, order } };
}

/** A numbered marker matching the green numbers drawn on the render. */
function marker(id: string, number: number, y: number) {
  return createElement('shape', {
    id,
    shape: 'ellipse',
    x: COLUMN.x,
    y,
    width: ROW.marker,
    height: ROW.marker,
    html: `<p>${number}</p>`,
    textStyle: { fontSize: 26, fontWeight: 700, color: COLORS.greenSoft, align: 'center', verticalAlign: 'middle' },
    style: { fill: COLORS.navy, stroke: COLORS.greenSoft, strokeWidth: 4 },
    // On phones the hotspot buttons carry the part names and numbers instead.
    phone: { hidden: true },
  });
}

function partRow(index: number) {
  const [heading, body] = PARTS[index] ?? ['', ''];
  const y = ROW.top + index * ROW.height;
  return [
    marker(`mount_marker${index + 1}`, index + 1, y),
    withPhoneOrder(text(
      `mount_part${index + 1}`,
      { x: COLUMN.x + ROW.marker + 30, y: y - 4, width: COLUMN.width - ROW.marker - 30, height: ROW.height - 20 },
      `<p><strong>${heading}</strong></p><p style="color: ${COLORS.muted}">${body}</p>`,
      { fontSize: 28, lineHeight: 1.35 },
    ), partOrder(index, 0).order),
  ];
}

export function mountSlide(): Slide {
  return createSlide({
    id: 'mount',
    name: 'Phone mount concept',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'A concept render of the phone attachment for Bike Share bikes: a tool-free clamp beside the stem, a four-corner cradle and a tilt joint. It shows the idea; the 3D designs are ready to prototype with Bike Share. This is part of option 2 on the following slide. Click a pulsing number on the render to open that part’s details.',
    elements: [
      withPhoneOrder(eyebrow('mount_eyebrow', 'CONCEPT RENDER'), PHONE_ORDER.eyebrow),
      withPhoneOrder(title('mount_title', 'Hands-free riding: a phone mount for Bike Share bikes'), PHONE_ORDER.title),
      createElement('image', {
        phone: { order: PHONE_ORDER.render },
        id: 'mount_render',
        src: 'images/phone-mount-concept.svg',
        x: RENDER.x,
        y: RENDER.y,
        width: Math.round(RENDER.height * RENDER_RATIO),
        height: RENDER.height,
        fit: 'contain',
        altText:
          'Concept render: an iPhone showing BikeTO turn-by-turn directions, held in a green four-corner cradle on a tilt joint, clamped to a bike handlebar beside the stem',
      }),
      ...[0, 1, 2].flatMap(partRow),
      card('mount_callout_card', { x: COLUMN.x, y: 730, width: COLUMN.width, height: 230 }),
      withPhoneOrder(text(
        'mount_callout',
        { x: COLUMN.x + 40, y: 760, width: COLUMN.width - 80, height: 180 },
        `<p>Paired with BikeTO’s spoken directions and Lock Screen guidance, riders keep their eyes on the road.</p><p style="color: ${COLORS.muted}">Concept render for illustration; the 3D designs are ready to prototype with Bike Share.</p>`,
        { fontSize: 25, lineHeight: 1.4 },
      ), PHONE_ORDER.callout),
      ...[0, 1, 2].map(partHotspot),
      ...[0, 1, 2].map(partPanel),
    ],
  });
}
