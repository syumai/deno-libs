#!/usr/bin/env deno --allow-write --allow-env --allow-run

import { stringsReader } from 'https://deno.land/x/io/util.ts';
import { open, copy, env, cwd, run, writeFile, exit } from 'deno';

async function main() {
  const { HOME } = env();
  if (!HOME) {
    throw new Error('$HOME is not defined.');
  }

  const CWD = cwd();
  if (!CWD.match(HOME)) {
    throw new Error('CWD is not in HOME.');
  }

  const depth = CWD.split('/').length - HOME.split('/').length;

  let denoHome = '.deno';
  for (let i = 0; i < depth; i++) {
    denoHome = '../' + denoHome;
  }

  const tsconfigFile = await open(`${CWD}/tsconfig.json`, 'w+');

  const tsconfig = {
    compilerOptions: {
      baseUrl: '.',
      paths: {
        deno: [`${denoHome}/deno.d.ts`],
        'https://*': [`${denoHome}/deps/https/*`],
        'http://*': [`${denoHome}/deps/http/*`],
      },
    },
  };

  const config = stringsReader(JSON.stringify(tsconfig, null, 2));
  copy(tsconfigFile, config);
  console.log('tsconfig.json successfully generated!');

  const types = run({ args: ['deno', '--types'], stdout: 'piped' });
  const out = await types.output();
  await writeFile(`${HOME}/.deno/deno.d.ts`, out);
  types.close();
  console.log('~/.deno/deno.d.ts successfully generated!');
}

try {
  main();
} catch (e) {
  const err = e as Error;
  if (err.message) {
    console.log(err.message);
    exit(1);
  }
  console.log(e);
  exit(1);
}
