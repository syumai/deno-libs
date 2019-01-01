# denoget

- denoget installs executable deno script.

## Features

- Install executable script into ~/.deno/denoget/bin

## Requirements for installing

- deno
- wget

## Install

```sh
# Install denoget
deno https://denopkg.com/syumai/deno-libs/denoget/denoget.ts \
  --allow-write --allow-env --allow-net --allow-run \
  https://denopkg.com/syumai/deno-libs/denoget/denoget.ts

# export denoget executable script path
echo 'export PATH="$HOME/.deno/denoget/bin:$PATH"' >> ~/.bashrc # change this to your shell
```

## Usage

```sh
denoget https://denopkg.com/syumai/deno-libs/denoinit/denoinit.ts
denoinit # now you can execute deno script!
```

## Create Executable Script

- Add shebang to top of your deno script.

```sh
#!/usr/bin/env deno --allow-write --allow-env --allow-run
```

- Add execute permission to script.

```sh
$ chmod +x xxx.ts
```

- Install script using denoget.
