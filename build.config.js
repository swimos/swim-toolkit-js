const core = [
  {
    id: "util",
    name: "@swim/util",
    path: "../swim-system-js/swim-core-js/@swim/util",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["util", "codec", "unit"],
      },
    ],
  },
  {
    id: "codec",
    name: "@swim/codec",
    path: "../swim-system-js/swim-core-js/@swim/codec",
    targets: [
      {
        id: "main",
        deps: ["util"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit"],
      },
    ],
  },
  {
    id: "args",
    name: "@swim/args",
    path: "../swim-system-js/swim-core-js/@swim/args",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "args"],
      },
    ],
  },
  {
    id: "build",
    name: "@swim/build",
    path: "../swim-system-js/swim-core-js/@swim/build",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "args"],
      },
    ],
  },
  {
    id: "unit",
    name: "@swim/unit",
    path: "../swim-system-js/swim-core-js/@swim/unit",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
    ],
  },
  {
    id: "collections",
    name: "@swim/collections",
    path: "../swim-system-js/swim-core-js/@swim/collections",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections"],
      },
    ],
  },
  {
    id: "mapping",
    name: "@swim/mapping",
    path: "../swim-system-js/swim-core-js/@swim/mapping",
    targets: [
      {
        id: "main",
        deps: ["util"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping"],
      },
    ],
  },
  {
    id: "structure",
    name: "@swim/structure",
    path: "../swim-system-js/swim-core-js/@swim/structure",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure"],
      },
    ],
  },
  {
    id: "streamlet",
    name: "@swim/streamlet",
    path: "../swim-system-js/swim-core-js/@swim/streamlet",
    targets: [
      {
        id: "main",
        deps: ["util", "collections"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections", "streamlet"],
      },
    ],
  },
  {
    id: "dataflow",
    name: "@swim/dataflow",
    path: "../swim-system-js/swim-core-js/@swim/dataflow",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections", "structure", "streamlet", "dataflow"],
      },
    ],
  },
  {
    id: "recon",
    name: "@swim/recon",
    path: "../swim-system-js/swim-core-js/@swim/recon",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "recon"],
      },
    ],
  },
  {
    id: "uri",
    name: "@swim/uri",
    path: "../swim-system-js/swim-core-js/@swim/uri",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "uri"],
      },
    ],
  },
  {
    id: "math",
    name: "@swim/math",
    path: "../swim-system-js/swim-core-js/@swim/math",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "math"],
      },
    ],
  },
  {
    id: "geo",
    name: "@swim/geo",
    path: "../swim-system-js/swim-core-js/@swim/geo",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "math", "geo"],
      },
    ],
  },
  {
    id: "time",
    name: "@swim/time",
    path: "../swim-system-js/swim-core-js/@swim/time",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "time"],
      },
    ],
  },
  {
    id: "core",
    name: "@swim/core",
    path: "../swim-system-js/swim-core-js/@swim/core",
    title: "Swim Core",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "math", "geo", "time"],
      },
    ],
  },
];

const mesh = [
  {
    id: "warp",
    name: "@swim/warp",
    path: "../swim-system-js/swim-mesh-js/@swim/warp",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "recon", "uri"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "recon", "uri", "warp"],
      },
    ],
  },
  {
    id: "client",
    name: "@swim/client",
    path: "../swim-system-js/swim-mesh-js/@swim/client",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "warp"],
      },
      {
        id: "test",
        deps: ["util", "codec", "collections", "unit", "mapping", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
      },
    ],
  },
  {
    id: "cli",
    name: "@swim/cli",
    path: "../swim-system-js/swim-mesh-js/@swim/cli",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "args", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
      },
    ],
  },
  {
    id: "mesh",
    name: "@swim/mesh",
    path: "../swim-system-js/swim-mesh-js/@swim/mesh",
    title: "Swim Mesh",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["warp", "client"],
      },
    ],
  },
];

const system = [
  {
    id: "system",
    name: "@swim/system",
    path: "../swim-system-js/@swim/system",
    title: "Swim System",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["core", "mesh"],
      },
    ],
  },
];

