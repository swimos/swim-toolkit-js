const gui = [
  {
    id: "shell",
    name: "@swim/shell",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "prism",
    name: "@swim/prism",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "prism-shell",
    name: "@swim/prism-shell",
    targets: [
      {
        id: "main",
        deps: ["shell", "prism"],
      },
    ],
  },
  {
    id: "agent-domain",
    name: "@swim/agent-domain",
    targets: [
      {
        id: "main",
        deps: ["shell"],
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
        deps: ["shell", "prism", "prism-shell", "agent-domain"],
      },
    ],
  },
];

export default {
  version: "3.10.1",
  projects: gui,
};
