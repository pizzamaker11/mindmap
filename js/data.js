// ─────────────────────────────────────────────────────────────
// BRAIN MAP — data layer.
// TREE is the whole taxonomy: edit it to add/rename/re-parent any
// structure. TAGS controls the category colors/legend. DETAIL and GROUND
// add the deep-dive text and "in your experience" panel for a node id.
// SENSES is a second root (organs/receptors) alongside TREE. EDGE_NOTE
// captions the dashed "connects to" links between nodes (rhythms/sleep
// states linking to the structures that generate them, etc).
// ─────────────────────────────────────────────────────────────

const TREE = {
  id: "ns",
  name: "Nervous System",
  tag: "system",
  blurb: "Everything neural, split into the brain-and-cord core (CNS) and the nerves that reach the rest of the body (PNS).",
  children: [{
    id: "cns",
    name: "Central Nervous System",
    code: "CNS",
    tag: "system",
    blurb: "The brain and spinal cord — the processing core.",
    children: [{
      id: "spinalcord",
      name: "Spinal Cord",
      code: "Medulla spinalis",
      tag: "system",
      blurb: "The cable relaying signals between brain and body, and running reflexes on its own.",
      children: [{
        id: "greymatter",
        name: "Grey Matter (Horns)",
        tag: "region",
        blurb: "The central butterfly of neuron cell bodies.",
        children: [{
          id: "dorsalhorn",
          name: "Dorsal Horn",
          tag: "nucleus",
          blurb: "Receives incoming sensory signals."
        }, {
          id: "ventralhorn",
          name: "Ventral Horn",
          tag: "nucleus",
          blurb: "Sends motor commands out to muscles."
        }]
      }, {
        id: "spinalwhite",
        name: "White Matter Columns",
        tag: "structure",
        blurb: "Ascending and descending fiber tracts."
      }]
    }, {
      id: "brain",
      name: "Brain",
      code: "Encephalon",
      tag: "system",
      blurb: "Divided by early development into forebrain, midbrain, and hindbrain — plus the functional networks that span them.",
      children: [{
        id: "networks",
        name: "Functional Networks",
        tag: "network",
        blurb: "Not places but teams — sets of distant regions that switch on together for a job, cutting across the anatomy.",
        children: [{
          id: "dmn",
          name: "Default Mode Network",
          code: "DMN",
          tag: "network",
          blurb: "Active at rest and during inward thought — daydreaming, memory, imagining other minds.",
          children: [{
            id: "dmn_mpfc",
            name: "Medial Prefrontal Cortex",
            code: "mPFC",
            tag: "area",
            blurb: "Self-reference and social cognition."
          }, {
            id: "dmn_pcc",
            name: "Posterior Cingulate / Precuneus",
            tag: "area",
            blurb: "The DMN's central hub."
          }, {
            id: "dmn_angular",
            name: "Angular Gyrus",
            tag: "area",
            blurb: "Binds memory and meaning."
          }, {
            id: "dmn_hippo",
            name: "Hippocampal Formation",
            tag: "area",
            blurb: "Feeds memory into the network."
          }]
        }, {
          id: "salience",
          name: "Salience Network",
          tag: "network",
          blurb: "Flags what matters now and switches the brain between the DMN and task focus.",
          children: [{
            id: "sal_insula",
            name: "Anterior Insula",
            tag: "area",
            blurb: "Detects salient events."
          }, {
            id: "sal_acc",
            name: "Dorsal ACC",
            tag: "area",
            blurb: "Recruits attention and control."
          }]
        }, {
          id: "fpn",
          name: "Frontoparietal / Executive",
          code: "FPN",
          tag: "network",
          blurb: "The task-control network — goal-directed thinking and working memory.",
          children: [{
            id: "fpn_dlpfc",
            name: "Dorsolateral PFC",
            tag: "area",
            blurb: "Holds and manipulates goals."
          }, {
            id: "fpn_ppc",
            name: "Posterior Parietal Cortex",
            tag: "area",
            blurb: "Attention and integration."
          }]
        }, {
          id: "dan",
          name: "Dorsal Attention Network",
          code: "DAN",
          tag: "network",
          blurb: "Voluntarily aims attention at locations and features.",
          children: [{
            id: "dan_fef",
            name: "Frontal Eye Fields",
            tag: "area",
            blurb: "Directs gaze and spatial attention."
          }, {
            id: "dan_ips",
            name: "Intraparietal Sulcus",
            tag: "area",
            blurb: "Maps attended space."
          }]
        }, {
          id: "smn",
          name: "Sensorimotor Network",
          code: "SMN",
          tag: "network",
          blurb: "Couples touch and movement across the body.",
          children: [{
            id: "smn_m1",
            name: "Primary Motor Cortex",
            tag: "area",
            blurb: "Movement output."
          }, {
            id: "smn_s1",
            name: "Primary Somatosensory Cortex",
            tag: "area",
            blurb: "Touch input."
          }]
        }, {
          id: "visualnet",
          name: "Visual Network",
          tag: "network",
          blurb: "The occipital visual areas working as one system.",
          children: [{
            id: "vn_v1",
            name: "Primary Visual Cortex",
            tag: "area",
            blurb: "Entry point for vision."
          }, {
            id: "vn_extra",
            name: "Extrastriate Areas",
            tag: "area",
            blurb: "V2–V5 higher processing."
          }]
        }]
      }, {
        id: "rhythms",
        name: "Brain Rhythms & Sleep",
        tag: "rhythm",
        blurb: "Not a place but a behavior — the brain's electrical oscillations and the states (waking, sleep, dreaming) they mark. Crucially, the brain never runs just one wave: at any instant MANY frequencies overlap across different regions at once, and the mix defines the state.",
        children: [{
          id: "waves",
          name: "Brain Waves (EEG Bands)",
          tag: "rhythm",
          blurb: "Populations of neurons fire in rhythm; EEG sorts the rhythm into frequency bands. Faster = more alert, slower = deeper rest — but several always coexist.",
          children: [{
            id: "delta",
            name: "Delta (0.5–4 Hz)",
            tag: "rhythm",
            blurb: "Slowest, largest waves — deep dreamless sleep and restoration.",
            link: ["thalamus", "cortex"]
          }, {
            id: "theta",
            name: "Theta (4–8 Hz)",
            tag: "rhythm",
            blurb: "Drowsiness, REM, and active memory encoding.",
            link: ["hippo", "entorhinal"]
          }, {
            id: "alpha",
            name: "Alpha (8–12 Hz)",
            tag: "rhythm",
            blurb: "Relaxed, eyes-closed wakefulness — an idling rhythm.",
            link: ["occipital"]
          }, {
            id: "beta",
            name: "Beta (13–30 Hz)",
            tag: "rhythm",
            blurb: "Alert, focused, actively thinking or moving.",
            link: ["frontal", "m1"]
          }, {
            id: "gamma",
            name: "Gamma (30–100+ Hz)",
            tag: "rhythm",
            blurb: "Fastest — binding features into one percept, attention.",
            link: ["pfc", "thalamus"]
          }, {
            id: "cfc",
            name: "Cross-Frequency Coupling",
            tag: "rhythm",
            blurb: "Slow and fast rhythms nest together — a fast wave's amplitude rises and falls in step with a slower wave's phase. Theta-gamma coupling in the hippocampus is the clearest case: each theta cycle opens a gamma 'window' used to encode one item into memory.",
            link: ["hippo", "entorhinal"]
          }]
        }, {
          id: "states",
          name: "Sleep & Arousal",
          tag: "rhythm",
          blurb: "The daily cycle of consciousness, switched by the brainstem, thalamus, and hypothalamus.",
          children: [{
            id: "wake",
            name: "Wakefulness",
            tag: "rhythm",
            blurb: "Fast low-amplitude beta/gamma; senses open.",
            link: ["reticular", "thalamus"]
          }, {
            id: "nrem",
            name: "NREM Sleep (1–3)",
            tag: "rhythm",
            blurb: "Light to deep slow-wave sleep; delta grows, body restores.",
            link: ["thalamus", "hypothalamus"],
            children: [{
              id: "spindles",
              name: "Sleep Spindles",
              tag: "rhythm",
              blurb: "Short 11–16 Hz bursts (~0.5–2s) from thalamo-cortical loops during stage 2 sleep — gate out minor disturbances and help file new memories into cortex.",
              link: ["thalamus", "cortex"]
            }, {
              id: "kcomplex",
              name: "K-Complexes",
              tag: "rhythm",
              blurb: "The single largest waveform in human EEG, marking stage 2 sleep — triggered by a sound or arising spontaneously, apparently suppressing arousal so sleep continues.",
              link: ["cortex"]
            }, {
              id: "slowosc",
              name: "Slow Oscillations (<1 Hz)",
              tag: "rhythm",
              blurb: "The defining rhythm of deep stage 3 sleep — cortical neurons swing together between a firing 'up-state' and a silent 'down-state', related to but distinct from delta.",
              link: ["cortex", "thalamus"]
            }]
          }, {
            id: "rem",
            name: "REM Sleep",
            tag: "rhythm",
            blurb: "Vivid dreams, theta/gamma, darting eyes, paralyzed muscles.",
            link: ["pons", "amyg", "hippo"]
          }, {
            id: "clock",
            name: "Circadian Clock",
            tag: "rhythm",
            blurb: "The ~24-hour timer setting sleep pressure and melatonin.",
            link: ["hypothalamus", "epithalamus"]
          }, {
            id: "cycle",
            name: "Sleep Cycle (Ultradian)",
            tag: "rhythm",
            blurb: "One full NREM→REM lap takes ~90 minutes and repeats 4–6 times a night. Early cycles are deep-NREM-heavy; REM stretches grow longer toward morning — why early-morning dreams are the most vivid.",
            link: ["thalamus", "pons"]
          }]
        }]
      }, {
        id: "forebrain",
        name: "Forebrain",
        code: "Prosencephalon",
        tag: "division",
        blurb: "The largest division — cerebrum plus the deep relay structures of the diencephalon.",
        children: [{
          id: "cerebrum",
          name: "Cerebrum",
          code: "Telencephalon",
          tag: "division",
          blurb: "The two hemispheres: outer cortex, deep subcortical nuclei, and connecting white matter.",
          children: [{
            id: "cortex",
            name: "Cerebral Cortex",
            tag: "division",
            blurb: "The folded outer sheet where sensing, movement, and higher thought are mapped across four lobes.",
            children: [{
              id: "frontal",
              name: "Frontal Lobe",
              tag: "region",
              blurb: "Planning, movement, and language production.",
              children: [{
                id: "pfc",
                name: "Prefrontal Cortex",
                code: "PFC",
                tag: "area",
                blurb: "Planning, judgment, working memory.",
                children: [{
                  id: "dlpfc",
                  name: "Dorsolateral PFC",
                  code: "dlPFC",
                  tag: "area",
                  blurb: "Working memory and executive control."
                }, {
                  id: "vmpfc",
                  name: "Ventromedial PFC",
                  code: "vmPFC",
                  tag: "area",
                  blurb: "Value, emotion regulation, self-reference."
                }, {
                  id: "ofc",
                  name: "Orbitofrontal Cortex",
                  code: "OFC",
                  tag: "area",
                  blurb: "Reward valuation and decision-making."
                }, {
                  id: "fpc",
                  name: "Frontopolar Cortex",
                  code: "BA10",
                  tag: "area",
                  blurb: "Abstract reasoning and multitasking."
                }]
              }, {
                id: "m1",
                name: "Primary Motor Cortex",
                code: "M1 · BA4",
                tag: "area",
                blurb: "Sends movement commands to the body."
              }, {
                id: "premotor",
                name: "Premotor Cortex",
                code: "BA6",
                tag: "area",
                blurb: "Prepares and sequences movement."
              }, {
                id: "sma",
                name: "Supplementary Motor Area",
                code: "SMA",
                tag: "area",
                blurb: "Plans and sequences complex movements."
              }, {
                id: "fef",
                name: "Frontal Eye Fields",
                code: "FEF",
                tag: "area",
                blurb: "Controls voluntary eye movements."
              }, {
                id: "broca",
                name: "Broca's Area",
                code: "BA44/45",
                tag: "area",
                blurb: "Speech production."
              }]
            }, {
              id: "parietal",
              name: "Parietal Lobe",
              tag: "region",
              blurb: "Touch, body sense, and spatial awareness.",
              children: [{
                id: "s1",
                name: "Primary Somatosensory Cortex",
                code: "S1 · BA3,1,2",
                tag: "area",
                blurb: "Maps touch across the body."
              }, {
                id: "spl",
                name: "Superior Parietal Lobule",
                tag: "area",
                blurb: "Spatial attention, reaching."
              }, {
                id: "ipl",
                name: "Inferior Parietal Lobule",
                tag: "area",
                blurb: "Integrates senses, tool use, language."
              }, {
                id: "precuneus",
                name: "Precuneus",
                tag: "area",
                blurb: "Self-reflection and imagery; a core DMN hub."
              }, {
                id: "angular",
                name: "Angular Gyrus",
                code: "BA39",
                tag: "area",
                blurb: "Language, number, and concept integration."
              }, {
                id: "supramarginal",
                name: "Supramarginal Gyrus",
                code: "BA40",
                tag: "area",
                blurb: "Phonology and tactile-spatial processing."
              }, {
                id: "ips",
                name: "Intraparietal Sulcus",
                code: "IPS",
                tag: "area",
                blurb: "Attention and eye-hand coordination."
              }]
            }, {
              id: "temporal",
              name: "Temporal Lobe",
              tag: "region",
              blurb: "Hearing, language comprehension, object recognition.",
              children: [{
                id: "a1",
                name: "Primary Auditory Cortex",
                code: "A1 · BA41",
                tag: "area",
                blurb: "First cortical stop for sound."
              }, {
                id: "wernicke",
                name: "Wernicke's Area",
                code: "BA22",
                tag: "area",
                blurb: "Language comprehension."
              }, {
                id: "fusiform",
                name: "Fusiform Gyrus",
                tag: "area",
                blurb: "Faces and word forms."
              }, {
                id: "it",
                name: "Inferior Temporal Cortex",
                code: "IT",
                tag: "area",
                blurb: "Late-stage object recognition — the 'what' pathway's end."
              }, {
                id: "stg",
                name: "Superior Temporal Gyrus",
                code: "STG",
                tag: "area",
                blurb: "Auditory processing and social perception."
              }, {
                id: "sts",
                name: "Superior Temporal Sulcus",
                code: "STS",
                tag: "area",
                blurb: "Biological motion, faces, theory of mind."
              }, {
                id: "entorhinal",
                name: "Entorhinal Cortex",
                tag: "area",
                blurb: "Gateway to the hippocampus; grid cells."
              }, {
                id: "parahippo",
                name: "Parahippocampal Gyrus",
                tag: "area",
                blurb: "Scene and place recognition."
              }, {
                id: "temporalpole",
                name: "Temporal Pole",
                tag: "area",
                blurb: "Semantic memory and social-emotional binding."
              }]
            }, {
              id: "occipital",
              name: "Occipital Lobe",
              tag: "region",
              blurb: "The brain's dedicated visual lobe, at the back of the head.",
              children: [{
                id: "viscortex",
                name: "Visual Cortex",
                tag: "region",
                blurb: "A stack of areas that pass vision along, each one reading more from the signal than the last.",
                children: [{
                  id: "v1",
                  name: "V1 — Primary Visual Cortex",
                  code: "V1 · BA17 · Striate",
                  tag: "area",
                  blurb: "First cortical input. Reads edges, orientation, basic contrast."
                }, {
                  id: "v2",
                  name: "V2 — Secondary Visual Cortex",
                  code: "V2 · BA18",
                  tag: "area",
                  blurb: "Combines edges into figures; handles illusory contours and depth."
                }, {
                  id: "v3",
                  name: "V3",
                  code: "V3",
                  tag: "area",
                  blurb: "Form of moving objects, dynamic contours, and depth — motion and shape read together."
                }, {
                  id: "v4",
                  name: "V4",
                  code: "V4",
                  tag: "area",
                  blurb: "Color, curvature and simple shape, visual attention, and figure-ground separation."
                }, {
                  id: "v5",
                  name: "V5 — Middle Temporal",
                  code: "V5 / MT",
                  tag: "area",
                  blurb: "Direction and speed of motion."
                }, {
                  id: "lingual",
                  name: "Lingual Gyrus",
                  tag: "area",
                  blurb: "Lower visual field; word and face cues."
                }, {
                  id: "cuneus",
                  name: "Cuneus",
                  tag: "area",
                  blurb: "Upper visual field processing."
                }]
              }]
            }, {
              id: "insula",
              name: "Insular Cortex",
              tag: "region",
              blurb: "Interoception, taste, emotional awareness — folded deep in the lateral sulcus."
            }, {
              id: "cingulate",
              name: "Cingulate Cortex",
              tag: "region",
              blurb: "The medial limbic belt wrapping the corpus callosum.",
              children: [{
                id: "acc",
                name: "Anterior Cingulate Cortex",
                code: "ACC",
                tag: "area",
                blurb: "Conflict monitoring, error, emotion regulation."
              }, {
                id: "mcc",
                name: "Midcingulate Cortex",
                code: "MCC",
                tag: "area",
                blurb: "Pain and action-outcome learning."
              }, {
                id: "pcc",
                name: "Posterior Cingulate Cortex",
                code: "PCC",
                tag: "area",
                blurb: "Core DMN hub; self-reference and memory."
              }]
            }]
          }, {
            id: "subcort",
            name: "Subcortical Structures",
            tag: "division",
            blurb: "Grey-matter nuclei buried beneath the cortex.",
            children: [{
              id: "bg",
              name: "Basal Ganglia",
              tag: "region",
              blurb: "Action selection, habit, and movement gating.",
              children: [{
                id: "caudate",
                name: "Caudate Nucleus",
                tag: "nucleus"
              }, {
                id: "putamen",
                name: "Putamen",
                tag: "nucleus"
              }, {
                id: "gp",
                name: "Globus Pallidus",
                tag: "nucleus"
              }, {
                id: "nacc",
                name: "Nucleus Accumbens",
                tag: "nucleus",
                blurb: "Reward and motivation."
              }]
            }, {
              id: "limbic",
              name: "Limbic Structures",
              tag: "region",
              blurb: "Memory and emotion.",
              children: [{
                id: "hippo",
                name: "Hippocampus",
                tag: "nucleus",
                blurb: "Forms new memories; spatial navigation."
              }, {
                id: "amyg",
                name: "Amygdala",
                tag: "nucleus",
                blurb: "Threat detection and emotional salience."
              }, {
                id: "fornix",
                name: "Fornix",
                tag: "structure",
                blurb: "Output tract carrying hippocampal signals."
              }, {
                id: "mammillary",
                name: "Mammillary Bodies",
                tag: "nucleus",
                blurb: "Memory relay in the Papez circuit."
              }]
            }]
          }, {
            id: "wm",
            name: "White Matter",
            tag: "division",
            blurb: "Myelinated fiber tracts wiring regions together.",
            children: [{
              id: "cc",
              name: "Corpus Callosum",
              tag: "structure",
              blurb: "The main bridge between the two hemispheres."
            }]
          }]
        }, {
          id: "diencephalon",
          name: "Diencephalon",
          tag: "division",
          blurb: "The central relay-and-regulation hub sitting between cerebrum and brainstem.",
          children: [{
            id: "thalamus",
            name: "Thalamus",
            tag: "nucleus",
            blurb: "Relay station for nearly all sensory input heading to cortex.",
            children: [{
              id: "lgn",
              name: "Lateral Geniculate Nucleus",
              code: "LGN",
              tag: "nucleus",
              blurb: "Visual relay to V1."
            }, {
              id: "mgn",
              name: "Medial Geniculate Nucleus",
              code: "MGN",
              tag: "nucleus",
              blurb: "Auditory relay to A1."
            }, {
              id: "pulvinar",
              name: "Pulvinar",
              tag: "nucleus",
              blurb: "Visual attention and integration."
            }, {
              id: "vpl",
              name: "Ventral Posterolateral Nucleus",
              code: "VPL",
              tag: "nucleus",
              blurb: "Body touch and pain relay to S1."
            }, {
              id: "mdthal",
              name: "Mediodorsal Nucleus",
              code: "MD",
              tag: "nucleus",
              blurb: "Prefrontal links; memory and cognition."
            }]
          }, {
            id: "hypothalamus",
            name: "Hypothalamus",
            tag: "nucleus",
            blurb: "Hormones, hunger, temperature, sleep drive."
          }, {
            id: "epithalamus",
            name: "Epithalamus",
            tag: "nucleus",
            blurb: "Pineal gland and habenula — melatonin, sleep rhythm."
          }, {
            id: "subthalamus",
            name: "Subthalamus",
            tag: "nucleus",
            blurb: "Motor regulation, tied to the basal ganglia."
          }]
        }]
      }, {
        id: "midbrain",
        name: "Midbrain",
        code: "Mesencephalon",
        tag: "division",
        blurb: "A short segment handling reflexes to sight and sound, plus key movement/reward nuclei.",
        children: [{
          id: "tectum",
          name: "Tectum",
          tag: "region",
          blurb: "The 'roof' — reflex orienting to stimuli.",
          children: [{
            id: "sc",
            name: "Superior Colliculus",
            tag: "nucleus",
            blurb: "Snaps the eyes and head toward visual events."
          }, {
            id: "ic",
            name: "Inferior Colliculus",
            tag: "nucleus",
            blurb: "Auditory relay and orienting."
          }]
        }, {
          id: "tegmentum",
          name: "Tegmentum",
          tag: "region",
          blurb: "The 'floor' — dopamine and movement nuclei.",
          children: [{
            id: "sn",
            name: "Substantia Nigra",
            tag: "nucleus",
            blurb: "Dopamine for movement; lost in Parkinson's."
          }, {
            id: "rn",
            name: "Red Nucleus",
            tag: "nucleus",
            blurb: "Motor coordination."
          }, {
            id: "vta",
            name: "Ventral Tegmental Area",
            code: "VTA",
            tag: "nucleus",
            blurb: "Dopamine for reward and motivation."
          }]
        }]
      }, {
        id: "hindbrain",
        name: "Hindbrain",
        code: "Rhombencephalon",
        tag: "division",
        blurb: "Vital autonomic control plus the cerebellum.",
        children: [{
          id: "metencephalon",
          name: "Metencephalon",
          tag: "division",
          blurb: "Pons and cerebellum.",
          children: [{
            id: "pons",
            name: "Pons",
            tag: "structure",
            blurb: "Relay between cortex and cerebellum; breathing, sleep.",
            children: [{
              id: "locuscoeruleus",
              name: "Locus Coeruleus",
              tag: "nucleus",
              blurb: "Main source of noradrenaline; arousal, stress."
            }]
          }, {
            id: "cerebellum",
            name: "Cerebellum",
            tag: "division",
            blurb: "Fine-tunes movement, balance, and timing.",
            children: [{
              id: "cbcortex",
              name: "Cerebellar Cortex",
              tag: "region",
              blurb: "The densely folded outer sheet."
            }, {
              id: "dcn",
              name: "Deep Cerebellar Nuclei",
              tag: "nucleus",
              blurb: "The cerebellum's main output."
            }, {
              id: "vermis",
              name: "Vermis",
              tag: "region",
              blurb: "Midline; posture and trunk coordination."
            }, {
              id: "flocculo",
              name: "Flocculonodular Lobe",
              tag: "region",
              blurb: "Balance and eye movement (vestibular)."
            }]
          }]
        }, {
          id: "myelencephalon",
          name: "Myelencephalon",
          tag: "division",
          blurb: "The most caudal segment.",
          children: [{
            id: "medulla",
            name: "Medulla Oblongata",
            tag: "structure",
            blurb: "Heart rate, breathing, blood pressure — vital reflexes.",
            children: [{
              id: "raphe",
              name: "Raphe Nuclei",
              tag: "nucleus",
              blurb: "Main source of serotonin; mood, sleep."
            }, {
              id: "reticular",
              name: "Reticular Formation",
              tag: "nucleus",
              blurb: "Arousal, consciousness, autonomic control."
            }]
          }]
        }]
      }]
    }]
  }, {
    id: "pns",
    name: "Peripheral Nervous System",
    code: "PNS",
    tag: "system",
    blurb: "The nerves outside the brain and cord.",
    children: [{
      id: "somatic",
      name: "Somatic Nervous System",
      tag: "division",
      blurb: "Voluntary movement and sensation."
    }, {
      id: "cranialnerves",
      name: "Cranial Nerves",
      tag: "nerve",
      blurb: "Twelve pairs (I–XII) emerging directly from the brain and brainstem.",
      children: [{
        id: "cn1",
        name: "I · Olfactory",
        tag: "nerve",
        blurb: "Smell."
      }, {
        id: "cn2",
        name: "II · Optic",
        tag: "nerve",
        blurb: "Vision."
      }, {
        id: "cn3",
        name: "III · Oculomotor",
        tag: "nerve",
        blurb: "Most eye movement; pupil."
      }, {
        id: "cn4",
        name: "IV · Trochlear",
        tag: "nerve",
        blurb: "Eye — superior oblique."
      }, {
        id: "cn5",
        name: "V · Trigeminal",
        tag: "nerve",
        blurb: "Face sensation; chewing."
      }, {
        id: "cn6",
        name: "VI · Abducens",
        tag: "nerve",
        blurb: "Eye — lateral rectus."
      }, {
        id: "cn7",
        name: "VII · Facial",
        tag: "nerve",
        blurb: "Facial expression; taste."
      }, {
        id: "cn8",
        name: "VIII · Vestibulocochlear",
        tag: "nerve",
        blurb: "Hearing and balance."
      }, {
        id: "cn9",
        name: "IX · Glossopharyngeal",
        tag: "nerve",
        blurb: "Taste and swallowing."
      }, {
        id: "cn10",
        name: "X · Vagus",
        tag: "nerve",
        blurb: "Parasympathetic to the organs."
      }, {
        id: "cn11",
        name: "XI · Accessory",
        tag: "nerve",
        blurb: "Neck and shoulder muscles."
      }, {
        id: "cn12",
        name: "XII · Hypoglossal",
        tag: "nerve",
        blurb: "Tongue movement."
      }]
    }, {
      id: "autonomic",
      name: "Autonomic Nervous System",
      tag: "division",
      blurb: "Involuntary control of organs.",
      children: [{
        id: "symp",
        name: "Sympathetic",
        tag: "region",
        blurb: "Fight-or-flight."
      }, {
        id: "parasymp",
        name: "Parasympathetic",
        tag: "region",
        blurb: "Rest-and-digest."
      }, {
        id: "enteric",
        name: "Enteric",
        tag: "region",
        blurb: "The gut's own network."
      }]
    }]
  }]
};
const TAGS = {
  system: {
    label: "System",
    color: "#c9c6bc"
  },
  division: {
    label: "Division",
    color: "#8f7fc9"
  },
  region: {
    label: "Region",
    color: "#d98aa0"
  },
  area: {
    label: "Area",
    color: "#e0b45f"
  },
  nucleus: {
    label: "Nucleus",
    color: "#74b0b6"
  },
  structure: {
    label: "Structure",
    color: "#7f97c4"
  },
  network: {
    label: "Network",
    color: "#8fb56a"
  },
  nerve: {
    label: "Nerve",
    color: "#c78f6a"
  },
  sense: {
    label: "Sense",
    color: "#5fb0d9"
  },
  organ: {
    label: "Organ",
    color: "#9cc4d6"
  },
  rhythm: {
    label: "Rhythm",
    color: "#c98bd0"
  }
};

