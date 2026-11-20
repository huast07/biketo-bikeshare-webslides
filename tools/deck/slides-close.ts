import { createElement, createSlide, type Slide } from '@webslides/schema';
import { card, COLORS, CONTENT_WIDTH, eyebrow, SLIDE, text, title } from './kit';
import { appIcon, appStoreButton } from './slides-story';

const SOURCES = [
  ['City of Toronto Open Data', 'Cycling network and bike parking'],
  ['OpenStreetMap', 'Every street and path in Toronto'],
  ['Bike Share Toronto', 'Live station feed: bikes and docks'],
  ['TTC', 'Schedules for subway, streetcar and bus'],
] as const;
const SOURCE = { x: SLIDE.left, width: 480, height: 140, top: 262, gap: 22 } as const;
const ENGINE = { x: 720, y: 262, width: 560, height: 626 } as const;
const APP = { x: 1420, y: 262, width: 390, height: 626 } as const;
const ARROW_HEIGHT = 24;

function arrow(id: string, x1: number, x2: number, y: number) {
  return createElement('shape', {
    id,
    shape: 'arrow',
    x: x1,
    y: y - ARROW_HEIGHT / 2,
    width: x2 - x1,
    height: ARROW_HEIGHT,
    style: { stroke: COLORS.greenSoft, strokeWidth: 4 },
    phone: { hidden: true },
  });
}

function sourceCard(index: number) {
  const [heading, body] = SOURCES[index] ?? ['', ''];
  const y = SOURCE.top + index * (SOURCE.height + SOURCE.gap);
  return [
    card(`how_source_card${index + 1}`, { x: SOURCE.x, y, width: SOURCE.width, height: SOURCE.height }),
    text(
      `how_source${index + 1}`,
      { x: SOURCE.x + 32, y: y + 26, width: SOURCE.width - 64, height: SOURCE.height - 40 },
      `<p><strong>${heading}</strong></p><p style="color: ${COLORS.muted}">${body}</p>`,
      { fontSize: 24, lineHeight: 1.3 },
    ),
    arrow(`how_arrow${index + 1}`, SOURCE.x + SOURCE.width + 16, ENGINE.x - 16, y + SOURCE.height / 2),
  ];
}

export function howSlide(): Slide {
  const engineText =
    `<h3 style="color: ${COLORS.greenSoft}">BikeTO routing on Google Cloud</h3><ul>` +
    '<li>Merges the City’s cycling network into the map and repairs gaps between bike lanes</li>' +
    '<li>Scores every street by its bike infrastructure for the two route styles</li>' +
    '<li>Joins bike legs with TTC trips, including the TTC’s bikes-on-board rules</li>' +
    '<li>Watches live Bike Share counts to switch full stations</li></ul>';
  return createSlide({
    id: 'how',
    name: 'How it works',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'For anyone who asks how reliable it is: BikeTO runs its own routing servers (GraphHopper for bikes, OpenTripPlanner for transit) built from public data, refreshed regularly. Nothing depends on a rider account.',
    elements: [
      eyebrow('how_eyebrow', 'HOW IT WORKS'),
      title('how_title', 'Built on Toronto’s own data'),
      ...[0, 1, 2, 3].flatMap(sourceCard),
      card('how_engine_card', ENGINE),
      text(
        'how_engine',
        { x: ENGINE.x + 44, y: ENGINE.y + 44, width: ENGINE.width - 88, height: ENGINE.height - 80 },
        engineText,
        { fontSize: 25, lineHeight: 1.4 },
      ),
      arrow('how_arrow_app', ENGINE.x + ENGINE.width + 16, APP.x - 16, ENGINE.y + ENGINE.height / 2),
      card('how_app_card', APP),
      appIcon('how_app_icon', APP.x + (APP.width - 170) / 2, APP.y + 70, 170),
      text(
        'how_app',
        { x: APP.x + 36, y: APP.y + 280, width: APP.width - 72, height: 300 },
        `<h3>BikeTO on iPhone</h3><p style="color: ${COLORS.muted}">Version 2.0 on the App Store. No account, no ads, no tracking: settings stay on the phone.</p>`,
        { fontSize: 25, lineHeight: 1.35, align: 'center' },
      ),
    ],
  });
}

const BENEFITS = [
  ['Safer, more confident riders', 'Routes that favour bike lanes and quiet streets help new riders try Bike Share, and come back.'],
  ['Fewer bad moments', 'Pass countdowns and full-dock rerouting deal with overtime fees and full stations before they happen.'],
  ['Connected to transit', 'Bike Share becomes the first and last kilometre of TTC trips, planned in one place.'],
  ['Ready today, at no cost', 'BikeTO 2.0 is live on the App Store and built on open data, with no ads and no tracking.'],
] as const;
const BENEFIT = { width: 830, height: 300, gapX: 40, gapY: 36, top: 280 } as const;

function benefitCard(index: number) {
  const [heading, body] = BENEFITS[index] ?? ['', ''];
  const x = SLIDE.left + (index % 2) * (BENEFIT.width + BENEFIT.gapX);
  const y = BENEFIT.top + Math.floor(index / 2) * (BENEFIT.height + BENEFIT.gapY);
  return [
    card(`why_card${index + 1}`, { x, y, width: BENEFIT.width, height: BENEFIT.height }),
    text(
      `why_text${index + 1}`,
      { x: x + 50, y: y + 46, width: BENEFIT.width - 100, height: BENEFIT.height - 80 },
      `<h3 style="color: ${COLORS.greenSoft}">${heading}</h3><p>${body}</p>`,
      { fontSize: 32, lineHeight: 1.4 },
    ),
  ];
}

