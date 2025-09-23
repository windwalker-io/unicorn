import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': '/src',
      }
    },
    build: {
      // lib: {
      //   entry: 'src/test.ts',
      //   name: 'test',
      //   formats: ['es'],
      //   // fileName: (format) => `test.es.js`
      // },
      rollupOptions: {
        input: {
          test: 'src/test.ts',
        },
        preserveEntrySignatures: 'strict',
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          // chunkFileNames: 'chunks/[name]-[hash].js',
          // assetFileNames: 'assets/[name]-[hash][extname]',
        },
        treeshake: true,
      },
      outDir: 'dist',
      emptyOutDir: false,
      minify: false,
    },
  };
});

