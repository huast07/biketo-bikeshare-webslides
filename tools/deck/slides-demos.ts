import { createSlide, type Slide } from '@webslides/schema';
import {
  BIKE_SHARE_RECORDING_RATIO,
  type Box,
  caption,
  COLORS,
  eyebrow,
  SLIDE,
  text,
  title,
  video,
  videoBox,
} from './kit';

/** Width over height of the App Store preview videos. */
const PREVIEW_RATIO = 720 / 1560;
const DEMO_COUNT = 3;
const CAPTION_HEIGHT = 90;
const CAPTION_GAP = 14;
const CAPTION_EXTRA_WIDTH = 120;

/** A caption centred under a video box. */
function captionUnder(id: string, box: Box, heading: string, body: string) {
  return caption(
    id,
    {
      x: box.x - CAPTION_EXTRA_WIDTH / 2,
      y: box.y + box.height + CAPTION_GAP,
      width: box.width + CAPTION_EXTRA_WIDTH,
      height: CAPTION_HEIGHT,
    },
    heading,
    body,
  );
}

const REEL = [
  ['preview-c', '1. Plan the trip', 'Compare routes and add the TTC'],
  ['preview-b', '2. Get to a bike', 'Walk to a station with bikes'],
  ['preview-a', '3. Ride and dock', 'Pass time in view, then a dock'],
] as const;
const REEL_LAYOUT = { y: 250, height: 640, gap: 130 } as const;

export function reelSlide(): Slide {
  const width = Math.round(REEL_LAYOUT.height * PREVIEW_RATIO);
  const rowWidth = REEL.length * width + (REEL.length - 1) * REEL_LAYOUT.gap;
  const left = Math.round((SLIDE.width - rowWidth) / 2);
  const elements = REEL.flatMap(([file, heading, body], index) => {
    const box = videoBox(left + index * (width + REEL_LAYOUT.gap), REEL_LAYOUT.y, REEL_LAYOUT.height, PREVIEW_RATIO);
    return [
      video(`reel_video${index + 1}`, file, box, `Screen recording: ${heading.slice(3)}. ${body}.`),
      captionUnder(`reel_caption${index + 1}`, box, heading, body),
    ];
  });
  return createSlide({
    id: 'reel',
    name: 'Demo: a Bike Share trip',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'Three short clips from the App Store previews, in trip order: plan to Christie Pits Park, come off the subway and walk to a Bike Share station, then ride with the pass countdown and dock. They start playing on their own; click a video to pause.',
    elements: [
      eyebrow('reel_eyebrow', `VIDEO DEMO 1 OF ${DEMO_COUNT}`),
      title('reel_title', 'A Bike Share trip in BikeTO, from search to dock'),
      ...elements,
    ],
  });
}

const PLANNING_HEIGHT = 680;
const PLANNING_TOP = 240;
const PLANNING_GAP = 60;

export function planningSlide(): Slide {
  const ownBike = videoBox(0, PLANNING_TOP, PLANNING_HEIGHT);
  const ownBikeBox = { ...ownBike, x: SLIDE.right - ownBike.width };
  const shared = videoBox(0, PLANNING_TOP, PLANNING_HEIGHT, BIKE_SHARE_RECORDING_RATIO);
  const sharedBox = { ...shared, x: ownBikeBox.x - PLANNING_GAP - shared.width };
  const columnWidth = sharedBox.x - 80 - SLIDE.left;
  return createSlide({
    id: 'planning',
    name: 'Demo: planning with the TTC',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'Two planning demos. Left: a Bike Share rider going to Yorkdale; BikeTO compares Bike Share routes with Bike Share then Line 1. Right: a rider on their own bike going to Etobicoke Civic Centre, comparing bike and ride with bike on board.',
    elements: [
      eyebrow('planning_eyebrow', `VIDEO DEMO 2 OF ${DEMO_COUNT}`),
      title('planning_title', 'Planning bike trips with the TTC', { width: columnWidth, height: 140 }),
      text(
        'planning_text',
        { x: SLIDE.left, y: 330, width: columnWidth, height: 600 },
        `<h3 style="color: ${COLORS.greenSoft}">Bike Share + TTC to Yorkdale</h3><p>BikeTO compares Bike Share routes with “Bike Share, then transit” on Line 1, listing every walk, ride, dock and train step.</p><p>&nbsp;</p><h3 style="color: ${COLORS.sky}">Own bike + TTC to Etobicoke Civic Centre</h3><p>“Bike &amp; ride” parks the bike at the stop; “Bike on board” brings it on the bus. Both show live departures.</p>`,
        { fontSize: 26, lineHeight: 1.4 },
      ),
      video('planning_video1', 'bike-share-ttc', sharedBox, 'Screen recording: planning a Bike Share and TTC trip to Yorkdale Shopping Centre'),
      captionUnder('planning_caption1', sharedBox, 'Bike Share rider', 'Bike Share, then Line 1'),
      video('planning_video2', 'own-bike-ttc', ownBikeBox, 'Screen recording: planning an own-bike and TTC trip to Etobicoke Civic Centre'),
      captionUnder('planning_caption2', ownBikeBox, 'Own-bike rider', 'Bike & ride or bike on board'),
    ],
  });
}

const RIDE_STEPS = [
  ['Get off the subway', 'at Spadina Station, with a countdown of stops left.'],
  ['Take a bike', 'at Bloor St W / Spadina Ave, with 9 bikes and 2 e-bikes available.'],
  ['Ride the bike lanes', 'along Bloor Street with spoken turns and the pass countdown.'],
  ['Dock', 'at Bloor St W / Shaw St, which has 33 free docks.'],
  ['Walk the last 220 m', 'to Christie Pits Park.'],
] as const;
const RIDE_VIDEO = { height: 770, top: 215 } as const;

export function rideSlide(): Slide {
  const base = videoBox(0, RIDE_VIDEO.top, RIDE_VIDEO.height);
  const box = { ...base, x: SLIDE.right - base.width };
  const columnWidth = box.x - 100 - SLIDE.left;
  const steps = RIDE_STEPS.map(([lead, body]) => `<li><strong>${lead}</strong> ${body}</li>`).join('');
  return createSlide({
    id: 'ride',
    name: 'Demo: turn-by-turn ride',
    transition: { effect: 'fade', duration: 400 },
    notes:
      'A two-minute screen recording of navigation mode on a Bike Share trip to Christie Pits Park. Point out the pass countdown at the bottom and the dock step. Scrub ahead if time is short.',
    elements: [
      eyebrow('ride_eyebrow', `VIDEO DEMO 3 OF ${DEMO_COUNT}`),
      title('ride_title', 'A full Bike Share ride, turn by turn', { width: columnWidth }),
      text(
        'ride_steps',
        { x: SLIDE.left, y: 290, width: columnWidth, height: 470 },
        `<ol>${steps}</ol>`,
        { fontSize: 34, lineHeight: 1.4 },
      ),
      text(
        'ride_note',
        { x: SLIDE.left, y: 800, width: columnWidth, height: 130 },
        `<p style="color: ${COLORS.muted}">Two-minute screen recording of BikeTO’s navigation mode on iPhone. The trip keeps going on the Lock Screen and in the Dynamic Island.</p>`,
        { fontSize: 24, lineHeight: 1.4 },
      ),
      video('ride_video', 'navigation-mode', box, 'Screen recording: a Bike Share ride from Bloor St W / Spadina Ave to Christie Pits Park in navigation mode'),
    ],
  });
}

export function demoSlides(): Slide[] {
  return [reelSlide(), planningSlide(), rideSlide()];
}