// Richer per-node detail, kept separate so the tree stays readable.
// Anything here shows in the details box; nodes without an entry fall back to their blurb.
const DETAIL = {
  brain: {
    detail: "About 86 billion neurons wired into a few great divisions that develop from three early bulges in the neural tube.",
    functions: ["Turns sensation into perception", "Plans and drives movement", "Holds memory, emotion, and thought"]
  },
  cortex: {
    detail: "A sheet only ~2–4 mm thick, folded to fit ~2,600 cm² inside the skull. Six cellular layers, mapped into four lobes plus the insula.",
    functions: ["Conscious perception", "Voluntary movement", "Language, reasoning, and planning"]
  },
  frontal: {
    detail: "The largest lobe, front of the brain. Runs from raw movement at the back edge to abstract planning at the very front.",
    functions: ["Executive control and planning", "Movement initiation", "Speech production"]
  },
  pfc: {
    detail: "The 'executive suite' — the last region to fully mature, not until the mid-20s.",
    functions: ["Working memory", "Impulse control", "Judgment and planning"]
  },
  m1: {
    detail: "A strip along the precentral gyrus holding an upside-down map of the body (the motor homunculus).",
    functions: ["Sends the final movement command", "Fine motor control of hands and face"]
  },
  broca: {
    detail: "Usually in the left hemisphere. Damage causes halting, effortful speech with intact comprehension.",
    functions: ["Produces fluent speech", "Grammar and articulation"]
  },
  parietal: {
    detail: "Sits behind the central sulcus. Builds your sense of the body in space and where things are around you.",
    functions: ["Touch and body sense", "Spatial awareness", "Attention and navigation"]
  },
  s1: {
    detail: "Mirrors M1 across the central sulcus, with its own body map (the sensory homunculus) — lips and hands take huge territory.",
    functions: ["Maps touch, pressure, temperature", "Proprioception (body position)"]
  },
  occipital: {
    detail: "The visual lobe at the very back. Nearly all of it is devoted to sight, arranged as a processing ladder V1→V5.",
    functions: ["Receives and decodes vision", "Feeds the 'what' and 'where' pathways"]
  },
  viscortex: {
    detail: "A retinotopic stack: each area holds a map of the visual field and reads a bit more meaning than the one before it.",
    functions: ["Edges → forms → color → motion → objects"]
  },
  v1: {
    detail: "First cortical stop for vision (striate cortex). Neurons fire for edges at specific orientations and locations.",
    functions: ["Edge and orientation detection", "Contrast and spatial frequency", "Retinotopic mapping"]
  },
  v2: {
    detail: "Second tier. Begins binding edges into shapes and fills in illusory contours the eye doesn't literally see.",
    functions: ["Figure grouping", "Illusory contours", "Stereoscopic depth"]
  },
  v3: {
    detail: "Reads form and motion together — the shape of things that are moving, and dynamic contours.",
    functions: ["Form of moving objects", "Dynamic contours", "Depth cues"]
  },
  v4: {
    detail: "A hub for color constancy and moderately complex shape, and a key target of visual attention. Damage can cause achromatopsia (color blindness from brain, not eye).",
    functions: ["Color perception", "Curvature and simple shape", "Attention and figure-ground"]
  },
  v5: {
    detail: "Also called MT. Packed with motion-direction detectors; damage causes akinetopsia — seeing the world as stills.",
    functions: ["Direction of motion", "Speed of motion", "Smooth-pursuit eye movement"]
  },
  temporal: {
    detail: "Beneath the lateral sulcus. Hearing, understanding language, and recognizing objects and faces.",
    functions: ["Auditory processing", "Language comprehension", "Object and face recognition", "Memory (via hippocampus)"]
  },
  wernicke: {
    detail: "Left superior temporal. Damage yields fluent but meaningless speech and poor comprehension.",
    functions: ["Understands spoken and written language"]
  },
  fusiform: {
    detail: "Home of the fusiform face area; damage can cause prosopagnosia (face blindness).",
    functions: ["Face recognition", "Reading (visual word form)"]
  },
  insula: {
    detail: "Hidden deep in the lateral sulcus. The brain's interface between body states and feelings.",
    functions: ["Interoception (gut, heartbeat)", "Taste and disgust", "Emotional awareness"]
  },
  cingulate: {
    detail: "A belt of cortex wrapping the corpus callosum — the medial face of the limbic system.",
    functions: ["Emotion regulation", "Conflict and error monitoring", "Pain and motivation"]
  },
  acc: {
    detail: "Lights up when tasks conflict or errors occur, flagging the need for more control.",
    functions: ["Error detection", "Conflict monitoring", "Effort and motivation"]
  },
  pcc: {
    detail: "One of the most metabolically active spots in the resting brain and a core hub of the Default Mode Network.",
    functions: ["Self-referential thought", "Autobiographical memory", "DMN coordination"]
  },
  hippo: {
    detail: "A seahorse-shaped structure essential for turning experience into lasting memory. Site of adult neurogenesis.",
    functions: ["Forms new episodic memories", "Spatial navigation (place cells)", "Links memory to context"]
  },
  amyg: {
    detail: "An almond-shaped alarm hub. Fast, before you're consciously aware, it tags threat and emotional weight.",
    functions: ["Fear and threat detection", "Emotional memory", "Fight-or-flight trigger"]
  },
  bg: {
    detail: "Deep grey-matter loop that gates movement and habit — degeneration here underlies Parkinson's and Huntington's.",
    functions: ["Selects and initiates actions", "Suppresses unwanted movement", "Habit and reward learning"]
  },
  nacc: {
    detail: "The brain's reward centerpiece, driven by dopamine from the VTA.",
    functions: ["Reward and pleasure", "Motivation", "Reinforcement (and addiction)"]
  },
  thalamus: {
    detail: "The grand central station of the brain — almost every sensory pathway (except smell) synapses here before cortex.",
    functions: ["Sensory relay to cortex", "Regulates alertness and sleep", "Motor and consciousness circuits"]
  },
  lgn: {
    detail: "The thalamic relay for vision, feeding the optic radiations into V1.",
    functions: ["Relays retinal signals to V1"]
  },
  hypothalamus: {
    detail: "Pea-sized but mighty — the body's thermostat and hormone controller, linking brain to the endocrine system via the pituitary.",
    functions: ["Hunger, thirst, temperature", "Hormone release", "Sleep-wake and circadian drive"]
  },
  cerebellum: {
    detail: "The 'little brain' — only 10% of brain volume but over half its neurons. Smooths and times movement.",
    functions: ["Coordination and balance", "Motor timing and learning", "Some cognition and language"]
  },
  midbrain: {
    detail: "The top of the brainstem — reflex hub for sight and sound, and home of major dopamine nuclei.",
    functions: ["Visual and auditory reflexes", "Dopamine for movement and reward", "Eye movement"]
  },
  sn: {
    detail: "Its dopamine neurons feed the basal ganglia; their loss causes Parkinson's disease.",
    functions: ["Dopamine for smooth movement"]
  },
  vta: {
    detail: "Origin of the mesolimbic dopamine pathway to the nucleus accumbens — the reward highway.",
    functions: ["Dopamine for reward and motivation"]
  },
  pons: {
    detail: "A bulge bridging cortex and cerebellum; also gates REM sleep and breathing rhythm.",
    functions: ["Relay to cerebellum", "REM sleep", "Breathing and facial functions"]
  },
  locuscoeruleus: {
    detail: "A tiny blue-tinged nucleus that supplies most of the brain's noradrenaline.",
    functions: ["Arousal and alertness", "Stress response", "Attention"]
  },
  raphe: {
    detail: "Midline nuclei that are the brain's main serotonin source, projecting almost everywhere.",
    functions: ["Mood regulation", "Sleep-wake cycles", "Appetite"]
  },
  reticular: {
    detail: "A diffuse net through the brainstem core; its ascending activating system keeps you conscious and awake.",
    functions: ["Consciousness and arousal", "Sleep-wake transitions", "Autonomic and reflex control"]
  },
  medulla: {
    detail: "Where brain meets spinal cord. Small but non-negotiable — it runs the vital autonomic reflexes.",
    functions: ["Heart rate and blood pressure", "Breathing", "Swallowing, coughing, vomiting"]
  },
  spinalcord: {
    detail: "A cable of nerve tissue in the vertebral column, ~45 cm long, carrying signals both ways and running reflex arcs on its own.",
    functions: ["Two-way brain-body signaling", "Spinal reflexes", "Central pattern generators for walking"]
  },
  cc: {
    detail: "The brain's largest white-matter tract — ~200 million axons linking the two hemispheres.",
    functions: ["Interhemispheric communication", "Coordinates the two sides"]
  },
  networks: {
    detail: "The brain isn't just places; it's teams. These networks are sets of distant regions that switch on together for a job and are found by tracking correlated activity at rest.",
    functions: ["Coordinate distributed regions", "Switch the brain between modes"]
  },
  dmn: {
    detail: "Discovered because it got quieter during tasks and louder at rest. It's the network of the wandering, inward mind — and shows changes in depression, Alzheimer's, and aging.",
    functions: ["Mind-wandering and daydreaming", "Autobiographical memory", "Imagining the future and others' minds", "Self-referential thought"]
  },
  salience: {
    detail: "The switchboard — it detects what's important and toggles the brain between the inward DMN and outward task networks.",
    functions: ["Detects salient stimuli", "Switches DMN ↔ task focus", "Integrates body and emotion signals"]
  },
  fpn: {
    detail: "The flexible controller that configures itself to whatever goal you're pursuing right now.",
    functions: ["Goal-directed control", "Working memory", "Cognitive flexibility"]
  },
  dan: {
    detail: "Aims attention on purpose — the top-down spotlight for where and what to look at.",
    functions: ["Voluntary spatial attention", "Eye-movement planning", "Feature search"]
  },
  smn: {
    detail: "Binds the touch and movement maps into one loop for perceiving and acting on the body.",
    functions: ["Sensorimotor integration", "Movement execution"]
  },
  visualnet: {
    detail: "The occipital areas operating as a coordinated system for seeing.",
    functions: ["Visual processing", "Feeds attention and recognition networks"]
  },
  cranialnerves: {
    detail: "Twelve pairs, numbered I–XII front to back, wiring the head and (for the vagus) the organs directly to the brain rather than through the cord.",
    functions: ["Special senses (smell, sight, taste, hearing)", "Face and eye movement", "Parasympathetic output"]
  },
  rhythms: {
    detail: "EEG measures voltage from millions of neurons firing together. The key idea for study: the brain is always producing a spectrum of frequencies simultaneously — delta, theta, alpha, beta, and gamma overlap in different amounts across different regions. The 'state' (awake, drowsy, asleep, dreaming) is the balance of that mix, not a single wave.",
    functions: ["Coordinate timing across regions", "Mark and drive states of consciousness", "Gate memory, attention, and sleep"]
  },
  waves: {
    detail: "Five classic bands, slow to fast. They are not exclusive — a focused brain shows mostly beta/gamma but still carries slower rhythms underneath, and different lobes can be dominated by different bands at the same moment. The mix also varies by place: frontal cortex leans beta when concentrating and slow waves in deep NREM, occipital cortex shows the clearest alpha the instant the eyes close, the hippocampus runs a near-constant theta rhythm while navigating or dreaming, and the thalamus paces slow waves and spindles out to the whole cortex at once.",
    functions: ["Delta ← deep sleep (thalamus & cortex)", "Theta ← memory, drowsiness, REM (hippocampus)", "Alpha ← relaxed idling (occipital cortex)", "Beta ← active focus (frontal & motor cortex)", "Gamma ← binding & attention (prefrontal cortex, thalamus)"]
  },
  delta: {
    detail: "0.5–4 Hz. Generated by synchronized thalamus–cortex loops; dominant in NREM stage 3 (slow-wave sleep). Linked to physical restoration, immune function, and memory consolidation.",
    functions: ["Deep, restorative sleep", "Slow-wave memory consolidation"]
  },
  theta: {
    detail: "4–8 Hz. Strongest in the hippocampus, where it paces the encoding of new memories and spatial navigation; also present in drowsiness, meditation, and REM.",
    functions: ["Memory encoding", "Spatial navigation", "Drowsy/REM states"]
  },
  alpha: {
    detail: "8–12 Hz. Rises over the posterior/occipital cortex when you close your eyes and relax, and is suppressed the moment you open them or focus — an 'idling' rhythm of unengaged cortex.",
    functions: ["Relaxed wakefulness", "Sensory idling / inhibition"]
  },
  beta: {
    detail: "13–30 Hz. The rhythm of an engaged, alert cortex — problem-solving, focus, and motor control. Motor beta drops sharply just before and during movement.",
    functions: ["Active concentration", "Motor readiness"]
  },
  gamma: {
    detail: "30–100+ Hz. The fastest band, tied to 'binding' — stitching color, shape, sound, and meaning into a single conscious percept — and to attention and working memory.",
    functions: ["Feature binding", "Attention & working memory"]
  },
  wake: {
    detail: "Driven by the brainstem reticular activating system and an 'open' thalamus that lets sensation through. EEG is fast and desynchronized (beta/gamma).",
    functions: ["Conscious awareness", "Open sensory gates"]
  },
  nrem: {
    detail: "Three stages of progressively deeper sleep. The thalamus 'closes the gate' on incoming senses; sleep spindles and slow delta waves appear; the hypothalamus (VLPO) actively drives sleep. Most deep restoration happens here.",
    functions: ["Physical restoration", "Sensory gating", "Memory consolidation"]
  },
  rem: {
    detail: "Switched on from the pons using acetylcholine. The brain looks almost awake (theta/gamma), the eyes dart, and the body is paralyzed (atonia) so you don't act out dreams. Emotional (amygdala) and memory (hippocampus) circuits are highly active — dreaming and emotional memory processing.",
    functions: ["Dreaming", "Emotional memory processing", "Muscle atonia"]
  },
  clock: {
    detail: "The suprachiasmatic nucleus of the hypothalamus is the master ~24h clock, synced by light; it drives the pineal gland to release melatonin at night, setting sleep timing and pressure.",
    functions: ["Circadian timing", "Melatonin release", "Sleep pressure"]
  },
  cfc: {
    detail: "Cross-frequency coupling: a slow rhythm's phase sets the timing window for a fast rhythm's amplitude. Best studied in the hippocampus, where each ~125ms theta cycle carves out a handful of gamma bursts, and each burst is thought to carry one discrete item being encoded or recalled — a way to fit several memories onto a single rhythm.",
    functions: ["Multiplexes several items onto one rhythm", "Times memory encoding within each theta cycle", "Also seen elsewhere (e.g. slow-oscillation/spindle coupling in NREM)"]
  },
  spindles: {
    detail: "Generated by the thalamic reticular nucleus and relayed to cortex; how many appear after learning predicts how well that material is retained overnight.",
    functions: ["Gate the sleeping brain from waking to minor sounds", "Help transfer memories from hippocampus to cortex for long-term storage"]
  },
  kcomplex: {
    detail: "The single largest waveform in human EEG. Can be triggered by a sound without waking the sleeper, or occur spontaneously — evidence the sleeping brain is still monitoring its surroundings.",
    functions: ["Suppresses cortical arousal to minor stimuli", "Used as a marker to score stage 2 sleep"]
  },
  slowosc: {
    detail: "Cortex-wide neurons alternate between an 'up-state' (firing, EEG near baseline) and a 'down-state' (silent, large negative EEG deflection), synchronized across the whole cortex — the hallmark of the deepest sleep stage.",
    functions: ["Coordinates slow-wave sleep across the whole cortex", "Provides the 'up-state' windows that organize spindles and memory replay"]
  },
  cycle: {
    detail: "A night is a staircase of ~90-minute laps through stages 1→2→3→REM and back, not one flat block. Deep slow-wave sleep dominates the first half of the night; REM dominates the second half — why waking at 3am vs. 7am samples very different sleep.",
    functions: ["Alternates deep restorative NREM with memory-active REM", "REM share grows across the night", "Interrupting a cycle mid-slow-wave causes grogginess (sleep inertia)"]
  }
};

