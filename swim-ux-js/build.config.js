const ux = [
  {
    id: "controls",
    name: "@swim/controls",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "displays",
    name: "@swim/displays",
    targets: [
      {
        id: "main",
        deps: ["controls"],
      },
    ],
  },
  {
    id: "surfaces",
    name: "@swim/surfaces",
    targets: [
      {
        id: "main",
        deps: ["controls"],
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
        deps: ["controls", "displays", "surfaces"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
