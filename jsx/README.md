# JSX Renderer

* minimum implementation of JSX to HTML renderer.

## Usage

### Example (example.tsx)

```tsx
/* @jsx h */
import { h, renderHTML } from 'https://denopkg.com/syumai/deno-libs/jsx/renderer.ts';

const href = 'https://syum.ai';
const link = 'syum.ai';

const Body = () => (
  <body>
    <h1>TSX on Deno!</h1>
    <a href={href} target="_blank">
      {link}
    </a>
  </body>
);

const html = (
  <html>
    <head>
      <title>Hello, world!</title>
    </head>
    <Body />
  </html>
);

console.log(renderHTML(html));
```

### Output

```html
<html><head><title>Hello, world!</title></head><body><h1>TSX on Deno!</h1><a href="https://syum.ai" target="_blank">syum.ai</a></body></html>
```

## Author

syumai