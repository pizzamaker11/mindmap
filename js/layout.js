// ─────────────────────────────────────────────────────────────
// BRAIN MAP — layout engines.
// buildIndex turns the TREE/SENSES trees into flat lookup tables.
// layoutTree/layoutWorld position nodes for the Tree Map view.
// layoutSpatial positions nodes for the Spatial Map using the hand-set
// SPATIAL_POS anchors below. expandLayout is the "click a region to fan
// its children out neatly" layout used on top of layoutSpatial.
// ─────────────────────────────────────────────────────────────

function buildIndex(roots) {
  const list = Array.isArray(roots) ? roots : [roots];
  const byId = {},
    parentOf = {},
    depthOf = {},
    flat = [];
  const walk = (node, parent, depth) => {
    byId[node.id] = node;
    parentOf[node.id] = parent ? parent.id : null;
    depthOf[node.id] = depth;
    flat.push(node);
    (node.children || []).forEach(c => walk(c, node, depth + 1));
  };
  list.forEach(r => walk(r, null, 0));
  return {
    byId,
    parentOf,
    depthOf,
    flat
  };
}
function countDescendants(node) {
  if (!node.children) return 0;
  return node.children.reduce((n, c) => n + 1 + countDescendants(c), 0);
}

// ── layout for the map view (horizontal tidy tree) ──────────────
const COL = 200,
  ROW = 17,
  PADX = 90,
  PADY = 60;

