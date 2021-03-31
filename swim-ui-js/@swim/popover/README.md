# @swim/popover

[![package](https://img.shields.io/npm/v/@swim/popover.svg)](https://www.npmjs.com/package/@swim/popover)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_popover.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/popover** implements auto-placed, source-tracking popover views.
**@swim/popover** is part of the
[**@swim/ui**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/ui) framework.

## Installation

### npm

For an npm-managed project, `npm install @swim/popover` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/popover/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/popover/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/popover/dist/main/swim-popover.js`.

### Browser

Browser applications can load `swim-ui.js`—which bundles the **@swim/popover**
library—along with its `swim-core.js` dependency, directly from the SwimOS CDN.

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
script bundles **@swim/popover** together with all other
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

**@swim/popover** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as popover from "@swim/popover";
```

### CommonJS/Node.js

**@swim/popover** can also be used as a CommonJS module in Node.js applications.

```javascript
var popover = require("@swim/popover");
```

### Browser

When loaded by a web browser, the `swim-ui.js` script adds all
**@swim/popover** library exports to the global `swim` namespace.  The
`swim-ui.js` script requires that `swim-core.js` has already been loaded.

The `swim-toolkit.js` script also adds all **@swim/popover** library
exports to the global `swim` namespace, making it a drop-in replacement for
`swim-ui.js` and `swim-popover.js` when additional **@swim/toolkit** frameworks
are needed.
