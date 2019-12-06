const { RawSource } = require('webpack-sources');
const serialize = require('serialize-javascript');

function defaultPredicate(pName, cName) {
  return pName === cName;
}

module.exports = class OptimizeJsPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const jsRegex = /\.js($|\?)/i;
    const predicate = this.options.predicate || defaultPredicate;

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('after-optimize-chunk-assets', (chunks) => {
        chunks.forEach((chunk) => {
          const files = [];
          chunk.files.forEach((file) => {
            if (jsRegex.test(file)) {
              files.push(file);
            }
          });
          files
            .filter((fileName) => {
              const shouldOptimize = (!this.options.whiteList || this.options.whiteList.find(el => predicate(el, fileName)))
                        && (!this.options.blackList || !this.options.blackList.find(el => predicate(el, fileName)));
              return shouldOptimize;
            })
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
