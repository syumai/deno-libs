import { stringsReader } from 'https://deno.land/x/net/util.ts';
import { open, copy, env, cwd } from 'deno';

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
  console.log(depth);

  let denoHome = '.deno';
  for (let i = 0; i < depth; i++) {
    denoHome = '../' + denoHome;
  }

  const file = await open(`${CWD}/tsconfig.json`, 'w+');

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
  copy(file, config);

  console.log('tsconfig.json successfully generated!');
  console.log('Please run command below:');
  console.log('$ deno --types > ~/.deno/deno.d.ts');
}

main();
