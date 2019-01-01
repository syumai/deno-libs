export interface Shebang {
  path: string;
  args: Array<string>;
}

class ShebangImpl implements Shebang {
  public readonly path: string;
  public readonly args: Array<string>;
  constructor(shebang: string) {
    const line = shebang.split('\n')[0];
    const parts = line.split(' ');
    const pathBase = parts.shift();
    if (pathBase.startsWith('#!')) {
      throw new Error('failed to parse shebang');
    }
    this.path = pathBase.slice(2);
    this.args = [...parts];
  }

  toString(): string {
    return [`#!${this.path}`, ...this.args].join(' ');
  }
}

export function parse(shebang: string): Shebang {
  return new ShebangImpl(shebang);
}
