# denoget

- denoget installs executable deno script.

## Features

- Install executable deno script into ~/.deno/denoget/bin

## Install

```sh
$ deno https://denopkg.com/syumai/deno-libs/denoget/denoget.ts --allow-write https://denopkg.com/syumai/deno-libs/denoget/denoget.ts
$ echo 'export PATH="$HOME/.deno/denoget/bin:$PATH"' >> ~/.bashrc # change this to your shell
```

## Usage

```
$ denoget https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts
$ denoinit # now you can execute deno script!
```

## Create Executable Script

- Add shebang to top of your deno script.

```ts
#!/usr/bin/env deno --allow-write --allow-env --allow-r
```

- Add execute permission to script.

```sh
$ chmod +x xxx.ts
```

- Install script using denoget.
