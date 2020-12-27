import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const script = "swim-component";
const namespace = "swim";

const main = {
  input: "./lib/main/index.js",
  output: {
    file: `./dist/main/${script}.js`,
    name: namespace,
    format: "umd",
    globals: {
      "@swim/util": "swim",
      "@swim/codec": "swim",
      "@swim/collections": "swim",
      "@swim/interpolate": "swim",
      "@swim/structure": "swim",
      "@swim/streamlet": "swim",
      "@swim/dataflow": "swim",
      "@swim/recon": "swim",
      "@swim/uri": "swim",
      "@swim/math": "swim",
      "@swim/time": "swim",
      "@swim/scale": "swim",
      "@swim/warp": "swim",
      "@swim/client": "swim",
      "@swim/constraint": "swim",
      "@swim/tween": "swim",
      "@swim/color": "swim",
      "@swim/style": "swim",
      "@swim/theme": "swim",
      "@swim/view": "swim",
      "@swim/dom": "swim",
      "@swim/model": "swim",
    },
    sourcemap: true,
    interop: false,
    extend: true,
  },
  external: [
    "@swim/util",
    "@swim/codec",
    "@swim/collections",
    "@swim/interpolate",
    "@swim/structure",
    "@swim/streamlet",
    "@swim/dataflow",
    "@swim/recon",
    "@swim/uri",
    "@swim/math",
    "@swim/time",
    "@swim/scale",
    "@swim/warp",
    "@swim/client",
    "@swim/constraint",
    "@swim/tween",
    "@swim/color",
    "@swim/style",
    "@swim/theme",
    "@swim/view",
    "@swim/dom",
    "@swim/model",
  ],
  plugins: [
    nodeResolve({moduleDirectories: ["../..", "node_modules"]}),
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
