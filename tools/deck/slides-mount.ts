import { createElement, createSlide, type Slide } from '@webslides/schema';
import { card, COLORS, eyebrow, SLIDE, text, title } from './kit';

/** Width over height of the concept SVG's view box. */
const RENDER_RATIO = 1000 / 1100;
const RENDER = { x: SLIDE.left + 20, y: 215, height: 800 } as const;
const COLUMN = { x: 930, width: SLIDE.right - 930 } as const;
const ROW = { top: 270, height: 150, marker: 60 } as const;

const PARTS = [
  ['Tool-free clamp', 'Fits beside the stem, with no changes to the bike.'],
  ['Four-corner cradle', 'Spring-loaded corners hold most phones, with or without a case.'],
  ['Tilt joint', 'Angles the screen toward the rider, so a glance is enough.'],
] as const;

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
  });
}

function partRow(index: number) {
  const [heading, body] = PARTS[index] ?? ['', ''];
  const y = ROW.top + index * ROW.height;
  return [
    marker(`mount_marker${index + 1}`, index + 1, y),
    text(
      `mount_part${index + 1}`,
      { x: COLUMN.x + ROW.marker + 30, y: y - 4, width: COLUMN.width - ROW.marker - 30, height: ROW.height - 20 },
      `<p><strong>${heading}</strong></p><p style="color: ${COLORS.muted}">${body}</p>`,
      { fontSize: 28, lineHeight: 1.35 },
    ),
  ];
}

export function mountSlide(): Slide {
  return createSlide({
    id: 'mount',
    name: 'Phone mount concept',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'A concept render of the phone attachment for Bike Share bikes: a tool-free clamp beside the stem, a four-corner cradle and a tilt joint. It shows the idea; the 3D designs are ready to prototype with Bike Share. This is part of the next best case on the following slide.',
    elements: [
      eyebrow('mount_eyebrow', 'CONCEPT RENDER'),
      title('mount_title', 'Hands-free riding: a phone mount for Bike Share bikes'),
      createElement('image', {
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
      text(
        'mount_callout',
        { x: COLUMN.x + 40, y: 760, width: COLUMN.width - 80, height: 180 },
        `<p>Paired with BikeTO’s spoken directions and Lock Screen guidance, riders keep their eyes on the road.</p><p style="color: ${COLORS.muted}">Concept render for illustration; the 3D designs are ready to prototype with Bike Share.</p>`,
        { fontSize: 25, lineHeight: 1.4 },
      ),
    ],
  });
}
