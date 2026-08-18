# Brain Map

A nested neuroanatomy explorer — Dictionary, Tree Map, and Spatial Map views over one shared taxonomy of the nervous system, brain rhythms, and sleep.

## Running it

No build step, no install, no server required.

- **Easiest:** double-click `index.html`, or drag it into a browser tab.
- **Or:** right-click `index.html` in VS Code → "Open with Live Server" (works too, just make sure the folder you have open in VS Code is this `mindmap` folder — Live Server serves from the open workspace root, not from wherever the file happens to sit).

Either way works identically; this app makes no network requests and needs no server.

## File structure

```
index.html          Page shell — loads everything below, in order, then mounts the app.
css/
  styles.css         All visual styling (theme colors, layout, animations, light/dark mode).
vendor/
  react.production.min.js       React 18, vendored (not npm-installed — no node_modules needed).
  react-dom.production.min.js
js/
  data.js            The knowledge base: every brain structure, its category, description,
                      "in your experience" text, and how brain-wave/sleep nodes connect to
                      the structures that generate them. This is the file to edit to add,
                      rename, or re-parent anything in the taxonomy.
  layout.js           Positions nodes for the Tree Map and Spatial Map views, including the
                      hand-set anatomical anchor coordinates and the "click a region to fan
                      its children out neatly" expand layout.
  mapview.js          The Tree Map / Spatial Map canvas component (pan, zoom, node dots and
                      labels, region outline rings, link lines, HUD).
  brainmap.js         The root component: header, search, Dictionary view, and the version
                      number shown next to the theme toggle.
  main.js             One line — mounts the app once everything above has loaded.
```

Previously this was one 3,600-line `index.html` file with React, the data, the layout math,
and every component all inlined together. Same code, same behavior — just split into files
that match what each piece actually is, so a given change (e.g. editing brain-region text)
means opening one small, findable file instead of searching a single giant one.

## Editing content

Almost everything content-related lives in `js/data.js`:

- **`TREE`** — the whole taxonomy, as nested objects. Each node has an `id` (must be unique),
  `name`, `tag` (controls its color/category), optional `code` (e.g. "V1 · BA17"), `blurb`
  (short one-liner), and `children`.
- **`TAGS`** — the category legend (System, Division, Region, Area, Nucleus, Structure,
  Network, Nerve, Sense, Organ, Rhythm) and their colors.
- **`DETAIL`** — the longer explanation + functions list shown for a node id, when it has one.
- **`GROUND`** — the "in your experience" panel text for a node id.
- **`SENSES`** — a second root tree (organs/receptors) shown alongside `TREE`.
- **`EDGE_NOTE`** — the caption shown for a dashed "connects to" link between two node ids
  (used mostly for brain-wave/sleep-state nodes linking to the structures that generate them).

To add a new structure: add a node under the right parent in `TREE`, give it a unique `id`,
and optionally add matching entries to `DETAIL`/`GROUND` keyed by that same `id`. Nothing else
needs to change — layout, coloring, search, and both map views pick it up automatically.

To place a new "region"-tagged node on the Spatial Map at a specific spot, add an entry for
its `id` to `SPATIAL_POS` near the top of `layout.js`; anything without an explicit anchor
gets positioned automatically near its parent or linked structure.

## Version

The version number shown next to the theme toggle (`v1.0.0`) is `APP_VERSION` at the top of
`js/brainmap.js`. Bump it on any change worth tracking.
