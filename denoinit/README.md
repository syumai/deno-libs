# denoinit

- denoinit generates useful files for deno project.

## Features

- Generate `~/.deno/deno.d.ts`
- Generate tsconfig.json

## Supported Environments

- macOS
- Linux

## Usage

```sh
cd ~/to/your/deno_project
deno --allow-write --allow-env --allow-run https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts
```

### Install

```sh
deno install denoinit https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts --allow-write --allow-env --allow-run
```

## Example output

`tsconfig.json`

- `../../../../.deno/deno.d.ts` => Path to deno home.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "deno": ["../../../../.deno/deno.d.ts"],
      "https://*": ["../../../../.deno/deps/https/*"],
      "http://*": ["../../../../.deno/deps/http/*"]
    }
  },
  "include": ["./**/*.ts", "./**/*.js"]
}
```