const ui = [
  {
    id: "constraint",
    name: "@swim/constraint",
    path: "swim-ui-js/@swim/constraint",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "constraint"],
      },
    ],
  },
  {
    id: "animation",
    name: "@swim/animation",
    path: "swim-ui-js/@swim/animation",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "animation"],
      },
    ],
  },
  {
    id: "color",
    name: "@swim/color",
    path: "swim-ui-js/@swim/color",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "math", "color"],
      },
    ],
  },
  {
    id: "style",
    name: "@swim/style",
    path: "swim-ui-js/@swim/style",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "color"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "math", "time", "color", "style"],
      },
    ],
  },
  {
    id: "theme",
    name: "@swim/theme",
    path: "swim-ui-js/@swim/theme",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "color", "style"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "mapping", "structure", "math", "time", "color", "style", "theme"],
      },
    ],
  },
  {
    id: "view",
    name: "@swim/view",
    path: "swim-ui-js/@swim/view",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme"],
      },
    ],
  },
  {
    id: "dom",
    name: "@swim/dom",
    path: "swim-ui-js/@swim/dom",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view"],
      },
    ],
  },
  {
    id: "graphics",
    name: "@swim/graphics",
    path: "swim-ui-js/@swim/graphics",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view", "dom"],
      },
    ],
  },
  {
    id: "gesture",
    name: "@swim/gesture",
    path: "swim-ui-js/@swim/gesture",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view"],
      },
    ],
  },
  {
    id: "ui",
    name: "@swim/ui",
    path: "swim-ui-js/@swim/ui",
    title: "Swim UI",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture"],
      },
    ],
  },
];

const ux = [
  {
    id: "controls",
    name: "@swim/controls",
    path: "swim-ux-js/@swim/controls",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture"],
      },
    ],
  },
  {
    id: "displays",
    name: "@swim/displays",
    path: "swim-ux-js/@swim/displays",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture", "controls"],
      },
    ],
  },
  {
    id: "surfaces",
    name: "@swim/surfaces",
    path: "swim-ux-js/@swim/surfaces",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture", "controls"],
      },
    ],
  },
  {
    id: "navigation",
    name: "@swim/navigation",
    path: "swim-ux-js/@swim/navigation",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture", "controls"],
      },
    ],
  },
  {
    id: "ux",
    name: "@swim/ux",
    path: "swim-ux-js/@swim/ux",
    title: "Swim UX",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["controls", "displays", "surfaces", "navigation"],
      },
    ],
  },
];

const mvc = [
  {
    id: "model",
    name: "@swim/model",
    path: "swim-mvc-js/@swim/model",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
      },
    ],
  },
  {
    id: "component",
    name: "@swim/component",
    path: "swim-mvc-js/@swim/component",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "math", "time", "warp", "client", "constraint", "animation", "color", "style", "theme", "view", "dom", "model"],
      },
    ],
  },
  {
    id: "mvc",
    name: "@swim/mvc",
    path: "swim-mvc-js/@swim/mvc",
    title: "Swim MVC",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["model", "component"],
      },
    ],
  },
];

const vis = [
  {
    id: "gauge",
    name: "@swim/gauge",
    path: "swim-vis-js/@swim/gauge",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "math", "time", "warp", "client", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "model", "component"],
      },
    ],
  },
  {
    id: "pie",
    name: "@swim/pie",
    path: "swim-vis-js/@swim/pie",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "math", "time", "warp", "client", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "model", "component"],
      },
    ],
  },
  {
    id: "chart",
    name: "@swim/chart",
    path: "swim-vis-js/@swim/chart",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "math", "time", "warp", "client", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture", "model", "component"],
      },
    ],
  },
  {
    id: "vis",
    name: "@swim/vis",
    path: "swim-vis-js/@swim/vis",
    title: "Swim Vis",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["gauge", "pie", "chart"],
      },
    ],
  },
];

const maps = [
  {
    id: "map",
    name: "@swim/map",
    path: "swim-maps-js/@swim/map",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "geo", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics"],
      },
    ],
  },
  {
    id: "mapbox",
    name: "@swim/mapbox",
    path: "swim-maps-js/@swim/mapbox",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "geo", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "map"],
      },
    ],
  },
  {
    id: "googlemap",
    name: "@swim/googlemap",
    path: "swim-maps-js/@swim/googlemap",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "geo", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "map"],
      },
    ],
  },
  {
    id: "esrimap",
    name: "@swim/esrimap",
    path: "swim-maps-js/@swim/esrimap",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "mapping", "structure", "math", "geo", "time", "constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "map"],
      },
    ],
  },
  {
    id: "maps",
    name: "@swim/maps",
    path: "swim-maps-js/@swim/maps",
    title: "Swim Maps",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["map", "mapbox", "googlemap", "esrimap"],
      },
    ],
  },
];

const toolkit = [
  {
    id: "toolkit",
    name: "@swim/toolkit",
    title: "Swim Toolkit",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["ui", "ux", "mvc", "vis", "maps"],
        peerDeps: ["system"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: core.concat(mesh).concat(system).concat(ui).concat(ux).concat(mvc).concat(vis).concat(maps).concat(toolkit),
  gaID: "UA-79441805-2",
};
