/**
 * Part of Windwalker Fusion project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

import fusion, {
  babel,
  webpack,
  rollup,
  sass,
  parallel,
  series,
  module,
  wait
} from '@windwalker-io/fusion';
import { babelBasicOptions } from '@windwalker-io/fusion/src/utilities/babel.js';
import * as moduleTasks from './src/fusion/modules.mjs';
export * from './src/fusion/modules.mjs';

export async function main() {
  // Watch start
  fusion.watch('src/unicorn/**/*.js');
  // Watch end

  return wait(
    webpack('./src/unicorn/unicorn.js', './dist/', {
      override: (options) => {
        options.output.library = 'Unicorn';
        options.output.libraryTarget = 'umd';
      }
    })
  );
  // Compile end
}

export async function js() {
  // Watch start
  fusion.watch(['src/js/**/*.js', 'src/systemjs/**/*.js']);
  // Watch end

  // Compile Start
  return wait(
    babel('src/js/**/*.js', 'dist/'),
    babel('src/systemjs/**/*.js', 'dist/', { module: 'systemjs' })
  );
  // Compile end
}

export const modules = parallel(
  ...Object.values(moduleTasks)
);

export async function css() {
  // Watch start
  fusion.watch('scss/**/*.scss');
  // Watch end

  // Compile Start
  return wait(
    sass('scss/switcher.scss', 'dist/', { minify: 'separate_file' }),
    sass('scss/editor.scss', 'dist/', { minify: 'separate_file' }),
    sass('scss/bootstrap/multi-level-menu.scss', 'dist/bootstrap/', { minify: 'separate_file' }),
    sass('scss/bootstrap/bs4-adapter.scss', 'dist/bootstrap/', { minify: 'separate_file' }),
    sass('scss/field/single-image-drag.scss', 'dist/field/', { minify: 'separate_file' }),
  );
  // Compile end
}

export async function vue() {
  // Watch start
  fusion.watch(['scss/**/*.scss', 'src/vue/**/*']);
  // Watch end

  // Compile Start
  return wait(
    fusion.vue('src/vue/entries/**/*.js', 'dist/vue/')
  );
  // Compile end
}

// export async function wc() {
//   // Watch start
//   fusion.watch([
//     'asset/ws/**/*.js'
//   ]);
//   // Watch end
//
//   // Compile Start
//   webpack('src/wc/**/*.js', 'dist/ui/', {
//     // override() {
//     //   return {
//     //     mode: process.env.NODE_ENV || 'development',
//     //     output: {
//     //       filename: '[name].js',
//     //       sourceMapFilename: '[name].js.map'
//     //     },
//     //     stats: {
//     //       all: false,
//     //       errors: true,
//     //       warnings: true,
//     //       version: false,
//     //     },
//     //     module: {
//     //       rules: [
//     //         {
//     //           test: /\.m?js$/,
//     //           // Fis LitElement issue, @see https://github.com/Polymer/lit-element/issues/54#issuecomment-439824447
//     //           exclude: /node_modules\/(?!(lit-html|@polymer)\/).*/,
//     //           use: [{
//     //             loader: 'babel-loader',
//     //             options: babelBasicOptions().get()
//     //           }, 'webpack-comment-remover-loader']
//     //         }
//     //       ]
//     //     },
//     //     plugins: []
//     //   };
//     // }
//   });
//   // Compile end
// }

export default parallel(
  main,
  js,
  css,
  modules,
  vue
);

/*
 * APIs
 *
 * Compile entry:
 * fusion.js(source, dest, options = {})
 * fusion.babel(source, dest, options = {})
 * fusion.module(source, dest, options = {})
 * fusion.ts(source, dest, options = {})
 * fusion.typeScript(source, dest, options = {})
 * fusion.css(source, dest, options = {})
 * fusion.sass(source, dest, options = {})
 * fusion.copy(source, dest, options = {})
 *
 * Live Reload:
 * fusion.livereload(source, dest, options = {})
 * fusion.reload(file)
 *
 * Gulp proxy:
 * fusion.src(source, options)
 * fusion.dest(path, options)
 * fusion.watch(glob, opt, fn)
 * fusion.symlink(directory, options = {})
 * fusion.lastRun(task, precision)
 * fusion.tree(options = {})
 * fusion.series(...tasks)
 * fusion.parallel(...tasks)
 *
 * Stream Helper:
 * fusion.through(handler) // Same as through2.obj()
 *
 * Config:
 * fusion.disableNotification()
 * fusion.enableNotification()
 */
