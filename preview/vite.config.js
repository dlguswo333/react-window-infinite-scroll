import {defineConfig} from 'vite';
import viteReact from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/react-window-infinite-loader',
  build: {
    target: 'es6',
    outDir: 'dist',
    sourcemap: true,
    minify: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [tsconfigPaths(), viteReact()],
})
