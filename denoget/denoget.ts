#!/usr/bin/env deno --allow-all

import {
  args,
  env,
  readDirSync,
  mkdirSync,
  writeFileSync,
  exit,
  stdout,
  stdin,
  run,
} from 'deno';
import * as path from 'https://deno.land/x/fs/path/mod.ts';
import { parse } from './shebang.ts';

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8');

enum Permission {
  Unknown,
  Read,
  Write,
  Net,
  Env,
  Run,
  All,
}

function getPermissionFromFlag(flag: string): Permission {
  switch (flag) {
    case '--allow-read':
      return Permission.Read;
    case '--allow-write':
      return Permission.Write;
    case '--allow-net':
      return Permission.Net;
    case '--allow-env':
      return Permission.Env;
    case '--allow-run':
      return Permission.Run;
    case '--allow-all':
      return Permission.All;
    case '-A':
      return Permission.All;
  }
  return Permission.Unknown;
}

function getFlagFromPermission(perm: Permission): string {
  switch (perm) {
    case Permission.Read:
      return '--allow-read';
    case Permission.Write:
      return '--allow-write';
    case Permission.Net:
      return '--allow-net';
    case Permission.Env:
      return '--allow-env';
    case Permission.Run:
      return '--allow-run';
    case Permission.All:
      return '--allow-all';
  }
  return '';
}

async function readCharacter(): Promise<string> {
  const byteArray = new Uint8Array(1024);
  await stdin.read(byteArray);
  const dec = new TextDecoder();
  const line = dec.decode(byteArray);
  return line[0];
}

async function grantPermission(
  perm: Permission,
  moduleName: string = 'Deno'
): Promise<boolean> {
  let msg = `${moduleName} requests `;
  switch (perm) {
    case Permission.Read:
      msg += 'read access to file system. ';
      break;
    case Permission.Write:
      msg += 'write access to file system. ';
      break;
    case Permission.Net:
      msg += 'network access. ';
      break;
    case Permission.Env:
      msg += 'access to environment variable. ';
      break;
    case Permission.Run:
      msg += 'access to run a subprocess. ';
      break;
    case Permission.All:
      msg += 'all available access. ';
      break;
    default:
      return false;
  }
  msg += 'Grant permanently? [yN]';
  console.log(msg);

  const input = await readCharacter();
  if (input !== 'y' && input !== 'Y') {
    return false;
  }
  return true;
}

function createDirIfNotExists(path: string) {
  try {
    readDirSync(path);
  } catch (e) {
    mkdirSync(path);
  }
}

async function main() {
  const { HOME } = env();
  if (!HOME) {
    throw new Error('$HOME is not defined.');
  }
  const DENOGET_HOME = `${HOME}/.deno/denoget`;
  const DENOGET_SRC = `${DENOGET_HOME}/src`;
  const DENOGET_BIN = `${DENOGET_HOME}/bin`;

  const modulePath: string = args[args.length - 1];
  if (!modulePath.startsWith('http')) {
    throw new Error('module path is incorrect.');
  }
  const moduleName = path.basename(modulePath, '.ts');

  const wget = run({
    args: ['wget', '--quiet', '-O', '-', modulePath],
    stdout: 'piped',
  });
  const moduleText = dec.decode(await wget.output());
  const status = await wget.status();
  wget.close();
  if (status.code !== 0) {
    throw new Error(`Failed to get remote script: ${modulePath}`);
  }
  console.log('Completed loading remote script.');

  createDirIfNotExists(DENOGET_HOME);
  createDirIfNotExists(DENOGET_SRC);
  createDirIfNotExists(DENOGET_BIN);
  const SRC_FILE_PATH = `${DENOGET_SRC}/${moduleName}.ts`;
  const BIN_FILE_PATH = `${DENOGET_BIN}/${moduleName}`;
  writeFileSync(SRC_FILE_PATH, enc.encode(`import '${modulePath}';`), {
    perm: 0o600,
  });

  const shebang = parse(moduleText.split('\n')[0]);

  const grantedPermissions: Array<Permission> = [];
  for (const flag of shebang.args) {
    const permission = getPermissionFromFlag(flag);
    if (permission === Permission.Unknown) {
      continue;
    }
    if (!(await grantPermission(permission, moduleName))) {
      continue;
    }
    grantedPermissions.push(permission);
  }
  const commands = [
    'deno',
    SRC_FILE_PATH,
    ...grantedPermissions.map(getFlagFromPermission),
    '$@',
  ];

  writeFileSync(BIN_FILE_PATH, enc.encode(commands.join(' ')));

  const makeExecutable = run({ args: ['chmod', '+x', BIN_FILE_PATH] });
  await makeExecutable.status();
  makeExecutable.close();

  console.log(`Successfully installed ${moduleName}.`);
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
