import { resolve, basename } from 'node:path';
import treeShakeable from 'rollup-plugin-tree-shakeable';
import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const src = resolve('./src').replace(/\\/g, '/');

  return {
    resolve: {
      alias: {
        // '@': resolve('./src'),
      }
    },
    build: {
      lib: {
        entry: 'src/unicorn.ts',
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
          chunkFileNames(chunkInfo) {
            // if (chunkInfo.facadeModuleId && chunkInfo.facadeModuleId.includes('/module/')) {
            //   const relPath = chunkInfo.facadeModuleId.replace(src + '/', '');
            //   const dir = relPath.split('/').slice(0, -1).join('/');
            //   const filename = basename(relPath, '.ts');
            //
            //   return `${dir}/${filename}.js`;
            // }

            return 'chunks/[name]-[hash].js';
          },
          // assetFileNames: 'assets/[name][extname]',
          // preserveModules: true,       // 保留模組結構
          // preserveModulesRoot: 'src/unicorn',
        },
        external: [
          'node:crypto',
          '@unicorn/*',
          'dayjs',
          'flatpickr',
          'bootstrap',
          'sortablejs',
          '@asika32764/vue-animate',
          'alpinejs',
          'cropperjs',
        ]
      },
      outDir: 'dist',
      emptyOutDir: true,
      minify: false,
    },
    plugins: [
      treeShakeable(),
      dtsPlugin({
        // entryRoot: './src/unicorn/unicorn.ts',
        insertTypesEntry: true,
        outDir: 'dist',
        tsconfigPath: resolve('./tsconfig.json'),
        rollupTypes: true
      })
    ]
  };
});

