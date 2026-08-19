// ─────────────────────────────────────────────────────────────
// BRAIN MAP — MapView component: the Tree Map and Spatial Map views
// (pan/zoom canvas, node dots + labels, region rings, link lines, HUD).
// ─────────────────────────────────────────────────────────────

function MapView({
  idx,
  selected,
  onSelect,
  theme,
  mode,
  activeWave,
  onWaveChange
}) {
  const {
    pos,
    worldW,
    worldH,
    maxDepth,
    islands
  } = useMemo(() => mode === "spatial" ? layoutSpatial(ROOTS, idx) : layoutWorld(ROOTS), [mode]); // eslint-disable-line

  // If the selected node has children, its subtree re-lays-out into a tidy
  // fan (see expandLayout above) instead of using their raw anatomical spots.
  const displayPos = useMemo(() => {
    if (mode !== "spatial" || !selected) return pos;
    const node = idx.byId[selected];
    const origin = pos[selected];
    if (!node || !node.children || !node.children.length || !origin) return pos;
    return { ...pos, ...expandLayout(selected, idx, origin.x, origin.y) };
  }, [pos, selected, idx, mode]);

  // Region outlines are recomputed from whatever positions are currently on
  // screen, so an expanded region's outline grows to still wrap its
  // fanned-out children instead of staying pinned to their old cramped
  // anatomical spot. Each is a smooth hull hugging its actual member
  // points — an organic lobe-shaped outline, not a generic circle.
  const regions = useMemo(() => {
    if (mode !== "spatial") return [];
    const out = [];
    idx.flat.forEach(n => {
      if (n.tag !== "region") return;
      const shape = nodeAreaShape(n.id, idx, displayPos, 22);
      if (!shape) return;
      const extent = shape.kind === "circle" ? shape.r : shape.extent;
      out.push(Object.assign({
        id: n.id,
        name: n.name,
        extent
      }, shape));
    });
    out.sort((a, b) => b.extent - a.extent);
    return out;
  }, [idx, displayPos, mode]);

  // Brain-wave glow: whichever regions the active wave's `link` points at
  // (a whole lobe, a single nucleus, or all of "Cerebral Cortex" — whatever
  // that wave's data says it drives) get a soft luminous shape in that
  // wave's color, reusing the same hull/circle logic as the region rings.
  const glowShapes = useMemo(() => {
    if (mode !== "spatial" || !activeWave) return [];
    const waveNode = idx.byId[activeWave];
    if (!waveNode || !waveNode.link) return [];
    return waveNode.link.filter(id => idx.byId[id]).map(id => {
      const shape = nodeAreaShape(id, idx, displayPos, 30);
      return shape && Object.assign({
        id
      }, shape);
    }).filter(Boolean);
  }, [mode, activeWave, idx, displayPos]);
  // real tree depth (independent of which layout is active — layoutSpatial doesn't track it)
  const treeMaxDepth = useMemo(() => idx.flat.reduce((m, n) => Math.max(m, idx.depthOf[n.id]), 0), [idx]);
  const links = useMemo(() => idx.flat.filter(n => n.link).flatMap(n => n.link.map(t => ({
    from: n.id,
    to: t
  }))).filter(l => pos[l.from] && pos[l.to]), []); // eslint-disable-line
  const vpRef = useRef(null);
  const [size, setSize] = useState({
    w: 900,
    h: 520
  });
  const [hoverLink, setHoverLink] = useState(null);
  const [pinnedLink, setPinnedLink] = useState(null);
  useEffect(() => {
    if (!vpRef.current) return;
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      setSize({
        w: r.width,
        h: r.height
      });
    });
    ro.observe(vpRef.current);
    return () => ro.disconnect();
  }, []);

  // camera translate (single source of truth) + manual drag / wheel
  const [cam, setCam] = useState({
    x: 0,
    y: 0
  });
  const [dragging, setDragging] = useState(false);
  const [cardOpen, setCardOpen] = useState(true);
  const [wheeling, setWheeling] = useState(false);
  const drag = useRef(null);
  const wheelT = useRef(null);
  const movedRef = useRef(false);
  const [scale, setScale] = useState(1);
  const camRef = useRef({
    x: 0,
    y: 0
  });
  const scaleRef = useRef(1);
  camRef.current = cam;
  scaleRef.current = scale;
  const clampScale = s => Math.min(2.5, Math.max(0.15, s));

  // glide to centre the selected node when it (or the viewport) changes
  useEffect(() => {
    if (!selected) return;
    // frame the node together with its parent, siblings, and children — the whole
    // local family visible at once, so no zooming out or scrolling to the top.
    const ids = new Set([selected]);
    const par = idx.parentOf[selected];
    if (par) {
      ids.add(par);
      (idx.byId[par].children || []).forEach(c => ids.add(c.id));
    }
    const addDesc = id => {
      (idx.byId[id].children || []).forEach(c => {
        ids.add(c.id);
        addDesc(c.id);
      });
    };
    addDesc(selected);
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    ids.forEach(id => {
      const p = displayPos[id];
      if (!p) return;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    const RIGHT = 200; // leave room for labels extending right
    const boxW = maxX + RIGHT - minX,
      boxH = maxY - minY + 60;
    const s = Math.min(2.5, Math.max(0.15, Math.min(size.w * 0.92 / boxW, size.h * 0.82 / boxH, 1.25)));
    const cx = (minX + maxX + RIGHT) / 2,
      cy = (minY + maxY) / 2;
    setScale(s);
    setCam({
      x: size.w / 2 - cx * s,
      y: size.h / 2 - cy * s
    });
  }, [selected, size.w, size.h, mode, displayPos]); // eslint-disable-line

  // two-finger touchpad / wheel → pan the map
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const onWheel = e => {
      if (e.target.closest && e.target.closest(".mcard")) return; // let the details card scroll
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left,
        sy = e.clientY - rect.top;
      if (e.ctrlKey) {
        // pinch / ctrl-scroll → zoom toward the cursor
        const s0 = scaleRef.current,
          s1 = clampScale(s0 * Math.exp(-e.deltaY * 0.01));
        if (s1 !== s0) {
          const c0 = camRef.current;
          setCam({
            x: sx - (sx - c0.x) * (s1 / s0),
            y: sy - (sy - c0.y) * (s1 / s0)
          });
          setScale(s1);
        }
      } else {
        setCam(c => ({
          x: c.x - e.deltaX,
          y: c.y - e.deltaY
        }));
      }
      setWheeling(true);
      clearTimeout(wheelT.current);
      wheelT.current = setTimeout(() => setWheeling(false), 140);
    };
    el.addEventListener("wheel", onWheel, {
      passive: false
    });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  useEffect(() => {
    if (!selected) setPinnedLink(null);
  }, [selected]);
  const onDown = e => {
    if (e.target.closest && e.target.closest(".mcard, .zoomctl, .linkpanel, .hud")) return; // let overlays handle their own touches
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      cx: cam.x,
      cy: cam.y,
      moved: false,
      id: e.pointerId,
      type: e.pointerType
    };
  };
  const onMove = e => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) <= 6) return;
      d.moved = true;
      setDragging(true);
      movedRef.current = true;
      try {
        vpRef.current.setPointerCapture(d.id);
      } catch (_) {}
    }
    setCam({
      x: d.cx + dx,
      y: d.cy + dy
    });
  };
  const onUp = () => {
    const d = drag.current;
    if (d && d.moved) {
      try {
        vpRef.current.releasePointerCapture(d.id);
      } catch (_) {}
    }
    drag.current = null;
    setDragging(false);
  };

  // double-click empty space → glide the view to the cursor
  const onDbl = e => {
    const r = vpRef.current.getBoundingClientRect();
    setCam(c => ({
      x: c.x + (r.width / 2 - (e.clientX - r.left)),
      y: c.y + (r.height / 2 - (e.clientY - r.top))
    }));
  };
  // single click on empty space → clear the selection (ignored if we were dragging)
  const onBgClick = () => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    setPinnedLink(null);
    onSelect(null);
  };

  // zoom controls (anchor on viewport centre)
  const zoomBtn = factor => {
    const s0 = scaleRef.current,
      s1 = clampScale(s0 * factor);
    if (s1 === s0) return;
    const cx = size.w / 2,
      cy = size.h / 2,
      c0 = camRef.current;
    setCam({
      x: cx - (cx - c0.x) * (s1 / s0),
      y: cy - (cy - c0.y) * (s1 / s0)
    });
    setScale(s1);
  };
  const fitView = () => {
    const s1 = clampScale(Math.min(size.w / worldW, size.h / worldH) * 0.9);
    setScale(s1);
    setCam({
      x: (size.w - worldW * s1) / 2,
      y: (size.h - worldH * s1) / 2
    });
  };
  const resetView = () => {
    setScale(1);
    if (selected) {
      const p = pos[selected];
      setCam({
        x: size.w * 0.40 - p.x,
        y: size.h * 0.5 - p.y
      });
    } else setCam({
      x: (size.w - worldW) / 2,
      y: (size.h - worldH) / 2
    });
  };
  const pathTo = id => {
    const o = [];
    let c = id;
    while (c) {
      o.unshift(idx.byId[c]);
      c = idx.parentOf[c];
    }
    return o;
  };
  const chain = selected ? pathTo(selected) : [];
  const lineage = new Set(chain.map(n => n.id));
  const node = selected ? idx.byId[selected] : null;
  const parent = chain.length > 1 ? chain[chain.length - 2] : null;
  const parentId = parent ? parent.id : null;
  const kids = node ? node.children || [] : [];
  const sibs = parent ? parent.children.filter(c => c.id !== node.id) : [];
  const info = node ? DETAIL[node.id] : null;
  const ground = node ? GROUND[node.id] : null;
  const tx = cam.x,
    ty = cam.y;
  const selDepth = node ? idx.depthOf[node.id] : -1;
  const labeled = n => lineage.has(n.id) || idx.parentOf[n.id] === selected ||
  // children of selected
  parentId && idx.parentOf[n.id] === parentId; // siblings of selected

  // ── label decluttering ───────────────────────────────────────────
  // Every node has a screen position, but drawing every name at once is
  // unreadable wherever the map gets dense (subcortical/brainstem cluster
  // especially). Instead: rank labels by relevance to the current
  // selection, then place them greedily in priority order, skipping any
  // whose estimated box collides with one already placed. Distances only
  // need the zoom level, not the pan offset, since pan is a pure
  // translation and doesn't change relative spacing — so this only needs
  // to recompute when the selection or zoom bucket changes, not on drag.
  const MAJOR_TAGS = new Set(["system", "division", "region", "sense", "network"]);
  const scaleBucket = Math.round(scale * 6) / 6;
  const shownLabels = useMemo(() => {
    if (mode !== "spatial") return null; // tree map's own layout already avoids overlap
    const rankOf = n => n.id === selected ? 0 : lineage.has(n.id) ? 1 : labeled(n) ? 2 : 3;
    const order = idx.flat.slice().sort((a, b) => {
      const d = rankOf(a) - rankOf(b);
      if (d) return d;
      const md = (MAJOR_TAGS.has(b.tag) ? 1 : 0) - (MAJOR_TAGS.has(a.tag) ? 1 : 0);
      if (md) return md;
      return idx.depthOf[a.id] - idx.depthOf[b.id];
    });
    const placed = [];
    const show = new Set();
    order.forEach(n => {
      const p = displayPos[n.id];
      if (!p) return;
      const r = rankOf(n);
      const fs = r === 0 ? 13 : r === 1 ? 11.5 : r === 2 ? 11 : 9.5;
      const w = 14 + n.name.length * fs * 0.64 + (n.code ? 10 + n.code.length * 6.2 : 0);
      const h = fs + 10;
      const x0 = p.x * scaleBucket,
        y0 = p.y * scaleBucket - h / 2;
      const box = {
        x0,
        y0,
        x1: x0 + w,
        y1: y0 + h
      };
      const hit = placed.some(o => box.x0 < o.x1 + 5 && box.x1 > o.x0 - 5 && box.y0 < o.y1 + 3 && box.y1 > o.y0 - 3);
      if (!hit) {
        placed.push(box);
        show.add(n.id);
      }
    });
    return show;
  }, [idx, selected, scaleBucket, displayPos, mode]); // eslint-disable-line

  const edges = idx.flat.filter(n => idx.parentOf[n.id]);

  // Which nodes are "active" (drive line visibility): the selected node only.
  const activeNodes = new Set();
  if (selected) activeNodes.add(selected);
  const touchesActive = l => activeNodes.has(l.from) || activeNodes.has(l.to);

  // Endpoints to ring: partners of active nodes, plus the focused line's ends.
  const focusLink = pinnedLink != null ? pinnedLink : hoverLink;
  const hiEnds = new Set();
  links.forEach(l => {
    if (touchesActive(l)) {
      hiEnds.add(l.from);
      hiEnds.add(l.to);
    }
  });
  if (focusLink != null && links[focusLink]) {
    hiEnds.add(links[focusLink].from);
    hiEnds.add(links[focusLink].to);
  }

  // Which links to explain in the panel: a pinned line, a hovered line, else all of the active node's links.
  let shownIdx = [];
  if (pinnedLink != null) shownIdx = [pinnedLink];else if (hoverLink != null) shownIdx = [hoverLink];else if (activeNodes.size) shownIdx = links.map((_, i) => i).filter(i => touchesActive(links[i]));
  return /*#__PURE__*/React.createElement("div", {
    className: "map-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-viewport",
    ref: vpRef,
    style: {
      touchAction: "auto",
      cursor: dragging ? "grabbing" : "grab"
    },
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: onUp,
    onPointerCancel: onUp,
    onDoubleClick: onDbl,
    onClick: onBgClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-atmos"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-world",
    style: {
      width: worldW,
      height: worldH,
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      transition: dragging || wheeling ? "none" : undefined
    }
  }, mode === "spatial" && /*#__PURE__*/React.createElement("svg", {
    className: "map-silhouette",
    width: worldW,
    height: worldH
  }, /*#__PURE__*/React.createElement("path", {
    d: smoothClosedPath(BRAIN_OUTLINE.map(([x, y]) => ({
      x: SP_PAD + x * SP_SCALE,
      y: SP_PAD + y * SP_SCALE
    }))),
    className: "silhouette-path"
  }), /*#__PURE__*/React.createElement("path", {
    d: smoothClosedPath(CORD_OUTLINE.map(([x, y]) => ({
      x: SP_PAD + x * SP_SCALE,
      y: SP_PAD + y * SP_SCALE
    }))),
    className: "silhouette-path"
  })), mode === "spatial" && regions.length > 0 && /*#__PURE__*/React.createElement("svg", {
    className: "map-regions",
    width: worldW,
    height: worldH
  }, regions.map(r => {
    const isOn = selected && (lineage.has(r.id) || r.id === selected);
    const cls = "region-ring" + (isOn ? " on" : "");
    const style = {
      "--c": TAGS.region.color
    };
    return r.kind === "circle" ? /*#__PURE__*/React.createElement("circle", {
      key: r.id,
      className: cls,
      cx: r.cx,
      cy: r.cy,
      r: r.r,
      style: style
    }) : /*#__PURE__*/React.createElement("path", {
      key: r.id,
      className: cls,
      d: r.d,
      style: style
    });
  })), /*#__PURE__*/React.createElement("svg", {
    className: "map-links",
    width: worldW,
    height: worldH
  }, edges.map(n => {
    const p = displayPos[idx.parentOf[n.id]],
      c = displayPos[n.id];
    const mx = (p.x + c.x) / 2;
    const lit = lineage.has(n.id);
    return /*#__PURE__*/React.createElement("path", {
      key: n.id,
      d: `M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`,
      fill: "none",
      stroke: lit ? "#e0b45f" : theme === "light" ? "#c4c8d1" : "#2c3244",
      strokeWidth: lit ? 2.4 : 1.2,
      strokeOpacity: lit ? 0.95 : 0.55
    });
  }), links.map((l, i) => {
    const isPinned = pinnedLink === i;
    const isHover = hoverLink === i;
    const visible = touchesActive(l); // shown because a connected node is active
    let op;
    if (pinnedLink != null) op = isPinned ? 0.98 : 0;else if (!visible) op = 0;else if (hoverLink != null) op = isHover ? 0.98 : 0.18;else op = 0.85;
    if (op <= 0 && !isPinned) return null;
    const a = displayPos[l.from],
      b = displayPos[l.to];
    const my = (a.y + b.y) / 2;
    const d = `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    const active = isPinned || isHover;
    return /*#__PURE__*/React.createElement("g", {
      key: "lk" + i
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "transparent",
      strokeWidth: 16,
      style: {
        pointerEvents: "stroke",
        cursor: "pointer"
      },
      onMouseEnter: () => setHoverLink(i),
      onMouseLeave: () => setHoverLink(h => h === i ? null : h),
      onClick: e => {
        e.stopPropagation();
        setPinnedLink(i);
        onSelect(l.to);
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: active ? "#bfe6f5" : "#5fb0d9",
      strokeWidth: active ? 2.4 : 1.6,
      strokeOpacity: op,
      strokeDasharray: "5 5",
      style: {
        pointerEvents: "none"
      }
    }));
  })), mode === "spatial" && glowShapes.length > 0 && /*#__PURE__*/React.createElement("svg", {
    className: "map-glow",
    width: worldW,
    height: worldH
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "waveglow",
    x: "-80%",
    y: "-80%",
    width: "260%",
    height: "260%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: 16
  }))), glowShapes.map(g => {
    const style = {
      "--wc": WAVE_COLORS[activeWave]
    };
    return g.kind === "circle" ? /*#__PURE__*/React.createElement("circle", {
      key: g.id,
      className: "wave-glow",
      cx: g.cx,
      cy: g.cy,
      r: g.r,
      style: style,
      filter: "url(#waveglow)"
    }) : /*#__PURE__*/React.createElement("path", {
      key: g.id,
      className: "wave-glow",
      d: g.d,
      style: style,
      filter: "url(#waveglow)"
    });
  })), idx.flat.map(n => {
    const p = displayPos[n.id];
    const isSel = n.id === selected;
    const onPath = lineage.has(n.id);
    const show = labeled(n);
    const cls = isSel ? "sel" : onPath ? "path" : show ? "near" : "dim";
    const hasLink = links.some(l => l.from === n.id || l.to === n.id);
    const major = ["system", "division", "region", "sense", "network"].includes(n.tag);
    const k = scale < 1 && major ? Math.min(2.6, 1 / scale) : 1;
    return /*#__PURE__*/React.createElement("div", {
      className: "node",
      key: n.id,
      style: {
        left: p.x,
        top: p.y
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "node-dot " + cls + (hiEnds.has(n.id) ? " linkend" : "") + (hasLink ? " haslink" : ""),
      style: {
        "--c": TAGS[n.tag].color
      },
      onClick: e => {
        e.stopPropagation();
        setPinnedLink(null);
        onSelect(n.id);
      },
      title: !shownLabels || shownLabels.has(n.id) ? undefined : n.name,
      "aria-label": n.name
    }), (!shownLabels || shownLabels.has(n.id)) && /*#__PURE__*/React.createElement("button", {
      className: "node-lbl " + cls,
      style: k !== 1 ? {
        transform: `translateY(-50%) scale(${k})`,
        transformOrigin: "left center"
      } : undefined,
      onClick: e => {
        e.stopPropagation();
        setPinnedLink(null);
        onSelect(n.id);
      }
    }, n.name, n.code ? /*#__PURE__*/React.createElement("i", null, n.code) : null));
  }), islands.map(is => /*#__PURE__*/React.createElement("div", {
    key: is.id,
    className: "island-tag",
    style: {
      left: PADX - 40,
      top: is.yTop - 40
    }
  }, is.name))), shownIdx.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "linkpanel",
    onClick: e => e.stopPropagation()
  }, pinnedLink != null && /*#__PURE__*/React.createElement("button", {
    className: "lp-x",
    onClick: () => {
      setPinnedLink(null);
      onSelect(null);
    },
    "aria-label": "Clear"
  }, "×"), shownIdx.map(i => {
    const l = links[i];
    const note = EDGE_NOTE[l.from + "__" + l.to];
    return /*#__PURE__*/React.createElement("div", {
      className: "lp-row",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-ends"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ll-end" + (l.from === selected ? " cur" : ""),
      onClick: () => onSelect(l.from)
    }, idx.byId[l.from].name), /*#__PURE__*/React.createElement("span", {
      className: "ll-arrow"
    }, "→"), /*#__PURE__*/React.createElement("button", {
      className: "ll-end to" + (l.to === selected ? " cur" : ""),
      onClick: () => onSelect(l.to)
    }, idx.byId[l.to].name)), note && /*#__PURE__*/React.createElement("div", {
      className: "lp-note"
    }, note));
  })), /*#__PURE__*/React.createElement("div", {
    className: "zoomctl",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => zoomBtn(1 / 1.25),
    "aria-label": "Zoom out"
  }, "−"), /*#__PURE__*/React.createElement("button", {
    className: "zpct",
    onClick: resetView,
    "aria-label": "Reset zoom"
  }, Math.round(scale * 100), "%"), /*#__PURE__*/React.createElement("button", {
    onClick: () => zoomBtn(1.25),
    "aria-label": "Zoom in"
  }, "+"), /*#__PURE__*/React.createElement("button", {
    className: "zfit",
    onClick: fitView,
    "aria-label": "Fit whole map"
  }, "⤢")), mode === "spatial" && /*#__PURE__*/React.createElement("div", {
    className: "wavectl",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "wavectl-cap"
  }, "Brain waves"), /*#__PURE__*/React.createElement("div", {
    className: "wavectl-row"
  }, WAVE_IDS.map(wid => {
    const w = idx.byId[wid];
    if (!w) return null;
    const on = activeWave === wid;
    return /*#__PURE__*/React.createElement("button", {
      key: wid,
      className: "wave-btn" + (on ? " on" : ""),
      style: {
        "--wc": WAVE_COLORS[wid]
      },
      onClick: () => onWaveChange(on ? null : wid),
      title: w.name
    }, w.name[0]);
  }))), node && /*#__PURE__*/React.createElement("div", {
    className: "depth-rail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dr-cap"
  }, "surface"), Array.from({
    length: treeMaxDepth + 1
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "dr-dot" + (i <= selDepth ? " on" : "") + (i === selDepth ? " now" : "")
  })), /*#__PURE__*/React.createElement("span", {
    className: "dr-cap"
  }, "deep")), node && /*#__PURE__*/React.createElement("div", {
    className: "hud",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "hud-depth"
  }, "L", selDepth, /*#__PURE__*/React.createElement("span", null, "/", treeMaxDepth)), /*#__PURE__*/React.createElement("div", {
    className: "hud-trail"
  }, chain.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "ht" + (i === chain.length - 1 ? " here" : ""),
    onClick: () => onSelect(c.id)
  }, c.name), i < chain.length - 1 && /*#__PURE__*/React.createElement("span", {
    className: "ht-sep"
  }, "›"))))), node ? cardOpen ? /*#__PURE__*/React.createElement("div", {
    className: "mcard",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "mc-close",
    onClick: () => setCardOpen(false),
    "aria-label": "Hide details"
  }, "×"), /*#__PURE__*/React.createElement("div", {
    className: "mc-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: TAGS[node.tag].color + "22",
      color: TAGS[node.tag].color,
      border: `1px solid ${TAGS[node.tag].color}55`
    }
  }, TAGS[node.tag].label), node.code && /*#__PURE__*/React.createElement("span", {
    className: "mc-code"
  }, node.code)), /*#__PURE__*/React.createElement("div", {
    className: "mc-name"
  }, node.name), node.blurb && /*#__PURE__*/React.createElement("div", {
    className: "mc-blurb"
  }, node.blurb), info?.detail && /*#__PURE__*/React.createElement("div", {
    className: "mc-detail"
  }, info.detail), info?.functions && /*#__PURE__*/React.createElement("div", {
    className: "mc-fn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-h"
  }, "Functions"), /*#__PURE__*/React.createElement("ul", {
    className: "mc-fnlist"
  }, info.functions.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, f)))), ground && /*#__PURE__*/React.createElement("div", {
    className: "mc-exp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-h"
  }, "In your experience"), ground.senses && /*#__PURE__*/React.createElement("div", {
    className: "mc-senses"
  }, ground.senses.map(s => /*#__PURE__*/React.createElement("span", {
    className: "sense",
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "mc-exptext"
  }, ground.experience)), /*#__PURE__*/React.createElement("div", {
    className: "mc-path"
  }, chain.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-crumb",
    onClick: () => onSelect(c.id)
  }, c.name), i < chain.length - 1 && /*#__PURE__*/React.createElement("span", {
    className: "mc-sep"
  }, "›")))), /*#__PURE__*/React.createElement("div", {
    className: "mc-stats"
  }, "Depth L", selDepth, " · ", kids.length, " part", kids.length === 1 ? "" : "s", " · ", countDescendants(node), " inside"), /*#__PURE__*/React.createElement("div", {
    className: "mc-actions"
  }, parent && /*#__PURE__*/React.createElement("button", {
    className: "mc-btn",
    onClick: () => onSelect(parent.id)
  }, "▲ Up · ", parent.name), /*#__PURE__*/React.createElement("button", {
    className: "mc-btn ghost",
    onClick: () => onSelect("ns")
  }, "◎ Surface")), kids.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mc-h"
  }, "Dive deeper"), /*#__PURE__*/React.createElement("div", {
    className: "mc-chips"
  }, kids.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "mc-chip",
    onClick: () => onSelect(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[c.tag].color
    }
  }), c.name)))) : /*#__PURE__*/React.createElement("div", {
    className: "mc-leaf"
  }, "Deepest point on this branch."), sibs.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mc-h"
  }, "Alongside"), /*#__PURE__*/React.createElement("div", {
    className: "mc-chips"
  }, sibs.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "mc-chip",
    onClick: () => onSelect(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: TAGS[c.tag].color
    }
  }), c.name))))) : /*#__PURE__*/React.createElement("button", {
    className: "mc-reopen",
    onClick: e => {
      e.stopPropagation();
      setCardOpen(true);
    }
  }, "ⓘ Details") : /*#__PURE__*/React.createElement("div", {
    className: "map-hint"
  }, "Nothing selected · tap a structure to explore")));
}

// ── ROOT ────────────────────────────────────────────────────────
// Bump this on every update so it's obvious in the UI which build you're
// looking at (bottom-right of the header, next to the theme toggle).
