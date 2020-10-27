# @swim/ui

[![package](https://img.shields.io/npm/v/@swim/ui.svg)](https://www.npmjs.com/package/@swim/ui)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_ui.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/ui** implements a user interface toolkit for pervasively real-time
applications.  A unified view hierarchy, with builtin procedural styling and
animation, makes it easy for **@swim/ui** components to uniformly style, animate,
and render mixed HTML, SVG, Canvas, and WebGL components.  **@swim/ui** is a
part of the [**@swim/toolkit**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/@swim/toolkit) framework.

## Framework

The **@swim/ui** umbrella package depends on, and re-exports, the following
component libraries:

- [**@swim/angle**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/angle)
  ([npm](https://www.npmjs.com/package/@swim/angle),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_angle.html)) –
  dimensional angle types with unit-aware algebraic operators, conversions,
  and parsers.
- [**@swim/length**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/length)
  ([npm](https://www.npmjs.com/package/@swim/length),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_length.html)) –
  DOM-relative length types with unit-aware algebraic operators, conversions,
  and parsers.
- [**@swim/color**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/color)
  ([npm](https://www.npmjs.com/package/@swim/color),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_color.html)) –
  RGB and HSL color types with color-space-aware operators, conversions,
  and parsers.
- [**@swim/font**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/font)
  ([npm](https://www.npmjs.com/package/@swim/font),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_font.html)) –
  CSS font property types and parsers.
- [**@swim/shadow**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/shadow)
  ([npm](https://www.npmjs.com/package/@swim/shadow),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_shadow.html)) –
  CSS box shadow types and parsers.
- [**@swim/gradient**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/gradient)
  ([npm](https://www.npmjs.com/package/@swim/gradient),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_gradient.html)) –
  CSS gradient types and parsers.
- [**@swim/transform**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/transform)
  ([npm](https://www.npmjs.com/package/@swim/transform),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_transform.html)) –
  CSS and SVG compatible transform types with unit-aware algebraic operators
  and parsers.
- [**@swim/scale**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/scale)
  ([npm](https://www.npmjs.com/package/@swim/scale),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_scale.html)) –
  scale types that map numeric and temporal input domains to interpolated
  output ranges, with support for continuous domain clamping, domain solving,
  range unscaling, and interpolation between scales.
- [**@swim/transition**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/transition)
  ([npm](https://www.npmjs.com/package/@swim/transition),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_transition.html)) –
  transition types that specify duration, ease, interpolator, and lifecycle
  callback parameters for tween animations.
- [**@swim/style**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/style)
  ([npm](https://www.npmjs.com/package/@swim/style),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_style.html)) –
  CSS style types and universal style value parser.
- [**@swim/animate**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/animate)
  ([npm](https://www.npmjs.com/package/@swim/animate),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_animate.html)) –
  property-managing animator types that efficiently tween values between
  discrete state changes.
- [**@swim/render**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/render)
  ([npm](https://www.npmjs.com/package/@swim/render),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_render.html)) –
  renderable graphic types for SVG and Canvas compatible path drawing contexts,
  and Canvas compatible rendering contexts.
- [**@swim/constraint**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/constraint)
  ([npm](https://www.npmjs.com/package/@swim/constraint),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_constraint.html)) –
  incremental solver for systems of linear layout constraints.
- [**@swim/view**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/view)
  ([npm](https://www.npmjs.com/package/@swim/view),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_view.html)) –
  unified HTML, SVG, and Canvas view hierarchy, with integrated controller
  architecture, animated procedural styling, and constraint-based layouts.
- [**@swim/dom**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/dom)
  ([npm](https://www.npmjs.com/package/@swim/dom),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_dom.html)) –
  HTML and SVG views, with procedural attribute and style animators.
- [**@swim/graphics**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/graphics)
  ([npm](https://www.npmjs.com/package/@swim/graphics),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_graphics.html)) –
  canvas graphics views, with procedurally animated shapes, and procedurally
  styled typesetters.
- [**@swim/gesture**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/gesture)
  ([npm](https://www.npmjs.com/package/@swim/gesture),
  [doc](https://docs.swimos.org/js/latest/modules/_swim_gesture.html)) –
  multitouch gesture recognizers, with kinematic surface modeling.

**@swim/ui** builds on the [**@swim/core**](https://github.com/swimos/swim/tree/master/swim-system-js/swim-core-js/@swim/core)
framework; it has no additional dependencies.

## Installation

### npm

For an npm-managed project, `npm install @swim/ui` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/ui/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/ui/lib/main`.  And a pre-built UMD script, which
bundles all **@swim/ui** component libraries, can be found in
`node_modules/@swim/ui/dist/main/swim-ui.js`.

### Browser

Browser applications can load `swim-ui.js`, along with its `swim-core.js`
dependency, from the SwimOS CDN.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-core.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-core.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.min.js"></script>
```

Alternatively, the `swim-toolkit.js` script may be loaded, along with its
`swim-system.js` dependency, from the SwimOS CDN.  The `swim-toolkit.js`
script bundles **@swim/ui** together with all other
[**@swim/toolkit**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/@swim/toolkit)
frameworks.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-system.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-toolkit.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-system.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-toolkit.min.js"></script>
```

## Usage

### ES6/TypeScript

**@swim/ui** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.  All component libraries are re-exported by
the umbrella `@swim/ui` module.

```typescript
import * as swim from "@swim/ui";
```

### CommonJS

**@swim/ui** can also be used with CommonJS-compatible module systems.
All component libraries are re-exported by the umbrella `@swim/ui` module.

```javascript
var swim = require("@swim/ui");
```

### Browser

When loaded by a web browser, the `swim-ui.js` script adds all component
library exports to the global `swim` namespace.  The `swim-ui.js` script
requires that `swim-core.js` has already been loaded.

The `swim-toolkit.js` script also adds all **@swim/ui** component library
exports to the global `swim` namespace, making it a drop-in replacement
for `swim-ui.js` when additional **@swim/toolkit** frameworks are needed.
