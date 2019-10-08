/* @jsx h */
import { h, renderHTML } from './renderer.ts';

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
