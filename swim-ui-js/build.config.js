const ui = [
  {
    id: "constraint",
    name: "@swim/constraint",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["constraint"],
      },
    ],
  },
  {
    id: "animation",
    name: "@swim/animation",
    targets: [
      {
        id: "main",
        deps: [],
      },
      {
        id: "test",
        deps: ["animation"],
      },
    ],
  },
  {
    id: "color",
    name: "@swim/color",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["color"],
      },
    ],
  },
  {
    id: "style",
    name: "@swim/style",
    targets: [
      {
        id: "main",
        deps: ["color"],
      },
      {
        id: "test",
        deps: ["color", "style"],
      },
    ],
  },
  {
    id: "theme",
    name: "@swim/theme",
    targets: [
      {
        id: "main",
        deps: ["animation", "color", "style"],
      },
      {
        id: "test",
        deps: ["animation", "color", "style", "theme"],
      },
    ],
  },
  {
    id: "view",
    name: "@swim/view",
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme"],
      },
    ],
  },
  {
    id: "dom",
    name: "@swim/dom",
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view"],
      },
    ],
  },
  {
    id: "graphics",
    name: "@swim/graphics",
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view", "dom"],
      },
    ],
  },
  {
    id: "gesture",
    name: "@swim/gesture",
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view"],
      },
    ],
  },
  {
    id: "popover",
    name: "@swim/popover",
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view", "dom"],
      },
    ],
  },
  {
    id: "ui",
    name: "@swim/ui",
    title: "Swim UI",
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["constraint", "animation", "color", "style", "theme", "view", "dom", "graphics", "gesture", "popover"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ui,
};
