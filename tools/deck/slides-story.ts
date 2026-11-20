import { createElement, createSlide, type Slide } from '@webslides/schema';
import {
  APP_STORE_URL,
  card,
  COLORS,
  CONTENT_WIDTH,
  eyebrow,
  phone,
  SLIDE,
  text,
  title,
} from './kit';

const ICON_SIZE = 150;

/** A primary button that opens the App Store page in a new tab. */
export function appStoreButton(id: string, x: number, y: number) {
  return createElement('button', {
    id,
    label: 'Get BikeTO on the App Store',
    variant: 'primary',
    x,
    y,
    width: 520,
    height: 84,
    style: { radius: 42 },
    interactions: [
      {
        id: `${id}_open`,
        trigger: 'click',
        action: { type: 'openLink', url: APP_STORE_URL, newTab: true },
      },
    ],
  });
}

export function appIcon(id: string, x: number, y: number, size = ICON_SIZE) {
  return createElement('image', {
    id,
    src: 'images/app-icon.png',
    x,
    y,
    width: size,
    height: size,
    fit: 'cover',
    altText: 'BikeTO app icon',
    style: { radius: Math.round(size * 0.22), shadow: true },
  });
}

export function titleSlide(): Slide {
  return createSlide({
    id: 'title',
    name: 'BikeTO',
    hideMaster: true,
    transition: { effect: 'fade', duration: 500 },
    notes:
      'Introduce BikeTO: a free iPhone app for turn-by-turn bike navigation in Toronto, with Bike Share, bike parking and the TTC built in. Goal for today: show the product, then agree on how we work together.',
    elements: [
      eyebrow('title_eyebrow', 'BRIEFING FOR BIKE SHARE TORONTO LEADERSHIP', 150),
      appIcon('title_icon', SLIDE.left, 230),
      text(
        'title_name',
        { x: SLIDE.left, y: 410, width: 900, height: 130 },
        '<h1>BikeTO</h1>',
        { fontSize: 50, fontWeight: 800, color: COLORS.white },
      ),
      text(
        'title_tagline',
        { x: SLIDE.left, y: 550, width: 860, height: 150 },
        '<p>Safer bike navigation for Toronto, with Bike Share, bike parking and the TTC built in.</p>',
        { fontSize: 40, lineHeight: 1.25, color: COLORS.white },
      ),
      text(
        'title_status',
        { x: SLIDE.left, y: 720, width: 860, height: 50 },
        '<p>Live on the App Store &middot; Free &middot; No account, no ads, no tracking</p>',
        { fontSize: 26, fontWeight: 600, color: COLORS.greenSoft },
      ),
      appStoreButton('title_store', SLIDE.left, 800),
      text(
        'title_presenter',
        { x: SLIDE.left, y: 930, width: 860, height: 50 },
        '<p>Presented by Sterling Huang, creator of BikeTO</p>',
        { fontSize: 24, color: COLORS.muted },
      ),
      phone('title_phone1', '01-bike-lanes-only', 1010, 110, 860, 'BikeTO comparing a bike-lanes-only route with a faster route on quiet streets'),
      phone('title_phone2', '09-bike-share-pass-timer', 1420, 150, 860, 'BikeTO guiding a Bike Share ride with the time left on the pass'),
    ],
  });
}

const PROBLEMS = [
  [
    'Maps aren’t built for Toronto cyclists',
    'General map apps don’t let riders choose protected bike lanes over busy roads, or show how much of a route is on a bike lane.',
  ],
  [
    'One trip, three apps',
    'Riders find a bike in the Bike Share app, plan the route in a maps app and check the TTC in a third.',
  ],
  [
    'The hard parts happen mid-ride',
    'Pass time running out, a full dock at the destination, nowhere to lock up: riders find out when it’s too late.',
  ],
] as const;

const PROBLEM_CARD = { y: 300, width: 540, height: 470, gap: 40 } as const;

