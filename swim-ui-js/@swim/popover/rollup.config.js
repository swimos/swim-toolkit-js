import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const script = "swim-popover";
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
      "@swim/interpolate": "swim",
      "@swim/structure": "swim",
      "@swim/math": "swim",
      "@swim/time": "swim",
      "@swim/constraint": "swim",
      "@swim/tween": "swim",
      "@swim/color": "swim",
      "@swim/style": "swim",
      "@swim/theme": "swim",
      "@swim/view": "swim",
      "@swim/dom": "swim",
    },
    sourcemap: true,
    interop: false,
    extend: true,
  },
  external: [
    "@swim/util",
    "@swim/codec",
    "@swim/interpolate",
    "@swim/structure",
    "@swim/math",
    "@swim/time",
    "@swim/constraint",
    "@swim/tween",
    "@swim/color",
    "@swim/style",
    "@swim/theme",
    "@swim/view",
    "@swim/dom",
  ],
  plugins: [
    nodeResolve({customResolveOptions: {paths: "../.."}}),
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