// ── SPATIAL MAP anchors ──────────────────────────────────────────
// Not a literal brain drawing — a schematic side-profile (sagittal) layout,
// normalized 0–100: x runs front-of-face (0) → back-of-head (100),
// y runs top-of-head (0) → down through neck/torso (100). Only "anchor"
// structures (major, recognizably-placeable parts) get a hand-set spot here;
// everything else in the tree is positioned at runtime by layoutSpatial()
// (see below) — either at its linked structure's spot (for brain-wave/sleep
// nodes, which are behaviors of a place, not places themselves) or clustered
// in a small ring around its nearest anchored ancestor.
const SPATIAL_POS = {
  // whole-system roots / trunk
  ns: { x: 45, y: 2 },
  cns: { x: 45, y: 5 },
  brain: { x: 45, y: 7 },
  spinalcord: { x: 50, y: 50 },
  greymatter: { x: 50, y: 50 },
  dorsalhorn: { x: 51, y: 50 },
  ventralhorn: { x: 49, y: 50 },
  spinalwhite: { x: 50, y: 52 },
  pns: { x: 50, y: 55 },
  somatic: { x: 50, y: 57 },
  cranialnerves: { x: 50, y: 40 },
  autonomic: { x: 48, y: 62 },
  symp: { x: 46, y: 65 },
  parasymp: { x: 44, y: 68 },
  enteric: { x: 50, y: 85 },

  // functional networks — placed at the real cortical/limbic spot each
  // sub-region physically sits in, since a network is a team spread across
  // real anatomy, not a place of its own
  networks: { x: 30, y: 12 },
  dmn: { x: 35, y: 13 },
  dmn_mpfc: { x: 13, y: 18 },
  dmn_pcc: { x: 44, y: 10 },
  dmn_angular: { x: 46, y: 13 },
  dmn_hippo: { x: 36, y: 27 },
  salience: { x: 31, y: 16 },
  sal_insula: { x: 30, y: 20 },
  sal_acc: { x: 32, y: 11 },
  fpn: { x: 25, y: 12 },
  fpn_dlpfc: { x: 15, y: 13 },
  fpn_ppc: { x: 42, y: 11 },
  dan: { x: 30, y: 10 },
  dan_fef: { x: 20, y: 12 },
  dan_ips: { x: 43, y: 8 },
  smn: { x: 30, y: 10 },
  smn_m1: { x: 28, y: 11 },
  smn_s1: { x: 33, y: 9 },
  visualnet: { x: 69, y: 16 },
  vn_v1: { x: 70, y: 15 },
  vn_extra: { x: 69, y: 17 },

  // rhythms/waves/states are intentionally NOT anchored here — they land at
  // their linked structure's position via layoutSpatial()'s link-based rule,
  // which is a truer "spatial" placement for a behavior than a fixed spot.

  // forebrain / cerebrum / cortex
  forebrain: { x: 42, y: 16 },
  cerebrum: { x: 40, y: 17 },
  cortex: { x: 40, y: 15 },
  frontal: { x: 18, y: 14 },
  pfc: { x: 14, y: 16 },
  dlpfc: { x: 15, y: 13 },
  vmpfc: { x: 13, y: 19 },
  ofc: { x: 12, y: 21 },
  fpc: { x: 9, y: 17 },
  m1: { x: 28, y: 11 },
  premotor: { x: 24, y: 11 },
  sma: { x: 26, y: 8 },
  fef: { x: 20, y: 12 },
  broca: { x: 16, y: 24 },
  parietal: { x: 40, y: 8 },
  s1: { x: 33, y: 9 },
  spl: { x: 42, y: 6 },
  ipl: { x: 44, y: 11 },
  precuneus: { x: 46, y: 9 },
  angular: { x: 46, y: 13 },
  supramarginal: { x: 40, y: 14 },
  ips: { x: 43, y: 8 },
  temporal: { x: 30, y: 30 },
  a1: { x: 34, y: 29 },
  wernicke: { x: 37, y: 31 },
  fusiform: { x: 33, y: 36 },
  it: { x: 30, y: 37 },
  stg: { x: 35, y: 28 },
  sts: { x: 36, y: 30 },
  entorhinal: { x: 35, y: 40 },
  parahippo: { x: 36, y: 39 },
  temporalpole: { x: 18, y: 31 },
  occipital: { x: 66, y: 16 },
  viscortex: { x: 68, y: 16 },
  v1: { x: 70, y: 15 },
  v2: { x: 71, y: 14 },
  v3: { x: 69, y: 17 },
  v4: { x: 67, y: 19 },
  v5: { x: 65, y: 13 },
  lingual: { x: 68, y: 21 },
  cuneus: { x: 69, y: 12 },
  insula: { x: 30, y: 20 },
  cingulate: { x: 36, y: 10 },
  acc: { x: 32, y: 11 },
  mcc: { x: 38, y: 9 },
  pcc: { x: 44, y: 10 },

  // subcortical structures
  subcort: { x: 40, y: 20 },
  bg: { x: 36, y: 21 },
  caudate: { x: 37, y: 19 },
  putamen: { x: 35, y: 22 },
  gp: { x: 34, y: 23 },
  nacc: { x: 33, y: 20 },
  limbic: { x: 37, y: 26 },
  hippo: { x: 36, y: 27 },
  amyg: { x: 33, y: 26 },
  fornix: { x: 38, y: 24 },
  mammillary: { x: 40, y: 29 },
  wm: { x: 45, y: 19 },
  cc: { x: 45, y: 17 },

  // diencephalon
  diencephalon: { x: 43, y: 23 },
  thalamus: { x: 42, y: 23 },
  lgn: { x: 40, y: 25 },
  mgn: { x: 41, y: 26 },
  pulvinar: { x: 44, y: 24 },
  vpl: { x: 43, y: 22 },
  mdthal: { x: 41, y: 21 },
  hypothalamus: { x: 40, y: 27 },
  epithalamus: { x: 45, y: 22 },
  subthalamus: { x: 41, y: 29 },

  // midbrain
  midbrain: { x: 45, y: 32 },
  tectum: { x: 47, y: 31 },
  sc: { x: 48, y: 30 },
  ic: { x: 48, y: 32 },
  tegmentum: { x: 43, y: 33 },
  sn: { x: 42, y: 34 },
  rn: { x: 44, y: 33 },
  vta: { x: 41, y: 32 },

  // hindbrain
  hindbrain: { x: 50, y: 36 },
  metencephalon: { x: 50, y: 36 },
  pons: { x: 48, y: 36 },
  locuscoeruleus: { x: 47, y: 35 },
  cerebellum: { x: 62, y: 34 },
  cbcortex: { x: 64, y: 33 },
  dcn: { x: 63, y: 35 },
  vermis: { x: 62, y: 32 },
  flocculo: { x: 65, y: 36 },
  myelencephalon: { x: 48, y: 40 },
  medulla: { x: 47, y: 41 },
  raphe: { x: 46, y: 40 },
  reticular: { x: 45, y: 38 },

  // senses & organs
  senses: { x: 10, y: 10 },
  s_sight: { x: 8, y: 20 },
  o_eye: { x: 9, y: 20 },
  p_cornea: { x: 8, y: 19 },
  p_lens: { x: 8.5, y: 20 },
  p_retina: { x: 9.5, y: 20 },
  p_photoreceptors: { x: 9.5, y: 20.5 },
  p_opticnerve: { x: 15, y: 21 },
  s_hearing: { x: 55, y: 20 },
  o_ear: { x: 56, y: 20 },
  p_eardrum: { x: 56, y: 19.5 },
  p_ossicles: { x: 56.5, y: 20 },
  p_cochlea: { x: 57, y: 20.5 },
  s_balance: { x: 57, y: 18 },
  o_vestibular: { x: 57, y: 18 },
  p_semicircular: { x: 57.5, y: 17.5 },
  p_otolith: { x: 57.5, y: 18.5 },
  s_touch: { x: 50, y: 48 },
  o_skin: { x: 50, y: 48 },
  p_mechano: { x: 50, y: 47 },
  p_thermo: { x: 51, y: 48 },
  p_nociceptor: { x: 49, y: 48 },
  s_smell: { x: 9, y: 24 },
  o_nose: { x: 9, y: 24 },
  p_olfepi: { x: 9.5, y: 24.5 },
  p_olfbulb: { x: 12, y: 23 },
  s_taste: { x: 11, y: 32 },
  o_tongue: { x: 11, y: 33 },
  p_tastebuds: { x: 11.5, y: 33 },
  s_organs: { x: 48, y: 75 },
  o_heart: { x: 46, y: 74 },
  o_lungs: { x: 50, y: 73 },
  o_gut: { x: 48, y: 83 },
  o_bladder: { x: 48, y: 92 }
};
const SP_SCALE = 9,
  SP_PAD = 60;