// Grounding in direct experience: which senses a part touches, and what it feels like
// (often framed as "what changes if it's affected"). Shown as the "In your experience" section.
const GROUND = {
  brain: {
    senses: ["Sight", "Hearing", "Touch", "Taste", "Smell"],
    experience: "Everything you have ever seen, heard, felt, or thought happened here. The lived world is the brain's activity — change the brain and the world you experience changes with it."
  },
  cortex: {
    senses: ["Sight", "Hearing", "Touch"],
    experience: "The surface where raw signals become conscious experience — the difference between light hitting your eye and actually seeing."
  },
  occipital: {
    senses: ["Sight"],
    experience: "This whole lobe is 'seeing'. A stroke here can leave you blind in part of your field even though your eyes are perfect — the eyes work, but there's nothing to see with."
  },
  viscortex: {
    senses: ["Sight"],
    experience: "Follow this ladder and you follow how a flash of light becomes a recognized face: edges, then shapes, then color, then motion, then meaning."
  },
  v1: {
    senses: ["Sight"],
    experience: "The first place vision reaches awareness. Damage to one side punches a blind hole in your visual field — you don't see darkness there, you just don't see it at all."
  },
  v2: {
    senses: ["Sight"],
    experience: "Fills in edges your eye never actually caught — like the bright triangle you 'see' floating between three notched circles that isn't really drawn."
  },
  v3: {
    senses: ["Sight", "Movement"],
    experience: "Lets you read the shape of something while it moves — the outline of a bird as it flies past."
  },
  v4: {
    senses: ["Sight"],
    experience: "This is why a strawberry looks red and grass green. Lose it and the world drains to grey (cerebral achromatopsia) — the eyes still catch color, but you can no longer see it."
  },
  v5: {
    senses: ["Sight", "Movement"],
    experience: "Turns a series of images into motion. Damaged, pouring tea looks frozen — you see the cup empty, then full, but never the stream (akinetopsia)."
  },
  lgn: {
    senses: ["Sight"],
    experience: "Every image from your eye passes through this relay on its way to becoming something you see."
  },
  cn2: {
    senses: ["Sight"],
    experience: "The literal cable from eye to brain. Cut it and that eye goes dark, no matter how healthy the eye itself is."
  },
  fusiform: {
    senses: ["Sight"],
    experience: "How you know a face is your friend's in an instant. Damage it and faces become unreadable — you'd know your mother only by her voice (prosopagnosia)."
  },
  it: {
    senses: ["Sight"],
    experience: "The end of the 'what is it' stream — where a pattern of light finally becomes 'a cup', 'a dog', 'a key'."
  },
  a1: {
    senses: ["Hearing"],
    experience: "The first place a vibration in the air becomes a sound you hear. Damage on both sides can leave you unable to make sense of what you hear despite working ears."
  },
  stg: {
    senses: ["Hearing"],
    experience: "Where sound becomes speech and voices — the music and meaning layered on top of raw noise."
  },
  cn8: {
    senses: ["Hearing", "Balance"],
    experience: "Carries both hearing and balance. Damage brings deafness on that side, or a spinning, seasick vertigo."
  },
  ic: {
    senses: ["Hearing"],
    experience: "Why your head snaps toward a sudden bang before you've thought about it."
  },
  mgn: {
    senses: ["Hearing"],
    experience: "The relay every sound passes through before you consciously hear it."
  },
  parietal: {
    senses: ["Touch"],
    experience: "Your sense of where your limbs are in the dark, and where things sit around you. Damage can make half the world (or half your own body) simply stop registering."
  },
  s1: {
    senses: ["Touch"],
    experience: "The exact spot that lights up when someone taps your hand. Damage numbs that body part to touch and position even though the skin is fine."
  },
  dorsalhorn: {
    senses: ["Touch", "Pain"],
    experience: "Where a pinprick or a warm mug first enters the nervous system, before the brain even knows."
  },
  cn5: {
    senses: ["Touch"],
    experience: "All feeling in your face runs through here — the dentist's numbing needle targets its branches."
  },
  cn1: {
    senses: ["Smell"],
    experience: "Bump your head hard enough to shear this nerve and food goes flavorless — most of what you call taste is really smell."
  },
  insula: {
    senses: ["Taste", "Body"],
    experience: "The feel of a racing heart, a full bladder, the curl of disgust at a bad smell, the taste of food — the body reported back to you as feeling."
  },
  cn7: {
    senses: ["Taste"],
    experience: "Carries taste from the front of your tongue, and moves every muscle of your smile."
  },
  frontal: {
    senses: ["Movement"],
    experience: "The gap between wanting to act and acting. Damage can leave you knowing exactly what to do yet unable to start."
  },
  m1: {
    senses: ["Movement"],
    experience: "The instant you decide to lift a finger, the command leaves from here. Damage causes weakness or paralysis on the opposite side of the body."
  },
  ventralhorn: {
    senses: ["Movement"],
    experience: "The final relay before a muscle contracts. Diseases that attack it (polio, ALS) cause muscles to wither."
  },
  cerebellum: {
    senses: ["Movement", "Balance"],
    experience: "Why your movements are smooth instead of jerky. Damaged, reaching for a cup becomes shaky and clumsy, and you overshoot."
  },
  flocculo: {
    senses: ["Balance"],
    experience: "Keeps your gaze steady and your body upright as you move — the reason the world doesn't lurch when you walk."
  },
  hippo: {
    senses: ["Memory"],
    experience: "Without it you'd live in a permanent present — meeting the same person hourly as a stranger, unable to lay down anything new."
  },
  amyg: {
    senses: ["Emotion"],
    experience: "The jolt of fear before you consciously register the snake on the path. It reacts faster than you can think."
  },
  hypothalamus: {
    senses: ["Body"],
    experience: "The gnaw of hunger, the dryness of thirst, feeling too hot or too cold — the drives you never chose to have."
  },
  thalamus: {
    senses: ["Sight", "Hearing", "Touch"],
    experience: "Almost everything you sense (except smell) is switchboarded through here before you're aware of it. It also sets how awake you are."
  },
  medulla: {
    senses: ["Body"],
    experience: "You never think about breathing or your heartbeat because this quietly runs them — even in deep sleep or a coma."
  },
  dmn: {
    senses: ["Thought", "Memory"],
    experience: "The exact texture of a wandering mind — replaying an old conversation, rehearsing tomorrow, drifting into 'you'. It quiets the moment you lock onto a task."
  },
  pcc: {
    senses: ["Thought", "Memory"],
    experience: "The felt sense of 'me' at rest, pulling up your own memories and story."
  },
  acc: {
    senses: ["Attention"],
    experience: "The friction you feel when two impulses collide — the 'wait, that's wrong' moment that makes you slow down and focus."
  },
  broca: {
    senses: ["Language"],
    experience: "You know exactly what you mean but the words won't come out smoothly — speech turns effortful and halting."
  },
  wernicke: {
    senses: ["Language"],
    experience: "Words pour out easily but don't mean anything, and others' speech sounds like a language you don't quite know."
  },
  fef: {
    senses: ["Sight", "Attention"],
    experience: "The aim of your gaze — flicking your eyes to a face in a crowd is this at work."
  },
  ips: {
    senses: ["Attention"],
    experience: "The spotlight of attention landing on a spot in space before your eyes even move there."
  },
  sn: {
    senses: ["Movement"],
    experience: "As its dopamine cells die, movement stiffens and slows and a tremor creeps in — this is Parkinson's disease."
  },
  vta: {
    senses: ["Emotion"],
    experience: "The lift of anticipation before something good — and the circuit that addictive drugs hijack."
  },
  nacc: {
    senses: ["Emotion"],
    experience: "The 'yes, want that' pull toward a reward — food, music, a like on a post."
  },
  spinalcord: {
    senses: ["Touch", "Movement"],
    experience: "The line between brain and body. A break high up can cut off all feeling and movement below it while the brain stays perfectly intact."
  },
  p_retina: {
    senses: ["Sight"],
    experience: "Where light actually becomes a signal. Everything you'll ever see starts as a pattern of firing here, then travels inward to be 'seen'."
  },
  p_photoreceptors: {
    senses: ["Sight"],
    experience: "Cones give you daylight color; rods give you dim night vision — which is why colors fade to grey in the dark."
  },
  p_cochlea: {
    senses: ["Hearing"],
    experience: "Different spots along its spiral answer to different pitches. Damage to the high-pitch end is why hearing loss often takes the high notes first."
  },
  p_semicircular: {
    senses: ["Balance"],
    experience: "Spin in a circle and stop — the fluid keeps moving, and this tells your brain you're still turning. That's dizziness."
  },
  p_mechano: {
    senses: ["Touch"],
    experience: "The receptors that feel a phone buzz, a fabric's texture, a handshake's pressure."
  },
  p_nociceptor: {
    senses: ["Pain"],
    experience: "The free nerve endings that fire when tissue is threatened — the sharp warning of a burn or cut."
  },
  p_olfepi: {
    senses: ["Smell"],
    experience: "A postage-stamp of tissue high in your nose holds the receptors for every scent you can name."
  },
  p_olfbulb: {
    senses: ["Smell", "Memory"],
    experience: "Smell wires straight into memory and emotion — why a scent can drop you into a childhood moment before you can name it."
  },
  p_tastebuds: {
    senses: ["Taste"],
    experience: "They only report five basic tastes; the rest of 'flavor' is your nose filling in the detail."
  },
  alpha: {
    senses: ["Thought"],
    experience: "That calm, floaty state with your eyes closed but not asleep — close your eyes and alpha swells over the back of your head; open them and it vanishes."
  },
  theta: {
    senses: ["Memory"],
    experience: "The drifting, dreamlike slide just before sleep — and the exact rhythm your hippocampus rides while you're memorizing or finding your way."
  },
  delta: {
    senses: ["Body"],
    experience: "The deep, dreamless sleep you're hardest to wake from — wake someone in delta and they're groggy and disoriented."
  },
  gamma: {
    senses: ["Thought"],
    experience: "The instant a jumble of shapes and sounds snaps into 'oh, that's a face' — separate features bound into one whole."
  },
  rem: {
    senses: ["Emotion", "Memory"],
    experience: "Where dreams live. Your eyes flick under closed lids while your body is held still, and emotional memories get replayed and filed."
  }
};

