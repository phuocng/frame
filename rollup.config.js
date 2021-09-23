import path from 'path';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const pkg = require(path.join(rootPackagePath, 'package.json'));

const outputDir = path.join(rootPackagePath, 'lib');

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const plugins = [typescript()];

export default [
    // CJS
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, 'cjs/index.js'),
            format: 'cjs',
        },
        external,
        plugins,
    },

    // Minified CJS
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, 'cjs/index.min.js'),
            format: 'cjs',
        },
        external,
        plugins: plugins.concat([terser()]),
    },
];
