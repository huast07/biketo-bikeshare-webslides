# BikeTO for Bike Share Toronto

A web slide deck that demos BikeTO to Bike Share Toronto leadership: core features, three video demos, and the ask.
It is built with Webslides and published on GitHub Pages at https://huast07.github.io/biketo-bikeshare-webslides/.

## Presenting

Open the published link and use the arrow keys or the on-screen arrows.
Demo videos start playing when their slide opens; click a video to pause or scrub.
The monitor icon in the top bar opens presenter view with speaker notes.

## Building

The deck is written in TypeScript against the Webslides schema in `tools/deck/`, one file per group of slides.
It needs a local Webslides checkout with its dependencies installed and the viewer runtime built (`pnpm build`), at `~/Coding/webslides` or `$WEBSLIDES_DIR`.

```sh
./build.sh
```

This writes the static site to `site/` and the deck document to `deck.json`.
To preview, serve `site/` with any static server, for example `python3 -m http.server --directory site`.

## Publishing

```sh
./publish.sh
```

This force-pushes the contents of `site/` to the `gh-pages` branch, which GitHub Pages serves.

## Assets

- `site-src/images/` - the App Store screenshots, resized to 640 px wide, and the app icon.
- `site-src/media/` - the screen recordings, re-encoded to 720 px wide H.264 by `tools/reencode.swift`.
