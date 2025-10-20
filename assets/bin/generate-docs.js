#!/usr/bin/env node

import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateDocumentation } from 'tsdoc-markdown';

// Generate documentation for a list of files
const nnsInputFiles = globSync([
  './src/service/*.ts',
  './src/module/*.ts',
  './src/plugin/*.ts',
  './src/*.ts',
], {
  windowsPathsNoEscape: true
}).map((path) => path.replace(/\\/g, '/'));

generateDocumentation({
  inputFiles: nnsInputFiles,
  outputFile: './README.md',
  buildOptions: {
    explore: true,
    // repo: {
    //   url: 'https://github.com/windwalker-io/unicorn/tree/main/assets'
    // }
  }
});

// const readme = readFileSync(resolve(__dirname, 'docs/_README.md'), 'utf-8');
// const functions = readFileSync(resolve(__dirname, 'docs/_functions.md'), 'utf-8');
//
// const content = readme.replace('<!-- Functions -->', functions);
//
// writeFileSync('./README.md', content);
