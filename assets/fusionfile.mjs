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
  module
} from '@windwalker-io/fusion';
import { babelBasicOptions } from '@windwalker-io/fusion/src/utilities/babel.js';

export async function main() {
  // Watch start
  fusion.watch('src/unicorn/**/*.js');
  // Watch end

  // Compile Start
  // rollup('./src/unicorn/unicorn.js', './dist/', {
  //   override: (options) => {
  //     options.output.name = 'Unicorn';
  //     options.output.format = 'umd';
  //   }
  // });
  // rollup('./src/unicorn/ui/validation-components.js', './dist/ui/', {
  //   override: (options) => {
  //     options.output.name = 'UVC';
  //     options.output.format = 'umd';
  //   }
  // });
  // rollup('./src/unicorn/ui/list-dependent.js', './dist/ui/', {
  //   override: (options) => {
  //     options.output.name = 'ListDependent';
  //     options.output.format = 'umd';
  //   }
  // });

  webpack('./src/unicorn/unicorn.js', './dist/', {
    override: (options) => {
      options.output.library = 'Unicorn';
      options.output.libraryTarget = 'umd';
    }
  });
  // Compile end
}

export async function js() {
  // Watch start
  fusion.watch('src/js/**/*.js');
  // Watch end

  // Compile Start
  babel('src/js/**/*.js', 'dist/');
  // Compile end
}

export async function modules() {
  // Watch start
  fusion.watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );
  // Watch end

  // Compile Start
  webpack('./src/modules/ui/ui-bootstrap5.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'system';
    }
  });
  webpack('./src/modules/ui/validation-components.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
  webpack('./src/modules/ui/list-dependent.js', './dist/ui/', {
    override: (options) => {
      options.output.library = 'ListDependent';
      options.output.libraryTarget = 'umd';
    }
  });
  webpack('./src/modules/field/single-image-drag.js', './dist/field/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
  webpack('./src/modules/field/file-drag.js', './dist/field/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
  webpack('./src/modules/ui/iframe-modal.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
  // Compile end
}

export async function css() {
  // Watch start
  fusion.watch('scss/**/*.scss');
  // Watch end

  // Compile Start
  sass('scss/switcher.scss', 'dist/', { minify: 'separate_file' });
  sass('scss/editor.scss', 'dist/', { minify: 'separate_file' });
  sass('scss/field/single-image-drag.scss', 'dist/field/', { minify: 'separate_file' });
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
