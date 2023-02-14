import chokidar from 'chokidar';

import exec from './utils/exec';
import {resolveProject, resolveRustWasm, resolveSrc} from './utils/path';

function generateManifest() {
    return exec('npx ts-node ./server/generateManifest.ts').promise.catch(() => {
        // ignore, mainly is ts compile error
    });
}

function generateWasm() {
    return exec('npx ts-node ./server/generateWasm.ts').promise.catch(() => {
        // ignore, mainly is ts compile error
    });
}

// run once when start
generateWasm();
generateManifest();
chokidar.watch([resolveSrc('manifest.ts'), resolveProject('package.json'), resolveRustWasm()]).on('change', () => {
    generateWasm();
    generateManifest();
});
