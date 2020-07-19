const ux = [
  {
    id: "theme",
    name: "@swim/theme",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "motif",
    name: "@swim/motif",
    targets: [
      {
        id: "main",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "popover",
    name: "@swim/popover",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif"],
      },
    ],
  },
  {
    id: "drawer",
    name: "@swim/drawer",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif"],
      },
    ],
  },
  {
    id: "fab",
    name: "@swim/fab",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif"],
      },
    ],
  },
  {
    id: "menu",
    name: "@swim/menu",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif"],
      },
    ],
  },
  {
    id: "tree",
    name: "@swim/tree",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif"],
      },
    ],
  },
  {
    id: "ux",
    name: "@swim/ux",
    title: "Swim User Experience Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["theme", "motif", "popover", "drawer", "fab", "menu", "tree"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
