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
    id: "app",
    name: "@swim/app",
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
        deps: ["theme", "motif", "app"],
      },
    ],
  },
  {
    id: "menu",
    name: "@swim/menu",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif", "app"],
      },
    ],
  },
  {
    id: "tree",
    name: "@swim/tree",
    targets: [
      {
        id: "main",
        deps: ["theme", "motif", "app"],
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
        deps: ["theme", "motif", "app", "fab", "menu", "tree"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
