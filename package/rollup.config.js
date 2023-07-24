import {defineConfig} from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'

export default defineConfig([
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    external: [/^react.*/, /^react-dom.*/],
    plugins: [
      typescript(),
      nodeResolve(),
      postcss({
        inject: true,
      })
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    external: [/^react.*/, /^react-dom.*/],
    plugins: [
      typescript(),
      nodeResolve(),
      postcss({
        inject: false,
        modules: true,
        extensions: ['.scss'],
      }),
    ],
  },
])
