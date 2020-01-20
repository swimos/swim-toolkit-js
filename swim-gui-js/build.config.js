const gui = [
  {
    id: "indicator",
    name: "@swim/indicator",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "widget",
    name: "@swim/widget",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "gui",
    name: "@swim/gui",
    title: "Swim Graphical User Interface Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["indicator", "widget"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: gui,
};
