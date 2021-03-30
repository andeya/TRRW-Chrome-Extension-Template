# React-TS-Chrome-Ext

Use React + TypeScript + Antd + Rust-Wasm to develop Chrome Extension.

## Install Tools

```shell
npm install npm@latest -g
npm install --global yarn
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
cargo install cargo-generate
```

## Build Package

- install

```sh
yarn install
```

- build

```sh
yarn build
```

The output directory is `./build/`.

## Popup Preview

![screenshot-popup](doc/screenshot-popup.png)
