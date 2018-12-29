# denoinit

- denoinit initializes files for deno project.

## Features

- generate tsconfig.json for deno project.

## Usage

```
$ deno https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts --allow-write --allow-env
$ deno --types > ~/.deno/deno.d.ts
```

## Example output

`tsconfig.json`

* `../../../../.deno/deno.d.ts` => Path to deno home.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "deno": [
        "../../../../.deno/deno.d.ts"
      ],
      "http://*": [
        "../../../../.deno/deps/http/*"
      ],
      "https://*": [
        "../../../../.deno/deps/https/*"
      ]
    }
  }
}
```

