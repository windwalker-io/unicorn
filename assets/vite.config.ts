import vuePlugin from '@vitejs/plugin-vue';
import { resolve, basename } from 'node:path';
import { rimraf } from 'rimraf';
import treeShakeable from 'rollup-plugin-tree-shakeable';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

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
          'tinymce',
          'bootstrap',
          'vue',
          'vue-draggable-plus',
          'vue-multi-uploader',
          'web-directive',
          'bigint-toolkit',
          'axios',
        ]
      },
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: mode === 'development' ? 'inline' : false,
      minify: false,
    },
    plugins: [
      treeShakeable(),
      vuePlugin({
        features: {
          prodDevtools: true,
        }
      }),
      dts({
        // entryRoot: './src/unicorn/unicorn.ts',
        insertTypesEntry: true,
        outDir: 'dist',
        tsconfigPath: resolve('./tsconfig.json'),
        bundleTypes: true,
        // rollupTypes: true
      }),
      {
        name: 'clear-files',
        generateBundle() {
          rimraf.sync('./dist/**/*.js', { glob: true });
          rimraf.sync('./dist/**/*.ts', { glob: true });
        }
      }
    ]
  };
});

