

const { RawSource } = require('webpack-sources');
const serialize = require('serialize-javascript');

module.exports = class OptimizeJsPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const jsRegex = /\.js($|\?)/i;
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('after-optimize-chunk-assets', (chunks) => {
        chunks.forEach((chunk) => {
          const files = [];
          chunk.files.forEach(file => files.push(file));

          files
            .filter(file => jsRegex.test(file))
            .forEach((file) => {
              try {
                const asset = compilation.assets[file];
                const serializedStr = serialize(asset.source());
                const output = `Function("'use strict';return(${serializedStr.substr(1, serializedStr.length - 3)})")();`;
                compilation.assets[file] = new RawSource(output);
              } catch (e) {
                compilation.errors.push(e);
              }
            });
        });
      });
    });
  }
};
