// ─────────────────────────────────────────────────────────────
// BRAIN MAP — root component: header, search, Dictionary view, and
// wiring between the Dictionary/Tree Map/Spatial Map view modes.
// Styling lives in css/styles.css, not here.
// ─────────────────────────────────────────────────────────────

const APP_VERSION = "1.1.1";
function BrainMap() {
  const idx = useMemo(() => buildIndex(ROOTS), []);
  const [selected, setSelected] = useState("v4");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("dict"); // 'dict' | 'map' | 'spatial'
  const [headerOpen, setHeaderOpen] = useState(true);
  const [theme, setTheme] = useState("dark"); // dark | light
  const [activeWave, setActiveWave] = useState(null); // delta|theta|alpha|beta|gamma|null
  const detailRef = useRef(null);
  const pathTo = id => {
    const o = [];
    let c = id;
    while (c) {
      o.unshift(idx.byId[c]);
      c = idx.parentOf[c];
    }
    return o;
  };
  const initialExpanded = useMemo(() => {
    const s = new Set();
    pathTo("v4").forEach(n => s.add(n.id));
    return s;
  }, []); // eslint-disable-line
  const [expanded, setExpanded] = useState(initialExpanded);
  const toggle = id => setExpanded(p => {
    const s = new Set(p);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });
  const select = id => {
    setSelected(id);
    setExpanded(p => {
      const s = new Set(p);
      pathTo(id).forEach(n => s.add(n.id));
      return s;
    });
    if (WAVE_IDS.includes(id)) setActiveWave(id);
  };
  const q = query.trim().toLowerCase();
  const searchVisible = useMemo(() => {
    if (!q) return null;
    const keep = new Set();
    idx.flat.forEach(n => {
      if ((n.name + " " + (n.code || "")).toLowerCase().includes(q)) pathTo(n.id).forEach(a => keep.add(a.id));
    });
    return keep;
  }, [q]); // eslint-disable-line
  const jumpFirst = () => {
    const m = idx.flat.find(n => (n.name + " " + (n.code || "")).toLowerCase().includes(q));
    if (m) select(m.id);
  };
  const node = selected ? idx.byId[selected] : null;
  const chain = selected ? pathTo(selected) : [];
  const parent = chain.length > 1 ? chain[chain.length - 2] : null;
  const siblings = parent && node ? parent.children.filter(c => c.id !== node.id) : [];
  const kids = node ? node.children || [] : [];
  useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, [selected]);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const TreeNode = ({
    n,
    depth
  }) => {
    if (searchVisible && !searchVisible.has(n.id)) return null;
    const kids = n.children || [];
    const isOpen = expanded.has(n.id) || !!searchVisible;
    const color = TAGS[n.tag].color;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "row" + (selected === n.id ? " sel" : ""),
      style: {
        paddingLeft: 8 + depth * 15
      },
      onClick: () => select(n.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "chev " + (kids.length ? isOpen ? "open" : "" : "leaf"),
      onClick: e => {
        e.stopPropagation();
        if (kids.length) toggle(n.id);
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 9 9"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 1l4 3.5L2 8",
      stroke: "currentColor",
      strokeWidth: "1.4",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "dot",
      style: {
        background: color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "row-name"
    }, n.name), n.code && /*#__PURE__*/React.createElement("span", {
      className: "row-code"
    }, n.code)), kids.length > 0 && isOpen && kids.map(c => /*#__PURE__*/React.createElement(TreeNode, {
      key: c.id,
      n: c,
      depth: depth + 1
    })));
  };
  const nodeColor = node ? TAGS[node.tag].color : "#e0b45f";
  return /*#__PURE__*/React.createElement("div", {
    className: "bm" + (theme === "light" ? " light" : ""),
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bm-head" + (headerOpen ? "" : " collapsed")
  }, /*#__PURE__*/React.createElement("button", {
    className: "bm-collapse",
    onClick: () => setHeaderOpen(o => !o),
    "aria-label": headerOpen ? "Collapse header" : "Expand header"
  }, headerOpen ? "▾" : "▸"), headerOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "bm-kicker"
  }, "Neuroanatomy · nested map"), /*#__PURE__*/React.createElement("h1", {
    className: "bm-title"
  }, "Brain Map"), /*#__PURE__*/React.createElement("p", {
    className: "bm-sub"
  }, "Pick any region to see what it belongs to, the categories above it, and the parts inside it. Loaded on V4.")), /*#__PURE__*/React.createElement("div", {
    className: "bm-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: viewMode === "dict" ? "on" : "",
    onClick: () => setViewMode("dict")
  }, "Dictionary"), /*#__PURE__*/React.createElement("button", {
    className: viewMode === "map" ? "on" : "",
    onClick: () => setViewMode("map")
  }, "Tree Map"), /*#__PURE__*/React.createElement("button", {
    className: viewMode === "spatial" ? "on" : "",
    onClick: () => setViewMode("spatial")
  }, "Spatial Map")), /*#__PURE__*/React.createElement("div", {
    className: "bm-search"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "6.5",
    r: "4.5",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 10l3 3",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") jumpFirst();
    },
    placeholder: "Search… (try V4, thalamus) · Enter to jump"
  })), /*#__PURE__*/React.createElement("button", {
    className: "bm-theme",
    onClick: () => setTheme(t => t === "dark" ? "light" : "dark"),
    "aria-label": "Toggle color theme"
  }, theme === "dark" ? "☀" : "☾"), /*#__PURE__*/React.createElement("span", {
    className: "bm-version",
    title: "Build version"
  }, "v", APP_VERSION))), viewMode !== "dict" ? /*#__PURE__*/React.createElement("div", {
    className: "bm-body"
  }, /*#__PURE__*/React.createElement(MapView, {
    idx: idx,
    selected: selected,
    onSelect: select,
    theme: theme,
    mode: viewMode,
    activeWave: activeWave,
    onWaveChange: setActiveWave
  })) : /*#__PURE__*/React.createElement("div", {
    className: "bm-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bm-tree"
  }, ROOTS.map(r => /*#__PURE__*/React.createElement(TreeNode, {
    key: r.id,
    n: r,
    depth: 0
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bm-detail",
    ref: detailRef
  }, node ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-tagrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: nodeColor + "22",
      color: nodeColor,
      border: `1px solid ${nodeColor}55`
    }
  }, TAGS[node.tag].label), node.code && /*#__PURE__*/React.createElement("span", {
    className: "d-code"
  }, node.code)), /*#__PURE__*/React.createElement("h2", {
    className: "d-name"
  }, node.name), node.blurb && /*#__PURE__*/React.createElement("p", {
    className: "d-blurb"
  }, node.blurb), DETAIL[node.id]?.detail && /*#__PURE__*/React.createElement("p", {
    className: "d-blurb"
  }, DETAIL[node.id].detail), DETAIL[node.id]?.functions && /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Functions"), /*#__PURE__*/React.createElement("ul", {
    className: "d-fnlist"
  }, DETAIL[node.id].functions.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, f)))), GROUND[node.id] && /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "In your experience"), GROUND[node.id].senses && /*#__PURE__*/React.createElement("div", {
    className: "d-senses"
  }, GROUND[node.id].senses.map(s => /*#__PURE__*/React.createElement("span", {
    className: "sense",
    key: s
  }, s))), /*#__PURE__*/React.createElement("p", {
    className: "d-exptext"
  }, GROUND[node.id].experience)), node.link && node.link.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Connects to"), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, node.link.filter(id => idx.byId[id]).map(id => /*#__PURE__*/React.createElement("div", {
    key: id,
    className: "chip",
    onClick: () => select(id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[idx.byId[id].tag].color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "chip-name"
  }, idx.byId[id].name), idx.byId[id].code && /*#__PURE__*/React.createElement("span", {
    className: "chip-code"
  }, idx.byId[id].code))))), /*#__PURE__*/React.createElement("p", {
    className: "d-crumb"
  }, chain.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c.id
  }, i === chain.length - 1 ? /*#__PURE__*/React.createElement("b", null, c.name) : /*#__PURE__*/React.createElement("span", {
    className: "crumb-link",
    onClick: () => select(c.id)
  }, c.name), i < chain.length - 1 && /*#__PURE__*/React.createElement("span", {
    className: "crumb-sep"
  }, "›")))), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "L", idx.depthOf[node.id]), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Depth")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, kids.length), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Direct parts")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, countDescendants(node)), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Total inside"))), parent && /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Belongs to"), /*#__PURE__*/React.createElement("div", {
    className: "parentcard",
    onClick: () => select(parent.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[parent.tag].color,
      width: 9,
      height: 9
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pc-name"
  }, parent.name), /*#__PURE__*/React.createElement("div", {
    className: "pc-sub"
  }, TAGS[parent.tag].label, parent.code ? " · " + parent.code : "")))), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Higher categories above it"), /*#__PURE__*/React.createElement("div", {
    className: "spine"
  }, chain.map((c, i) => {
    const here = c.id === node.id,
      last = i === chain.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      className: "sp-row" + (here ? " here" : ""),
      onClick: () => select(c.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-rail"
    }, !last && /*#__PURE__*/React.createElement("div", {
      className: "sp-line",
      style: {
        top: "50%",
        bottom: 0
      }
    }), i !== 0 && /*#__PURE__*/React.createElement("div", {
      className: "sp-line",
      style: {
        bottom: "50%",
        top: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-node",
      style: {
        background: TAGS[c.tag].color,
        boxShadow: here ? `0 0 0 3px ${TAGS[c.tag].color}33` : "none"
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "sp-label"
    }, c.name), c.code && /*#__PURE__*/React.createElement("span", {
      className: "sp-code"
    }, c.code), here && /*#__PURE__*/React.createElement("span", {
      className: "sp-here-tag"
    }, "you are here")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Smallest parts within it"), kids.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, kids.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "chip",
    onClick: () => select(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[c.tag].color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "chip-name"
  }, c.name), c.code && /*#__PURE__*/React.createElement("span", {
    className: "chip-code"
  }, c.code)))) : /*#__PURE__*/React.createElement("div", {
    className: "leafnote"
  }, /*#__PURE__*/React.createElement("b", null, node.name), " is a leaf — the smallest mapped part here. It sits directly inside ", /*#__PURE__*/React.createElement("b", null, parent ? parent.name : "the map"), ", alongside ", siblings.length, " sibling", siblings.length === 1 ? "" : "s", ".")), siblings.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sec-h"
  }, "Alongside it (", parent.name, ")"), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, siblings.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "chip",
    onClick: () => select(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[c.tag].color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "chip-name"
  }, c.name), c.code && /*#__PURE__*/React.createElement("span", {
    className: "chip-code"
  }, c.code)))))) : /*#__PURE__*/React.createElement("div", {
    className: "d-empty"
  }, "Nothing selected. Pick a region from the tree, or a node on the map."))), /*#__PURE__*/React.createElement("div", {
    className: "legend"
  }, Object.entries(TAGS).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
    className: "lg",
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: v.color
    }
  }), v.label))));
}
