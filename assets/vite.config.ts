import treeShakeable from 'rollup-plugin-tree-shakeable';
import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': '/src',
      }
    },
    build: {
      lib: {
        entry: 'src/unicorn/unicorn.ts',
        name: 'unicorn',
        formats: ['es'],
      },
      rollupOptions: {
        // preserveEntrySignatures: 'strict',
        // input: {
        //   unicorn: 'src/unicorn/unicorn.ts',
        // },
        output: {
          format: 'es',
          entryFileNames: 'unicorn.js',
          // chunkFileNames: 'chunks/[name]-[hash].js',
          // assetFileNames: 'assets/[name]-[hash][extname]',
          // preserveModules: true,       // 保留模組結構
          // preserveModulesRoot: 'src/unicorn',
        },
        external: ['node:crypto']
      },
      outDir: 'dist',
      emptyOutDir: true,
      minify: false
    },
    plugins: [
      treeShakeable(),
      dtsPlugin({
        // entryRoot: './src/unicorn/unicorn.ts',
        insertTypesEntry: true,
        outDir: 'dist',
        tsconfigPath: resolve('./tsconfig.json'),
        // rollupTypes: true
      })
    ]
  };
});

