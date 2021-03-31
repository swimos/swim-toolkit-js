import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const script = "swim-toolkit";
const namespace = "swim";

const main = {
  input: "./lib/main/index.js",
  output: {
    file: `./dist/main/${script}.js`,
    name: namespace,
    format: "umd",
    globals: {
      "mapbox-gl": "mapboxgl",
      "@swim/util": "swim",
      "@swim/codec": "swim",
      "@swim/mapping": "swim",
      "@swim/collections": "swim",
      "@swim/structure": "swim",
      "@swim/streamlet": "swim",
      "@swim/dataflow": "swim",
      "@swim/recon": "swim",
      "@swim/uri": "swim",
      "@swim/math": "swim",
      "@swim/geo": "swim",
      "@swim/time": "swim",
      "@swim/warp": "swim",
      "@swim/client": "swim",
    },
    sourcemap: true,
    interop: false,
    extend: true,
  },
  external: [
    "mapbox-gl",
    "@swim/util",
    "@swim/codec",
    "@swim/mapping",
    "@swim/collections",
    "@swim/structure",
    "@swim/streamlet",
    "@swim/dataflow",
    "@swim/recon",
    "@swim/uri",
    "@swim/math",
    "@swim/geo",
    "@swim/time",
    "@swim/warp",
    "@swim/client",
  ],
  plugins: [
    nodeResolve({moduleDirectories: ["../../swim-ui-js",
                                     "../../swim-ux-js",
                                     "../../swim-mvc-js",
                                     "../../swim-vis-js",
                                     "../../swim-maps-js",
                                     "node_modules"]}),
    sourcemaps(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};

const targets = [main];
targets.main = main;
export default targets;
