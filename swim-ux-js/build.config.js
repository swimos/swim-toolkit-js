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
      },
    ],
  },
  {
    id: "grid",
    name: "@swim/grid",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "surfaces",
    name: "@swim/surfaces",
    targets: [
      {
        id: "main",
        deps: ["button"],
      },
    ],
  },
  {
    id: "deck",
    name: "@swim/deck",
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
    framework: true,
    targets: [
      {
        id: "main",
        deps: ["button", "token", "grid", "surfaces", "deck"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
