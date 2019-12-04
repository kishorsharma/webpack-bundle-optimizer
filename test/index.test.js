import Optimizer from '../src/index';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const webpack = require('webpack');
const rimraf = require('rimraf');

const distDir = path.join(__dirname, 'dist');
const caseDir = path.join(__dirname, 'cases');

const runWebpack = (config, callback) => {
  const compiler = webpack(config);
  compiler.run((err) => {
    if (err) {
      console.error(err);
      return;
    }
    callback();
  });
};

const getConfig = (dir) => {
  return {
    entry: path.join(caseDir, dir, 'input.js'),
    output: {
      path: distDir,
      filename: 'bundle.js',
    },
    plugins: [
      new Optimizer(),
    ],
  };
};

const getOutput = dir => fs.readFileSync(path.join(caseDir, dir, 'output.js'), 'utf-8').trim();

const getBundle = () => fs.readFileSync(path.join(distDir, 'bundle.js'), 'utf-8');

describe('optimize-js-plugin', () => {
  afterEach(() => {
    rimraf.sync(distDir);
  });

  it('no opts', (done) => {
    const config = getConfig('no-opts', false);
    return runWebpack(config, () => {
      const output = getOutput('no-opts');
      const bundle = getBundle('bundle.js');
      assert.deepEqual(output, bundle);
      done();
    });
  });

  // TODO: with white listning
  // it('with whitelisting', (done) => {
  //
  // });

  // TODO: with black listning
  // it('with whitelisting', (done) => {
  //
  // });
});
