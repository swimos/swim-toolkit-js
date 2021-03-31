# @swim/component

[![package](https://img.shields.io/npm/v/@swim/component.svg)](https://www.npmjs.com/package/@swim/component)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_component.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/component** provides componentized controller layer with application
lifecycle and service management.  **@swim/component** is part of the
[**@swim/mvc**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-mvc-js/@swim/mvc) framework.

## Installation

### npm

For an npm-managed project, `npm install @swim/component` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/component/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/component/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/component/dist/main/swim-component.js`.

### Browser

Browser applications can load `swim-mvc.js`—which bundles the **@swim/component**
library—along with its `swim-core.js`, `swim-mesh.js`, and `swim-ui.js`
dependencies, directly from the SwimOS CDN.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-core.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-mesh.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-mvc.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-core.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-mesh.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.min.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-mvc.min.js"></script>
```

Alternatively, the `swim-toolkit.js` script may be loaded, along with its
`swim-system.js` dependency, from the SwimOS CDN.  The `swim-toolkit.js`
script bundles **@swim/component** together with all other
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

**@swim/component** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as component from "@swim/component";
```

### CommonJS/Node.js

**@swim/component** can also be used as a CommonJS module in Node.js applications.

```javascript
var component = require("@swim/component");
```

### Browser

When loaded by a web browser, the `swim-mvc.js` script adds all
**@swim/component** library exports to the global `swim` namespace.
The `swim-mvc.js` script requires that `swim-core.js`, `swim-mesh.js`,
and `swim-ui.js` have already been loaded.

The `swim-toolkit.js` script also adds all **@swim/component** library
exports to the global `swim` namespace, making it a drop-in replacement for
`swim-ui.js` and `swim-component.js` when additional **@swim/toolkit** frameworks
are needed.
