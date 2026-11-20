import { CURRENT_SCHEMA_VERSION, type Deck, DeckSchema, DEFAULT_SLIDE_SIZE } from '@webslides/schema';
import { BIKETO_THEME, COLORS, SLIDE, text } from './kit';
import { askSlide, closeSlide, howSlide, whySlide } from './slides-close';
import { demoSlides } from './slides-demos';
import { featureSlides } from './slides-features';
import { mountSlide } from './slides-mount';
import { gapSlide, glanceSlide, titleSlide } from './slides-story';

/** Fixed so the deck, and the site exported from it, is identical on every build. */
const DECK_TIMESTAMP = '2026-11-20T09:00:00.000Z';
const FOOTER = { y: 1018, height: 40, fontSize: 18 } as const;

function masterElements() {
  const style = { fontSize: FOOTER.fontSize, color: COLORS.muted };
  return [
    text('master_footer', { x: SLIDE.left, y: FOOTER.y, width: 900, height: FOOTER.height }, '<p>BikeTO &middot; Bike directions for Toronto</p>', style),
    text('master_number', { x: SLIDE.right - 200, y: FOOTER.y, width: 200, height: FOOTER.height }, '<p>{{slide_number}} / {{slide_count}}</p>', { ...style, align: 'right' }),
  ];
}

export function createBikeToDeck(): Deck {
  return DeckSchema.parse({
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: 'deck_biketo_bikeshare',
    title: 'BikeTO for Bike Share Toronto',
    description:
      'BikeTO, safer bike navigation for Toronto with Bike Share, bike parking and the TTC built in: core features, video demos, and three ways to work with Bike Share Toronto.',
    slideSize: DEFAULT_SLIDE_SIZE,
    theme: BIKETO_THEME,
    settings: { navigation: 'slides', showProgress: true, showIndex: true, loop: false },
    slides: [
      titleSlide(),
      gapSlide(),
      glanceSlide(),
      ...featureSlides(),
      ...demoSlides(),
      howSlide(),
      whySlide(),
      mountSlide(),
      askSlide(),
      closeSlide(),
    ],
    master: { elements: masterElements() },
    customCss: [
      // Breathing room between list items, which the default rich-text style sets to none.
      '.ws-rich li{margin-bottom:.55em}.ws-rich li:last-child{margin-bottom:0}',
      // The mount hotspots sit over numbers drawn on the render: keep the number visible and
      // show only the pulsing ring (on phones the hotspots are labelled buttons instead).
      `.ws-slide:not(.ws-slide-stacked) [data-element-id^="mount_hotspot"] .ws-hotspot{background:transparent;border-color:transparent}`,
      // Pop-up panels read at the same size as the slide text they sit beside.
      '.ws-slide:not(.ws-slide-stacked) [data-element-type="panel"] .ws-panel{font-size:38px}',
      '.ws-panel-body h3{margin-top:.9em}.ws-panel-body h3:first-child{margin-top:0}',
      // A quiet Enlarge pill on each demo video, so it covers as little of the recording as it can.
      '[data-element-id$="_enlarge"] .ws-button{font-size:20px;font-weight:600;background:rgba(9,26,42,.82);color:#fff;border:1px solid rgba(255,255,255,.4)}',
    ].join(''),
    createdAt: DECK_TIMESTAMP,
    updatedAt: DECK_TIMESTAMP,
  });
}
