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
    id: "interpolate",
    name: "@swim/interpolate",
    path: "../swim-system-js/swim-core-js/@swim/interpolate",
    targets: [
      {
        id: "main",
        deps: ["util"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate"],
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
        deps: ["util", "codec", "interpolate"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure"],
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
        deps: ["util", "codec", "interpolate", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "recon"],
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
        deps: ["util", "codec", "interpolate", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "uri"],
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
        deps: ["util", "codec", "interpolate", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "math"],
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
        deps: ["util", "codec", "interpolate", "structure", "math"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "math", "geo"],
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
        deps: ["util", "codec", "interpolate", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "time"],
      },
    ],
  },
  {
    id: "scale",
    name: "@swim/scale",
    path: "../swim-system-js/swim-core-js/@swim/scale",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "time"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "time", "scale"],
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
        deps: ["util", "codec", "collections", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "math", "geo", "time", "scale"],
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
        deps: ["util", "codec", "interpolate", "structure", "recon", "uri"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "recon", "uri", "warp"],
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
        deps: ["util", "codec", "collections", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "warp"],
      },
      {
        id: "test",
        deps: ["util", "codec", "collections", "unit", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
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
        deps: ["util", "codec", "args", "collections", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
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
    id: "tween",
    name: "@swim/tween",
    path: "swim-ui-js/@swim/tween",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "tween"],
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
        deps: ["util", "codec", "interpolate", "structure", "math"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "math", "color"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "color"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "math", "time", "color", "style"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "tween", "color", "style"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "interpolate", "structure", "math", "time", "tween", "color", "style", "theme"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "constraint", "tween", "color", "style", "theme"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "constraint", "tween", "color", "style", "theme", "view"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "constraint", "tween", "color", "style", "theme", "view", "dom"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view"],
      },
    ],
  },
  {
    id: "popover",
    name: "@swim/popover",
    path: "swim-ui-js/@swim/popover",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "constraint", "tween", "color", "style", "theme", "view", "dom"],
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
        deps: ["constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover"],
      },
    ],
  },
];

const ux = [
  {
    id: "button",
    name: "@swim/button",
    path: "swim-ux-js/@swim/button",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover"],
      },
    ],
  },
  {
    id: "token",
    name: "@swim/token",
    path: "swim-ux-js/@swim/token",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover", "button"],
      },
    ],
  },
  {
    id: "drawer",
    name: "@swim/drawer",
    path: "swim-ux-js/@swim/drawer",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover", "button"],
      },
    ],
  },
  {
    id: "menu",
    name: "@swim/menu",
    path: "swim-ux-js/@swim/menu",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover", "button"],
      },
    ],
  },
  {
    id: "tree",
    name: "@swim/tree",
    path: "swim-ux-js/@swim/tree",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover", "button"],
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
        deps: ["button", "token", "drawer", "menu", "tree"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics"],
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
        deps: ["util", "codec", "collections", "interpolate", "structure", "math", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "gesture"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "geo", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "geo", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "map"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "geo", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "map"],
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
        deps: ["util", "codec", "interpolate", "structure", "math", "geo", "time", "scale", "constraint", "tween", "color", "style", "theme", "view", "dom", "graphics", "map"],
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

const mvc = [
  {
    id: "model",
    name: "@swim/model",
    path: "swim-mvc-js/@swim/model",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
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
        deps: ["util", "codec", "collections", "interpolate", "structure", "streamlet", "dataflow", "recon", "uri", "math", "time", "scale", "warp", "client", "constraint", "tween", "color", "style", "theme", "view", "dom", "model"],
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

const toolkit = [
  {
    id: "toolkit",
    name: "@swim/toolkit",
    title: "Swim Toolkit",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["ui", "ux", "vis", "maps", "mvc"],
        peerDeps: ["system"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: core.concat(mesh).concat(system).concat(ui).concat(ux).concat(vis).concat(maps).concat(mvc).concat(toolkit),
  gaID: "UA-79441805-2",
};
