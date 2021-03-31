# @swim/displays

[![package](https://img.shields.io/npm/v/@swim/displays.svg)](https://www.npmjs.com/package/@swim/displays)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_displays.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/displays** implements lists, trees, and other structured display views.
**@swim/displays** is part of the
[**@swim/ux**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ux-js/@swim/ux) framework.

## Installation

### npm

For an npm-managed project, `npm install @swim/displays` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/displays/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/displays/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/displays/dist/main/swim-displays.js`.

### Browser

Browser applications can load `swim-ux.js`—which bundles the **@swim/displays**
library—along with its `swim-core.js` and `swim-ui.js` dependencies, directly
from the SwimOS CDN.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-core.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ux.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-core.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ux.min.js"></script>
```

Alternatively, the `swim-toolkit.js` script may be loaded, along with its
`swim-system.js` dependency, from the SwimOS CDN.  The `swim-toolkit.js`
script bundles **@swim/displays** together with all other
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

**@swim/displays** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as displays from "@swim/displays";
```

### CommonJS/Node.js

**@swim/displays** can also be used as a CommonJS module in Node.js applications.

```javascript
var displays = require("@swim/displays");
```

### Browser

When loaded by a web browser, the `swim-displays.js` script adds all
**@swim/displays** library exports to the global `swim` namespace.
The `swim-displays.js` script requires that `swim-core.js` and `swim-ui.js`
have already been loaded.

The `swim-toolkit.js` script also adds all **@swim/displays** library
exports to the global `swim` namespace, making it a drop-in replacement for
`swim-ui.js` and `swim-displays.js` when additional **@swim/toolkit** frameworks
are needed.
