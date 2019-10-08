// Author: syumai (https://github.com/syumai)

import escape from 'https://deno.land/x/lodash/escape.js';

export interface VNode {
  nodeName: string;
  attributes?: Attr;
  children: Array<Child>;
}

export type Attr = { [key: string]: string | number };

export type Child = VNode | string;

export interface Component<P = {}> {
  (attributes?: P): VNode;
}

export function h(
  nodeName: string | Component,
  attributes?: Attr,
  ...children: Child[]
): VNode {
  if (typeof nodeName === 'function') {
    return nodeName(attributes);
  }
  return {
    nodeName,
    attributes,
    children,
  };
}

export function renderHTML(v: VNode): string {
  const el = createElement(v);
  return el.outerHTML;
}

function createElement(v: VNode): HTMLElement {
  const el = document.createElement(v.nodeName);
  if (v.attributes) {
    setAttributes(el, v.attributes);
  }
  for (const child of v.children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
      continue;
    }
    el.appendChild(createElement(child));
  }
  return el;
}

function setAttributes(el: HTMLElement, attributes: Attr) {
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, typeof value === 'number' ? String(value) : value);
  }
}

// Dummy implementation of HTMLElement
class HTMLElement {
  nodeName: string;
  attrs: { [key: string]: string };
  children: Array<HTMLElement | string>;

  constructor(nodeName: string) {
    this.nodeName = nodeName;
    this.attrs = {};
    this.children = [];
  }

  setAttribute(key: string, value: string) {
    this.attrs[key] = value;
  }

  appendChild(child: HTMLElement | string) {
    this.children.push(child);
  }

  get outerHTML(): string {
    let html = '';
    html += `<${this.nodeName}`;
    for (const [key, value] of Object.entries(this.attrs)) {
      html += ` ${key}="${escape(value)}"`;
    }
    html += `>`;
    for (const child of this.children) {
      if (typeof child === 'string') {
        html += escape(child);
        continue;
      }
      html += child.outerHTML;
    }
    html += `</${this.nodeName}>`;
    return html;
  }
}

// Dummy implementation of document
const document = {
  createElement(nodeName: string): HTMLElement {
    return new HTMLElement(nodeName);
  },
  createTextNode(data: string): string {
    return data;
  },
};

declare global {
  namespace JSX {
    type Element = VNode;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
