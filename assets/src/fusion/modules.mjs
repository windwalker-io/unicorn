import fusion, { webpack, watch, wait, webpackBundle } from '@windwalker-io/fusion';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export async function uiBootstrap5() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/ui/ui-bootstrap5.js', './dist/ui/', {
      override: (options) => {
        options.output.libraryTarget = 'system';
      }
    })
  );
}

export async function validation() {
  return webpackBundle(
    './src/modules/ui/validation-components.ts',
    './dist/ui/validation-components.js',
    (options) => {
      // options.output.library = 'Unicorn';
      options.output.libraryTarget = 'umd';
      options.output.clean = false;

      options.resolve.alias = options.resolve.alias || {};
      options.resolve.alias['@'] = path.resolve('./src');
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
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  return wait(
    webpack('./src/modules/aws/s3-uploader.js', './dist/aws/', {
      override: (options) => {
        options.output.library = 'S3Uploader';
        options.output.libraryTarget = 'umd';
      }
    })
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