function problemCard(index: number) {
  const [heading, body] = PROBLEMS[index] ?? ['', ''];
  const x = SLIDE.left + index * (PROBLEM_CARD.width + PROBLEM_CARD.gap);
  const inner = { x: x + 44, y: PROBLEM_CARD.y + 50, width: PROBLEM_CARD.width - 88, height: 380 };
  return [
    card(`gap_card${index + 1}`, { x, y: PROBLEM_CARD.y, width: PROBLEM_CARD.width, height: PROBLEM_CARD.height }),
    text(
      `gap_text${index + 1}`,
      inner,
      `<p style="font-size: 64px; font-weight: 800; color: ${COLORS.green}">0${index + 1}</p><h3>${heading}</h3><p style="color: ${COLORS.muted}">${body}</p>`,
      { fontSize: 28, lineHeight: 1.35 },
    ),
  ];
}

export function gapSlide(): Slide {
  return createSlide({
    id: 'gap',
    name: 'The gap',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'Frame the rider’s experience today. Every Bike Share trip involves picking a bike, a route, maybe the TTC, and a dock. Today that is spread across apps, and the stressful moments (full docks, pass time) happen mid-ride.',
    elements: [
      eyebrow('gap_eyebrow', 'THE GAP'),
      title('gap_title', 'Toronto riders stitch every trip together across apps'),
      ...[0, 1, 2].flatMap(problemCard),
      text(
        'gap_answer',
        { x: SLIDE.left, y: 830, width: CONTENT_WIDTH, height: 120 },
        '<p>BikeTO brings the whole trip into one app, built on Toronto’s own open data.</p>',
        { fontSize: 38, fontWeight: 700, color: COLORS.greenSoft },
      ),
    ],
  });
}

const FEATURES = [
  ['Pick your streets', 'Bike lanes only, or bike lanes plus quiet neighbourhood roads.'],
  ['Built for Bike Share', 'Live bikes and docks, a pass countdown, and a new station if yours fills up.'],
  ['Bike + Transit', 'Ride to the subway or bring your bike on board, with live TTC departures.'],
  ['Turn-by-turn', 'Spoken directions, rerouting and a Live Activity on the Lock Screen.'],
  ['Ready to park', 'Own-bike trips end at a bike parking spot, with rack type and spaces.'],
  ['Private by design', 'No account, no ads, no tracking. Settings stay on the phone.'],
] as const;

const TILE = { width: 590, height: 210, gapX: 40, gapY: 26, top: 268 } as const;

function featureTile(index: number) {
  const [heading, body] = FEATURES[index] ?? ['', ''];
  const x = SLIDE.left + (index % 2) * (TILE.width + TILE.gapX);
  const y = TILE.top + Math.floor(index / 2) * (TILE.height + TILE.gapY);
  return [
    card(`glance_card${index + 1}`, { x, y, width: TILE.width, height: TILE.height }),
    text(
      `glance_text${index + 1}`,
      { x: x + 40, y: y + 34, width: TILE.width - 80, height: TILE.height - 60 },
      `<h3 style="color: ${COLORS.greenSoft}">${heading}</h3><p style="color: ${COLORS.muted}">${body}</p>`,
      { fontSize: 25, lineHeight: 1.35 },
    ),
  ];
}

export function glanceSlide(): Slide {
  return createSlide({
    id: 'glance',
    name: 'BikeTO at a glance',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'The six pillars of BikeTO 2.0, which shipped as a ground-up rebuild. The next four slides go deeper on the ones that matter most to Bike Share.',
    elements: [
      eyebrow('glance_eyebrow', 'BIKETO 2.0 AT A GLANCE'),
      title('glance_title', 'One app for every bike trip in Toronto'),
      ...[0, 1, 2, 3, 4, 5].flatMap(featureTile),
      phone('glance_phone', '07-turn-by-turn', 1420, 200, 800, 'BikeTO turn-by-turn guidance with the next turn and arrival time'),
    ],
  });
}
