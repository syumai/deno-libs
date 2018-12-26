#!/usr/bin/env deno

import { cwd, open, copy, stdout, args } from 'deno';

const dirPath = cwd();
(async () => {
  for (let i = 1; i < args.length; i++) {
    await copy(stdout, await open(`${dirPath}/${args[i]}`));
  }
})();
