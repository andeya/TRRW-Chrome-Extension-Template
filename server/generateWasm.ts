import console from "consola";
import exec from "./utils/exec";

export default async function generateWasm() {
    console.info('updating rust wasm...');
    exec('wasm-pack build --out-dir ../src/wasm rust-wasm');
    exec('rm -rf ./src/wasm/.gitignore');
}

if (module === require.main) {
    generateWasm();
}