// The Senses — a separate island. Organs/receptors carry a `link` to the brain
// nodes they feed, drawn as dashed pathway lines on the map.
const SENSES = {
  id: "senses",
  name: "Senses & Organs",
  tag: "sense",
  blurb: "The body's interface with the world and itself — sense organs that feed signals in, and internal organs the nervous system controls. All of it wires back to the brain and cord.",
  children: [{
    id: "s_sight",
    name: "Sight",
    tag: "sense",
    blurb: "Light into vision.",
    children: [{
      id: "o_eye",
      name: "Eye",
      tag: "organ",
      blurb: "The camera of the body.",
      children: [{
        id: "p_cornea",
        name: "Cornea",
        tag: "organ",
        blurb: "Clear front window that bends incoming light."
      }, {
        id: "p_lens",
        name: "Lens",
        tag: "organ",
        blurb: "Fine-focuses light onto the retina."
      }, {
        id: "p_retina",
        name: "Retina",
        tag: "organ",
        blurb: "Light-sensitive sheet lining the back of the eye.",
        link: ["lgn"]
      }, {
        id: "p_photoreceptors",
        name: "Rods & Cones",
        tag: "organ",
        blurb: "Rods for dim light, cones for color.",
        link: ["p_retina"]
      }, {
        id: "p_opticnerve",
        name: "Optic Nerve",
        tag: "organ",
        blurb: "Bundles retinal output toward the brain.",
        link: ["cn2", "lgn"]
      }]
    }]
  }, {
    id: "s_hearing",
    name: "Hearing",
    tag: "sense",
    blurb: "Vibration into sound.",
    children: [{
      id: "o_ear",
      name: "Ear",
      tag: "organ",
      blurb: "Catches and decodes air pressure waves.",
      children: [{
        id: "p_eardrum",
        name: "Eardrum",
        tag: "organ",
        blurb: "Membrane that vibrates with sound."
      }, {
        id: "p_ossicles",
        name: "Ossicles",
        tag: "organ",
        blurb: "Three tiny bones that amplify the vibration."
      }, {
        id: "p_cochlea",
        name: "Cochlea",
        tag: "organ",
        blurb: "Spiral that turns vibration into nerve signals.",
        link: ["cn8", "a1"]
      }]
    }]
  }, {
    id: "s_balance",
    name: "Balance",
    tag: "sense",
    blurb: "Motion and gravity.",
    children: [{
      id: "o_vestibular",
      name: "Vestibular System",
      tag: "organ",
      blurb: "Inner-ear motion sensors.",
      children: [{
        id: "p_semicircular",
        name: "Semicircular Canals",
        tag: "organ",
        blurb: "Sense head rotation.",
        link: ["cn8", "flocculo"]
      }, {
        id: "p_otolith",
        name: "Otolith Organs",
        tag: "organ",
        blurb: "Sense gravity and straight-line motion.",
        link: ["cn8"]
      }]
    }]
  }, {
    id: "s_touch",
    name: "Touch",
    tag: "sense",
    blurb: "Pressure, temperature, pain.",
    children: [{
      id: "o_skin",
      name: "Skin",
      tag: "organ",
      blurb: "The body's largest sense organ.",
      children: [{
        id: "p_mechano",
        name: "Mechanoreceptors",
        tag: "organ",
        blurb: "Pressure, vibration, and texture.",
        link: ["dorsalhorn", "s1"]
      }, {
        id: "p_thermo",
        name: "Thermoreceptors",
        tag: "organ",
        blurb: "Warmth and cold.",
        link: ["dorsalhorn"]
      }, {
        id: "p_nociceptor",
        name: "Nociceptors",
        tag: "organ",
        blurb: "Tissue damage — pain.",
        link: ["dorsalhorn"]
      }]
    }]
  }, {
    id: "s_smell",
    name: "Smell",
    tag: "sense",
    blurb: "Airborne chemicals.",
    children: [{
      id: "o_nose",
      name: "Nose",
      tag: "organ",
      blurb: "Chemical sampler.",
      children: [{
        id: "p_olfepi",
        name: "Olfactory Epithelium",
        tag: "organ",
        blurb: "Odor-receptor sheet high in the nose.",
        link: ["cn1"]
      }, {
        id: "p_olfbulb",
        name: "Olfactory Bulb",
        tag: "organ",
        blurb: "First relay — the one sense that skips the thalamus.",
        link: ["cn1", "amyg", "hippo"]
      }]
    }]
  }, {
    id: "s_taste",
    name: "Taste",
    tag: "sense",
    blurb: "Dissolved chemicals.",
    children: [{
      id: "o_tongue",
      name: "Tongue",
      tag: "organ",
      blurb: "Chemical contact sensor.",
      children: [{
        id: "p_tastebuds",
        name: "Taste Buds",
        tag: "organ",
        blurb: "Detect sweet, salt, sour, bitter, umami.",
        link: ["cn7", "cn9", "insula"]
      }]
    }]
  }, {
    id: "s_organs",
    name: "Internal Organs",
    tag: "organ",
    blurb: "Viscera wired to the nervous system through the autonomic nerves — you don't steer them consciously.",
    children: [{
      id: "o_heart",
      name: "Heart",
      tag: "organ",
      blurb: "Rate and force set by autonomic nerves.",
      link: ["cn10", "symp", "parasymp"]
    }, {
      id: "o_lungs",
      name: "Lungs",
      tag: "organ",
      blurb: "Airways and breathing drive.",
      link: ["cn10", "medulla"]
    }, {
      id: "o_gut",
      name: "Stomach & Intestines",
      tag: "organ",
      blurb: "Digestion, largely self-run by the gut.",
      link: ["cn10", "enteric", "parasymp"]
    }, {
      id: "o_bladder",
      name: "Bladder",
      tag: "organ",
      blurb: "Storage and voiding via autonomic control.",
      link: ["parasymp", "symp"]
    }]
  }]
};
const ROOTS = [TREE, SENSES];

