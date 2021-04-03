/**
 * Part of Windwalker Fusion project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

import fusion, { babel, webpack, parallel } from '@windwalker-io/fusion';

export async function main() {
  // Watch start
  fusion.watch('src/**/*.js');
  // Watch end

  // Compile Start
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
  fusion.watch('src/**/*.js');
  // Watch end

  // Compile Start
  babel(
    ['src/**/*.js', '!src/unicorn/**/*'],
    'dist/',
    { module: 'umd' }
  );
  // Compile end
}

export default main;

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
