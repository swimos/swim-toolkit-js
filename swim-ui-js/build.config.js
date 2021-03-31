const ui = [
  {
    id: "style",
    name: "@swim/style",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["style"],
      },
    ],
  },
  {
    id: "theme",
    name: "@swim/theme",
    targets: [
      {
        id: "main",
        deps: ["style"],
      },
      {
        id: "test",
        deps: ["style", "theme"],
      },
    ],
  },
  {
    id: "view",
    name: "@swim/view",
    targets: [
      {
        id: "main",
        deps: ["style", "theme"],
      },
    ],
  },
  {
    id: "dom",
    name: "@swim/dom",
    targets: [
      {
        id: "main",
        deps: ["style", "theme", "view"],
      },
    ],
  },
  {
    id: "graphics",
    name: "@swim/graphics",
    targets: [
      {
        id: "main",
        deps: ["style", "theme", "view", "dom"],
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
        deps: ["style", "theme", "view", "dom", "graphics"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ui,
};
