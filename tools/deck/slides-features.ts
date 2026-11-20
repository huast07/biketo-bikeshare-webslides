import { createSlide, type Slide } from '@webslides/schema';
import { bullets, card, COLORS, eyebrow, phone, SCREENSHOT_RATIO, SLIDE, text, title } from './kit';

interface Feature {
  id: string;
  heading: string;
  points: readonly (readonly [string, string])[];
  forBikeShare: string;
  phones: readonly (readonly [string, string])[];
  notes: string;
}

const FEATURE_COUNT = 4;
const PHONE_AREA = { top: 230, bottom: 1000 } as const;
/** Phone height and gap for two or three screenshots side by side. */
const PHONE_LAYOUT: Record<number, { height: number; gap: number }> = {
  2: { height: 800, gap: 36 },
  3: { height: 680, gap: 24 },
};
const COLUMN_GAP = 70;
const CALLOUT = { y: 770, height: 190 } as const;

function phoneRow(feature: Feature) {
  const layout = PHONE_LAYOUT[feature.phones.length] ?? { height: 800, gap: 36 };
  const width = Math.round(layout.height * SCREENSHOT_RATIO);
  const rowWidth = feature.phones.length * width + (feature.phones.length - 1) * layout.gap;
  const left = SLIDE.right - rowWidth;
  const y = Math.round((PHONE_AREA.top + PHONE_AREA.bottom - layout.height) / 2);
  const elements = feature.phones.map(([file, alt], index) =>
    phone(`${feature.id}_phone${index + 1}`, file, left + index * (width + layout.gap), y, layout.height, alt),
  );
  return { elements, left };
}

function featureSlide(feature: Feature, index: number): Slide {
  const row = phoneRow(feature);
  const columnWidth = row.left - COLUMN_GAP - SLIDE.left;
  return createSlide({
    id: feature.id,
    name: feature.heading,
    transition: { effect: 'fade', duration: 400 },
    notes: feature.notes,
    elements: [
      eyebrow(`${feature.id}_eyebrow`, `FEATURE ${index + 1} OF ${FEATURE_COUNT}`),
      title(`${feature.id}_title`, feature.heading, { width: columnWidth, height: 140 }),
      text(
        `${feature.id}_points`,
        { x: SLIDE.left, y: 310, width: columnWidth, height: 430 },
        bullets(feature.points),
        { fontSize: 29, lineHeight: 1.4 },
      ),
      card(`${feature.id}_callout_card`, { x: SLIDE.left, y: CALLOUT.y, width: columnWidth, height: CALLOUT.height }),
      text(
        `${feature.id}_callout`,
        { x: SLIDE.left + 40, y: CALLOUT.y + 30, width: columnWidth - 80, height: CALLOUT.height - 50 },
        `<p style="color: ${COLORS.greenSoft}"><strong>How it could help Bike Share riders</strong></p><p>${feature.forBikeShare}</p>`,
        { fontSize: 24, lineHeight: 1.35 },
      ),
      ...row.elements,
    ],
  });
}

const FEATURES: readonly Feature[] = [
  {
    id: 'routes',
    heading: 'Riders choose their streets',
    points: [
      ['Two route styles.', 'Bike lanes only, or bike lanes plus quiet neighbourhood roads.'],
      ['Bike-lane share on every route.', 'Riders see, for example, 93% vs 88% on bike lanes before they go.'],
      ['A clear trade-off.', 'BikeTO says how much time the other route saves, such as “Saves 6 min”.'],
      ['Their favourite first.', 'The rider’s preferred route style is always listed on top.'],
    ],
    forBikeShare:
      'New and occasional riders can pick routes they feel comfortable on, which may help them ride again.',
    phones: [
      ['01-bike-lanes-only', 'Route options to Christie Pits Park: 32 minutes on bike lanes only, or 26 minutes with neighbourhood roads'],
      ['02-neighbourhood-roads', 'The faster neighbourhood-roads route selected, saving 6 minutes with 88% on bike lanes'],
    ],
    notes:
      'Routes are built from the City of Toronto cycling network merged into OpenStreetMap, with gaps in the bike lane network repaired, so the bike-lane percentage is real.',
  },
  {
    id: 'bikeshare',
    heading: 'Made for Bike Share trips',
    points: [
      ['Walk to a station with bikes.', 'Live bike and e-bike counts from Bike Share Toronto’s station feed.'],
      ['Pass countdown.', 'Time left on the pass stays on screen, and on the Lock Screen, while riding.'],
      ['Full dock on the way.', 'If the destination station fills up on the way, BikeTO reroutes to the next one and says why.'],
      ['Ends at a free dock.', 'Trips finish at a station with open docks, then walk the last few metres.'],
    ],
    forBikeShare:
      'Could help riders avoid overtime fees and full docks, two common frustrations.',
    phones: [
      ['09-bike-share-pass-timer', 'A Bike Share ride showing 18 minutes left on the pass'],
      ['08-station-full-switched', 'BikeTO switching to Queen St W / Bathurst St because Bloor St W / Shaw St is full'],
    ],
    notes:
      'This is the feature set built specifically for Bike Share riders. The station-full switch uses the live station feed while the rider is moving.',
  },
  {
    id: 'transit',
    heading: 'Bike + Transit, and a place to park',
    points: [
      ['Bike and ride.', 'Ride to a subway station, park, and take the TTC, with live departures.'],
      ['Bike on board.', 'Knows the TTC’s rules, such as no bikes on the subway at weekday rush hour, and plans around them.'],
      ['TTC, then Bike Share.', 'Connects the last part of a trip from a station to a Bike Share dock.'],
      ['Ready to park.', 'Own-bike trips end at a City bike parking spot, with rack type and spaces.'],
    ],
    forBikeShare: 'Shows Bike Share as a way to cover the first and last kilometre of TTC trips.',
    phones: [
      ['03-bike-and-ride-on-the-ttc', 'A bike-and-ride trip that parks at the station because bikes are not allowed on the subway at rush hour'],
      ['04-ttc-then-bike-share', 'A trip that takes the TTC to Union Station, then Bike Share for the last part'],
      ['06-park-your-bike', 'Arriving at a ring-and-post bike parking spot with 2 spaces at 750 Bloor St W'],
    ],
    notes:
      'Transit trips come from OpenTripPlanner with the TTC GTFS feed, so departures and stops are the TTC’s own schedule.',
  },
  {
    id: 'guidance',
    heading: 'Turn-by-turn guidance, even when locked',
    points: [
      ['Spoken directions.', 'A banner for the next turn and a step list for the whole trip.'],
      ['Rerouting.', 'Miss a turn and BikeTO finds a new way.'],
      ['Lock Screen and Dynamic Island.', 'The trip keeps going with the phone locked, through a Live Activity.'],
      ['A map for cyclists.', 'Bike lanes, Bike Share stations with live counts, bike parking and repair shops.'],
    ],
    forBikeShare:
      'Spoken directions help riders keep their eyes on the road. A phone mount on Bike Share bikes could help further.',
    phones: [
      ['07-turn-by-turn', 'Turn-by-turn guidance: in 150 metres, turn left onto Bay West Teamway'],
      ['10-lock-screen-live-activity', 'The next turn shown as a Live Activity on the iPhone Lock Screen'],
    ],
    notes:
      'Riders should not be looking at their phone while riding. Spoken directions and the Lock Screen Live Activity mean they rarely need to. This sets up the phone mount idea in the ask.',
  },
];

export function featureSlides(): Slide[] {
  return FEATURES.map(featureSlide);
}
