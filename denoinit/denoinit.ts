import { stringsReader } from 'https://deno.land/x/net/util.ts';
import { open, copy, env, cwd, run, writeFile } from 'deno';

async function main() {
  const { HOME } = env();
  if (!HOME) {
    console.log('$HOME is not defined.');
    return;
  }

  const CWD = cwd();
  if (!CWD.match(HOME)) {
    console.log('CWD is not in HOME.');
    return;
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
        'http://*': [`${denoHome}/deps/http/*`],
        'https://*': [`${denoHome}/deps/https/*`],
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

main();