// Plain-language explanation for each pathway line, keyed "from__to".
const EDGE_NOTE = {
  p_photoreceptors__p_retina: "Rods and cones sit inside the retina and fire the very first visual signal.",
  p_retina__lgn: "The retina's output leaves the eye and reaches the LGN — the thalamic relay that hands vision to V1.",
  p_opticnerve__cn2: "The optic nerve is cranial nerve II: the same cable, named two ways.",
  p_opticnerve__lgn: "The optic nerve carries retinal signals to the LGN in the thalamus.",
  p_cochlea__cn8: "The cochlea's signal rides the vestibulocochlear nerve (CN VIII) into the brainstem.",
  p_cochlea__a1: "After relays, cochlear signals reach the primary auditory cortex, where sound is first heard.",
  p_semicircular__cn8: "Rotation signals travel the vestibular branch of CN VIII.",
  p_semicircular__flocculo: "Balance data feeds the flocculonodular lobe, which steadies gaze and posture.",
  p_otolith__cn8: "Gravity and straight-line motion also ride CN VIII into the brain.",
  p_mechano__dorsalhorn: "Touch signals enter the spinal cord at the dorsal horn.",
  p_mechano__s1: "From the cord, touch is relayed up to S1, where it's actually felt.",
  p_thermo__dorsalhorn: "Warmth and cold enter the cord through the dorsal horn.",
  p_nociceptor__dorsalhorn: "Pain enters and is gated at the dorsal horn before rising to the brain.",
  p_olfepi__cn1: "Odor receptors send their axons up as the olfactory nerve (CN I).",
  p_olfbulb__cn1: "The olfactory bulb receives CN I fibers as smell's first relay.",
  p_olfbulb__amyg: "Smell wires straight to the amygdala — why a scent triggers emotion so fast.",
  p_olfbulb__hippo: "Smell feeds the hippocampus, tying odors to memory.",
  p_tastebuds__cn7: "Taste from the front of the tongue travels the facial nerve (CN VII).",
  p_tastebuds__cn9: "Taste from the back of the tongue travels the glossopharyngeal nerve (CN IX).",
  p_tastebuds__insula: "Taste signals ultimately reach the insula, the brain's primary taste cortex.",
  o_heart__cn10: "The vagus nerve (CN X) is the brake on the heart — it slows the beat.",
  o_heart__symp: "Sympathetic 'fight-or-flight' nerves speed the heart up.",
  o_heart__parasymp: "Parasympathetic input calms and slows the heart.",
  o_lungs__cn10: "The vagus carries airway and breathing signals to and from the lungs.",
  o_lungs__medulla: "The medulla sets the breathing rhythm the lungs follow.",
  o_gut__cn10: "The vagus links gut and brain — the gut-brain axis.",
  o_gut__enteric: "The gut's own enteric network runs digestion semi-independently.",
  o_gut__parasymp: "Parasympathetic input drives digestion ('rest and digest').",
  o_bladder__parasymp: "Parasympathetic signals contract the bladder to empty it.",
  o_bladder__symp: "Sympathetic signals relax the bladder so it can store urine.",
  delta__thalamus: "Delta's slow waves are generated by thalamus–cortex loops in deep sleep.",
  delta__cortex: "Slow delta waves sweep broadly across the cortex during deep sleep.",
  theta__hippo: "The hippocampus runs a strong theta rhythm while encoding memory and navigating.",
  theta__entorhinal: "Entorhinal–hippocampal theta paces the timing of memory formation.",
  alpha__occipital: "Alpha is strongest over the occipital (visual) cortex when the eyes close.",
  beta__frontal: "Beta rises in frontal cortex during focused, effortful thought.",
  beta__m1: "Motor cortex carries beta that drops just before you move.",
  gamma__pfc: "Prefrontal gamma supports attention and holding things in working memory.",
  gamma__thalamus: "Thalamocortical gamma helps bind separate features into one percept.",
  wake__reticular: "The reticular activating system keeps the cortex aroused and awake.",
  wake__thalamus: "An 'open' thalamus lets sensation flow to cortex while you're awake.",
  nrem__thalamus: "In NREM the thalamus closes the gate, blocking sensory input.",
  nrem__hypothalamus: "The hypothalamus (VLPO) actively switches sleep on.",
  rem__pons: "REM is switched on from the pons, which also paralyzes the muscles.",
  rem__amyg: "An active amygdala in REM colors dreams with emotion.",
  rem__hippo: "REM helps the hippocampus replay and consolidate memories.",
  clock__hypothalamus: "The hypothalamus (suprachiasmatic nucleus) is the master 24-hour clock.",
  clock__epithalamus: "On the clock's cue, the pineal gland releases melatonin at night.",
  cfc__hippo: "Hippocampal theta cycles nest gamma bursts inside them, each burst carrying one item being encoded.",
  cfc__entorhinal: "Entorhinal-hippocampal circuits are where theta-gamma coupling has been measured most precisely.",
  spindles__thalamus: "Spindles are generated by the thalamic reticular nucleus.",
  spindles__cortex: "Spindles relay out to cortex, where they're thought to help file memories in.",
  kcomplex__cortex: "K-complexes are a cortex-wide response that can suppress arousal to a stimulus.",
  slowosc__cortex: "Slow oscillations sweep the whole cortex between firing and silent states.",
  slowosc__thalamus: "The thalamus helps synchronize cortical slow oscillations during deep sleep.",
  cycle__thalamus: "The thalamus flips between its 'open' (wake/REM-like) and 'closed' (NREM) gating modes across each cycle.",
  cycle__pons: "The pons switches REM on and off, pacing each ~90-minute lap of the cycle."
};
