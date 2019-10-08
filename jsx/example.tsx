/* @jsx h */
import { h, renderHTML } from './renderer.ts';

const rootPath = 'https://syum.ai';
const link = 'syum.ai';

type RoutedLinkProps = {
  path: string;
  text: string;
};
const RoutedLink = (props: RoutedLinkProps) => (
  <a href={`${rootPath}/${props.path}`}>{props.text}</a>
);

const Body = () => (
  <body>
    <h1>TSX on Deno!</h1>
    <a href={rootPath} target="_blank">
      {link}
    </a>
    <RoutedLink path="image/random" text="randomized syumai" />
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
