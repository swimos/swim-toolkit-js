const ux = [
  {
    id: "button",
    name: "@swim/button",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "token",
    name: "@swim/token",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "drawer",
    name: "@swim/drawer",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "menu",
    name: "@swim/menu",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "tree",
    name: "@swim/tree",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "ux",
    name: "@swim/ux",
    title: "Swim UX",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["button", "token", "drawer", "menu", "tree"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
