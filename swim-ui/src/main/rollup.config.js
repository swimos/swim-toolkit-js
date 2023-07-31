import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import terser from "@rollup/plugin-terser";
import * as pkg from "../../package.json";

const script = "swim-ui";

const core = [
  "@swim/util",
  "@swim/codec",
  "@swim/component",
  "@swim/collections",
  "@swim/constraint",
  "@swim/structure",
  "@swim/recon",
  "@swim/uri",
  "@swim/math",
  "@swim/time",
  "@swim/core",
];

const host = [
  "@swim/warp",
  "@swim/client",
  "@swim/host",
];

const external = core.concat(host);

const globals = Object.fromEntries(external.map(name => [name, "swim"]));

const paths = Object.fromEntries(core.map(name => [name, "@swim/core"])
                         .concat(host.map(name => [name, "@swim/host"])));

const beautify = terser({
  compress: false,
  mangle: false,
  output: {
    preamble: `// ${pkg.name} v${pkg.version} (c) ${pkg.copyright}`,
    beautify: true,
    comments: false,
    indent_level: 2,
  },
});

const minify = terser({
  output: {
    preamble: `// ${pkg.name} v${pkg.version} (c) ${pkg.copyright}`,
    comments: false,
  },
});

export default [
  {
    input: "../../lib/main/index.js",
    output: {
      file: `../../dist/${script}.mjs`,
      format: "esm",
      paths: paths,
      generatedCode: {
        preset: "es2015",
        constBindings: true,
      },
      sourcemap: true,
      plugins: [beautify],
    },
    external: external.concat("tslib"),
    plugins: [
      nodeResolve(),
      sourcemaps(),
    ],
    onwarn(warning, warn) {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
  },
  {
    input: "../../lib/main/index.js",
    output: [
      {
        file: `../../dist/${script}.js`,
        name: "swim",
        format: "umd",
        globals: globals,
        paths: paths,
        generatedCode: {
          preset: "es2015",
          constBindings: true,
        },
        sourcemap: true,
        interop: "esModule",
        extend: true,
        plugins: [beautify],
      },
      {
        file: `../../dist/${script}.min.js`,
        name: "swim",
        format: "umd",
        globals: globals,
        paths: paths,
        generatedCode: {
          preset: "es2015",
          constBindings: true,
        },
        sourcemap: true,
        interop: "esModule",
        extend: true,
        plugins: [minify],
      },
    ],
    external: external,
    plugins: [
      nodeResolve(),
      sourcemaps(),
    ],
    onwarn(warning, warn) {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
  },
];
