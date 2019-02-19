#!/usr/bin/env deno

const { cwd, open, copy, stdout, args } = Deno;

const dirPath = cwd();
(async () => {
  for (let i = 1; i < args.length; i++) {
    await copy(stdout, await open(`${dirPath}/${args[i]}`));
  }
})();
