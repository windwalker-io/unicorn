/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import fusion, { webpack, watch } from '@windwalker-io/fusion';

export async function uiBootstrap5() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/ui/ui-bootstrap5.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'system';
    }
  });
}

export async function validation() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/ui/validation-components.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function flatpickr() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/ui/flatpickr-components.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function listDependent() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/ui/list-dependent.js', './dist/ui/', {
    override: (options) => {
      options.output.library = 'ListDependent';
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function sid() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/field/single-image-drag.js', './dist/field/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function fileDrag() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/field/file-drag.js', './dist/field/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function iframeModal() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/ui/iframe-modal.js', './dist/ui/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function modalField() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  webpack('./src/modules/field/modal-field.js', './dist/field/', {
    override: (options) => {
      options.output.libraryTarget = 'umd';
    }
  });
}

export async function multiUploader() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  fusion.vue('./src/modules/field/multi-uploader.js', './dist/field/', {
    override: (options) => {
      options.resolve.alias['vue$'] = 'vue/dist/vue.esm-bundler.js';
    }
  });
}

export async function s3Uploader() {
  watch(
    ['src/modules/**/*.js', 'scss/**/*.scss']
  );

  fusion.vue('./src/modules/aws/s3-uploader.js', './dist/aws/', {
    override: (options) => {
      options.output.library = 'S3Uploader';
      options.output.libraryTarget = 'umd';
    }
  });
}
