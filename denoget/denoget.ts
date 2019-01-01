#!/usr/bin/env deno --allow-write --allow-env --allow-net --allow-run

import {
  args,
  env,
  readDirSync,
  mkdirSync,
  writeFileSync,
  exit,
  stdin,
  run,
} from 'deno';
import * as path from 'https://deno.land/x/path/index.ts';
import { parse } from './shebang.ts';

enum Permission {
  Unknown,
  Write,
  Net,
  Env,
  Run,
}

function getPermissionFromFlag(flag: string): Permission {
  switch (flag) {
    case '--allow-write':
      return Permission.Write;
    case '--allow-net':
      return Permission.Net;
    case '--allow-env':
      return Permission.Env;
    case '--allow-run':
      return Permission.Run;
  }
  return Permission.Unknown;
}

function getFlagFromPermission(perm: Permission): string {
  switch (perm) {
    case Permission.Write:
      return '--allow-write';
    case Permission.Net:
      return '--allow-net';
    case Permission.Env:
      return '--allow-env';
    case Permission.Run:
      return '--allow-run';
  }
  return '';
}

async function readCharacter(): Promise<string> {
  const byteArray = new Uint8Array(1);
  await stdin.read(byteArray);
  const dec = new TextDecoder();
  return dec.decode(byteArray);
}

async function grantPermission(perm: Permission): Promise<boolean> {
  let msg = 'Deno requests ';
  switch (perm) {
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
    default:
      return false;
  }
  msg += 'Grant permanently? [yN]';
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

  if (args.length < 2) {
    throw new Error('module path is not provided.');
  }

  const modulePath = args[args.length - 1];
  const moduleName = path.basename(modulePath, '.ts');
  const enc = new TextEncoder();

  const res = await fetch(modulePath);
  const moduleText = await res.text();

  createDirIfNotExists(DENOGET_HOME);
  createDirIfNotExists(DENOGET_SRC);
  createDirIfNotExists(DENOGET_BIN);
  const SRC_FILE_PATH = `${DENOGET_SRC}/${moduleName}.ts`;
  const BIN_FILE_PATH = `${DENOGET_BIN}/${moduleName}`;
  writeFileSync(SRC_FILE_PATH, enc.encode(`import '${modulePath}';`), 0o600);

  const shebang = parse(moduleText.split('\n')[0]);

  const grantedPermissions: Array<Permission> = [];
  for (const flag of shebang.args) {
    const permission = getPermissionFromFlag(flag);
    if (permission === Permission.Unknown) {
      continue;
    }
    if (!(await grantPermission(permission))) {
      continue;
    }
    grantedPermissions.push(permission);
  }
  const commands = [
    'deno',
    SRC_FILE_PATH,
    ...grantedPermissions.map(getFlagFromPermission),
  ];

  writeFileSync(BIN_FILE_PATH, enc.encode(commands.join(' ')));

  const makeExecutable = run({ args: ['chmod', '+x', BIN_FILE_PATH] });
  await makeExecutable.status();
  makeExecutable.close();
}

try {
  main();
} catch (e) {
  console.log(e);
  exit(1);
}
