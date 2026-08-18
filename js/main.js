// ─────────────────────────────────────────────────────────────
// BRAIN MAP — entry point. Mounts the app once every script above has
// loaded (React/ReactDOM vendor bundles, data.js, layout.js, mapview.js,
// brainmap.js — in that order, see index.html).
// ─────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(BrainMap));
