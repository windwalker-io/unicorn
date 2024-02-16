import fusion, { webpack, watch, wait, webpackBundle } from '@windwalker-io/fusion';
import dtsBundle from 'bundle-declarations-webpack-plugin';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export async function main() {
  return webpackBundle(
    './src/unicorn/unicorn.ts',
    './dist/unicorn.js',
    (options) => {
      options.output.library = 'Unicorn';
      options.output.libraryTarget = 'umd';
      options.output.clean = false;

      options.resolve.alias = options.resolve.alias || {};
      options.resolve.alias['@'] = path.resolve('./src');

      options.module.rules[2].options.configFile = path.resolve('tsconfig.json');
      options.module.rules[2].options.transpileOnly = true;

      outputDeclaration(options, '../types/unicorn.d.ts');

      // console.log(options.module.rules[2].options.transpileOnly);
    }
  );
  // Compile end
}

export async function uiBootstrap5() {
  return webpackBundle(
    './src/modules/ui/ui-bootstrap5.ts',
    './dist/ui/ui-bootstrap5.js',
    (options) => {
      options.output.libraryTarget = 'umd';
      options.output.library = 'UIBootstrap5';
      options.output.clean = false;

      options.resolve.alias = options.resolve.alias || {};
      options.resolve.alias['@'] = path.resolve('./src');
    }
  );
}

export async function validation() {
  return webpackBundle(
    './src/modules/ui/validation-components.ts',
    './dist/ui/validation-components.js',
    (options) => {
      // options.output.library = 'Unicorn';
      options.output.libraryTarget = 'umd';
      options.output.library = 'UnicornValidation';
      options.output.clean = false;

      options.resolve.alias = options.resolve.alias || {};
      options.resolve.alias['@'] = path.resolve('./src');

      outputDeclaration(options, '../../types/validation.d.ts');
    }
  );
}

export async function flatpickr() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/ui/flatpickr-components.js', './dist/ui/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function listDependent() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/ui/list-dependent.js', './dist/ui/', {
      override: (options) => {
        options.output.library = 'ListDependent';
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function cascadeSelect() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/cascade-select.js', './dist/field/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function sid() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/single-image-drag.js', './dist/field/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function fileDrag() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/file-drag.js', './dist/field/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function iframeModal() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/ui/iframe-modal.js', './dist/ui/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function modalField() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/modal-field.js', './dist/field/', {
      override: (options) => {
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

export async function multiUploader() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss', 'src/vue/components/vue-drag-uploader/*']
  );

  return wait(
    fusion.vue('./src/modules/field/multi-uploader.js', './dist/field/', {
      override: (options) => {
        options.resolve.alias['vue$'] = 'vue/dist/vue.esm-bundler.js';

        options.externals = {
          vue: 'Vue'
        };

        // options.plugins.push(
        //   new BundleAnalyzerPlugin()
        // );
      }
    })
  );
}

export async function modalTree() {
  watch(
    ['src/modules/**/*.js', 'src/vue/components/modal-tree/**/*', 'scss/**/*.scss']
  );

  return wait(
    fusion.vue('./src/modules/field/modal-tree.js', './dist/field/', {
      override: (options) => {
        options.resolve.alias['vue$'] = 'vue/dist/vue.esm-bundler.js';

        options.externals = {
          vue: 'Vue'
        };

        // options.plugins.push(
        //   new BundleAnalyzerPlugin()
        // );
      }
    })
  );
}

export async function repeatable() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/repeatable.js', './dist/field/', {
      override: (options) => {
        // options.resolve.alias['vue$'] = 'vue/dist/vue.esm-bundler.js';
      }
    })
  );
}

export async function s3Uploader() {
  return webpackBundle(
    './src/modules/aws/s3-uploader.ts',
    './dist/aws/s3-uploader.js',
    (options) => {
      // options.output.library = 'Unicorn';
      options.output.libraryTarget = 'umd';
      options.output.library = 'S3Uploader';
      options.output.clean = false;

      options.resolve.alias = options.resolve.alias || {};
      options.resolve.alias['@'] = path.resolve('./src');

      outputDeclaration(options, '../../types/s3-uploader.d.ts');
    }
  );
}

export async function showOn() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/ui/show-on.js', './dist/ui/', {
      override: (options) => {}
    })
  );
}

export async function vueComponentField() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/field/vue-component-field.js', './dist/field/', {
      override: (options) => {
        options.output.library = 'VueComponentField';
        options.output.libraryTarget = 'umd';
      }
    })
  );
}

function outputDeclaration(options, outFile) {
  options.plugins.push(new dtsBundle.BundleDeclarationsWebpackPlugin({
    // entry: {
    //   filePath: options.entry,
    //   output: {
    //     exportReferencedTypes: false,
    //     inlineDeclareExternals: false,
    //   }
    // },
    outFile,
    compilationOptions: {
      preferredConfigPath: path.resolve('tsconfig.json'),
    },
    removeEmptyLines: false,
    removeEmptyExports: false,
    removeRelativeReExport: false,
  }));
}
