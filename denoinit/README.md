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
deno https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts --allow-write --allow-env --allow-run
```

### Install

- With [denoget](https://github.com/syumai/deno-libs/tree/master/denoget)

```sh
denoget https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts
denoinit
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
      "http://*": ["../../../../.deno/deps/http/*"],
      "https://*": ["../../../../.deno/deps/https/*"]
    }
  }
}
```