// Deterministic, dependency-free pseudo-random in [0,1) from a string id —
// used only to spread un-anchored siblings around their parent so they
// don't stack exactly on top of each other.
function spHash(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

// Places every node in the spatial coordinate space. Priority per node:
//  1. an explicit SPATIAL_POS anchor
//  2. (for rhythm/state nodes) the position of the structure it's linked to —
//     a brain wave "lives" wherever its generating structure does
//  3. its parent's resolved spot, offset in a small ring so siblings fan out
function layoutSpatial(roots, idx) {
  const raw = {};
  const visiting = new Set();
  const resolve = id => {
    if (raw[id]) return raw[id];
    if (visiting.has(id)) return raw[id] = { x: 45, y: 20 }; // cycle guard
    visiting.add(id);
    const node = idx.byId[id];
    let p;
    if (SPATIAL_POS[id]) {
      p = { x: SPATIAL_POS[id].x, y: SPATIAL_POS[id].y };
    } else {
      const linkTarget = node.link && node.link.find(t => idx.byId[t] && t !== id);
      const parentId = idx.parentOf[id];
      if (linkTarget) {
        const base = resolve(linkTarget);
        const a = spHash(id) * Math.PI * 2;
        p = { x: base.x + Math.cos(a) * 2.2, y: base.y + Math.sin(a) * 2.2 };
      } else if (parentId) {
        const base = resolve(parentId);
        const sibs = (idx.byId[parentId].children || []);
        const i = Math.max(0, sibs.findIndex(c => c.id === id));
        const n = Math.max(1, sibs.length);
        const a = i / n * Math.PI * 2 + spHash(id) * 0.6;
        const r = 2.4 + (i % 3) * 0.7;
        p = { x: base.x + Math.cos(a) * r, y: base.y + Math.sin(a) * r * 0.75 };
      } else {
        p = { x: 45, y: 20 };
      }
    }
    visiting.delete(id);
    return raw[id] = p;
  };
  idx.flat.forEach(n => resolve(n.id));
  const pos = {};
  let maxX = 0,
    maxY = 0;
  idx.flat.forEach(n => {
    const r = raw[n.id];
    const x = SP_PAD + r.x * SP_SCALE,
      y = SP_PAD + r.y * SP_SCALE;
    pos[n.id] = {
      x,
      y,
      depth: idx.depthOf[n.id]
    };
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  return {
    pos,
    worldW: maxX + SP_PAD,
    worldH: maxY + SP_PAD,
    maxDepth: 0,
    islands: []
  };
}

// ── EXPAND-ON-CLICK ────────────────────────────────────────────────
// A region's real children can sit anatomically close enough to overlap no
// matter how much label decluttering runs. So instead: when a node with
// children is selected, its whole subtree re-lays-out into a small,
// guaranteed-non-overlapping indented tree (same row/column idea as the
// Tree Map) fanning out from that node's real anatomical spot — which
// stays put, so the expansion always reads as "this place, opened up"
// rather than the map rearranging itself.
function expandLayout(rootId, idx, x0, y0) {
  const raw = {};
  let leaf = 0;
  const assign = (id, depth) => {
    const kids = (idx.byId[id].children || []);
    if (kids.length) {
      const rows = kids.map(c => assign(c.id, depth + 1));
      const row = (rows[0] + rows[rows.length - 1]) / 2;
      if (depth > 0) raw[id] = {
        depth,
        row
      };
      return row;
    }
    const row = leaf++;
    if (depth > 0) raw[id] = {
      depth,
      row
    };
    return row;
  };
  assign(rootId, 0);
  const mid = (leaf - 1) / 2;
  const COLX = 145,
    ROWY = 24;
  const out = {};
  Object.keys(raw).forEach(id => {
    const {
      depth,
      row
    } = raw[id];
    out[id] = {
      x: x0 + depth * COLX,
      y: y0 + (row - mid) * ROWY
    };
  });
  return out;
}

function layoutTree(root) {
  const pos = {};
  let leaf = 0,
    maxDepth = 0;
  const assign = (node, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    if (node.children && node.children.length) {
      const ys = node.children.map(c => assign(c, depth + 1));
      const y = (ys[0] + ys[ys.length - 1]) / 2;
      pos[node.id] = {
        x: depth * COL + PADX,
        y: y * ROW + PADY,
        depth
      };
      return y;
    }
    const y = leaf++;
    pos[node.id] = {
      x: depth * COL + PADX,
      y: y * ROW + PADY,
      depth
    };
    return y;
  };
  assign(root, 0);
  return {
    pos,
    worldW: maxDepth * COL + PADX + 260,
    worldH: (leaf - 1) * ROW + PADY * 2,
    maxDepth
  };
}

// Lay out several roots as stacked islands sharing one coordinate space.
function layoutWorld(roots) {
  const pos = {};
  const islands = [];
  let rowCursor = 0,
    maxDepth = 0;
  const ISLAND_GAP = 4; // rows between islands
  const GROUP_GAP = 1.1; // extra rows between adjacent leaf groups
  roots.forEach(root => {
    let leaf = 0,
      prevParent = null;
    const startRow = rowCursor;
    // returns { y, weight }; a parent sits at its HEAVIEST child's row, so the
    // dominant chain runs horizontally and light branches hang off it.
    const assign = (node, depth, parent) => {
      maxDepth = Math.max(maxDepth, depth);
      if (node.children && node.children.length) {
        const kids = node.children.map(c => assign(c, depth + 1, node.id));
        const y = (kids[0].y + kids[kids.length - 1].y) / 2;
        pos[node.id] = {
          x: depth * COL + PADX,
          y: (startRow + y) * ROW + PADY,
          depth
        };
        return {
          y,
          weight: kids.reduce((s, k) => s + k.weight, 0)
        };
      }
      if (prevParent !== null && parent !== prevParent) leaf += GROUP_GAP;
      const y = leaf;
      leaf += 1;
      prevParent = parent;
      pos[node.id] = {
        x: depth * COL + PADX,
        y: (startRow + y) * ROW + PADY,
        depth
      };
      return {
        y,
        weight: 1
      };
    };
    assign(root, 0, null);
    islands.push({
      id: root.id,
      name: root.name,
      yTop: startRow * ROW + PADY,
      yBot: (startRow + leaf) * ROW + PADY
    });
    rowCursor = startRow + leaf + ISLAND_GAP;
  });
  return {
    pos,
    worldW: maxDepth * COL + PADX + 300,
    worldH: (rowCursor - ISLAND_GAP) * ROW + PADY * 2,
    maxDepth,
    islands
  };
}

// ── MAP VIEW ────────────────────────────────────────────────────