export function whySlide(): Slide {
  return createSlide({
    id: 'why',
    name: 'Why it matters',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'Tie the product back to Bike Share’s goals: ridership, rider safety and satisfaction, and integration with transit. BikeTO already does this work for Bike Share riders today.',
    elements: [
      eyebrow('why_eyebrow', 'WHY IT MATTERS TO BIKE SHARE TORONTO'),
      title('why_title', 'Better trips mean more riders'),
      ...[0, 1, 2, 3].flatMap(benefitCard),
    ],
  });
}

interface AskOption {
  tier: string;
  color: string;
  heading: string;
  body: string;
  detail: string;
}

const ASKS: readonly AskOption[] = [
  {
    tier: 'BEST CASE',
    color: COLORS.green,
    heading: 'Integrate bike scanning into BikeTO',
    body: 'Riders scan a Bike Share bike in BikeTO to unlock it, and the ride flows straight into navigation, pass tracking and docking.',
    detail: 'One app from planning to docking. Needs access to Bike Share’s rental and unlock platform, and member sign-in.',
  },
  {
    tier: 'NEXT BEST CASE',
    color: COLORS.sky,
    heading: 'Bring BikeTO’s features into the Bike Share app',
    body: 'Work with Bike Share’s team to add bike-lane routing, turn-by-turn guidance, pass countdowns and full-dock rerouting to the official app.',
    detail: 'Plus 3D designs for phone attachments on Bike Share bikes, so riders can follow directions hands-free.',
  },
  {
    tier: 'ALTERNATIVE CASE',
    color: COLORS.gold,
    heading: 'Partner app for safe bike navigation',
    body: 'Work with Bike Share to raise awareness of BikeTO as a partner app that helps Toronto cyclists navigate safely.',
    detail: 'For example through the Bike Share app, website, newsletters, social media and station signage.',
  },
];
const ASK = { width: 540, height: 680, gap: 40, top: 262 } as const;
const BADGE = { height: 54, width: 290 } as const;

function askCard(option: AskOption, index: number) {
  const x = SLIDE.left + index * (ASK.width + ASK.gap);
  const inner = x + 44;
  const innerWidth = ASK.width - 88;
  return [
    card(`ask_card${index + 1}`, { x, y: ASK.top, width: ASK.width, height: ASK.height }),
    createElement('shape', {
      id: `ask_badge${index + 1}`,
      shape: 'roundRect',
      x: inner,
      y: ASK.top + 44,
      width: BADGE.width,
      height: BADGE.height,
      html: `<p>${option.tier}</p>`,
      textStyle: { fontSize: 20, fontWeight: 800, letterSpacing: 2, color: COLORS.navy, align: 'center', verticalAlign: 'middle' },
      style: { fill: option.color, radius: BADGE.height / 2 },
    }),
    text(
      `ask_text${index + 1}`,
      { x: inner, y: ASK.top + 130, width: innerWidth, height: ASK.height - 170 },
      `<h3>${option.heading}</h3><p>${option.body}</p><p>&nbsp;</p><p style="color: ${COLORS.muted}">${option.detail}</p>`,
      { fontSize: 29, lineHeight: 1.4 },
    ),
  ];
}

export function askSlide(): Slide {
  return createSlide({
    id: 'ask',
    name: 'The ask',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'Three ways to work together, from deepest to lightest. Best case: scanning and unlocking Bike Share bikes inside BikeTO. Next best: bring BikeTO features into the Bike Share app, plus phone attachments for the bikes (3D designs are ready). Alternative: promote BikeTO as a partner app. Ask which path they want to explore, and who to follow up with.',
    elements: [
      eyebrow('ask_eyebrow', 'THE ASK'),
      title('ask_title', 'Three ways to work together'),
      ...ASKS.flatMap(askCard),
    ],
  });
}

export function closeSlide(): Slide {
  return createSlide({
    id: 'close',
    name: 'Thank you',
    hideMaster: true,
    transition: { effect: 'fade', duration: 500 },
    notes: 'Thank them, and propose a working session with the product and partnerships team to pick a path.',
    elements: [
      appIcon('close_icon', (SLIDE.width - 180) / 2, 220, 180),
      text(
        'close_title',
        { x: SLIDE.left, y: 440, width: CONTENT_WIDTH, height: 130 },
        '<h1>Thank you</h1>',
        { fontSize: 48, fontWeight: 800, align: 'center' },
      ),
      text(
        'close_next',
        { x: 360, y: 590, width: 1200, height: 130 },
        '<p>Next step: a working session with Bike Share’s product and partnerships team to choose a path.</p>',
        { fontSize: 34, lineHeight: 1.35, align: 'center', color: COLORS.greenSoft },
      ),
      appStoreButton('close_store', (SLIDE.width - 520) / 2, 760),
      text(
        'close_presenter',
        { x: SLIDE.left, y: 890, width: CONTENT_WIDTH, height: 50 },
        '<p>Sterling Huang, creator of BikeTO</p>',
        { fontSize: 26, align: 'center', color: COLORS.muted },
      ),
    ],
  });
}
