
<div align="center">
  <!-- PR's Welcome -->
  <a href="http://makeapullrequest.com" style="width: 50%">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"
      alt="PR's Welcome" />
  </a>
  
</div>

<h1 align="center">Webpack bundle optimizer</h1>

<div align="center">
  A webpack plugin to optimize a JavaScript file for faster initial execution and parsing, by converting output chunk/bundle as string and using window.Function() for execution.
</div>

# Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Documentation](#documentation)
- [Support](#support)

## Install

```sh
npm i --save-dev webpack-bundle-optimizer
```

## Usage

```js
// webpack.config.js
const Optimizer = require("webpack-bundle-optimizer");
module.exports = {
  entry: //...,
  output: //...,
  plugins: [
    new Optimizer()
  ]
}
```

## Options

- whiteList: if defined, file name found in this array will be optimized.
- BlackList: if defined, file name not found in this array will be optimized.
- predicate: predicate function which will be used to find filename in array.

### Default predicate function

```JS
function (pName, cName) {
    return pName === cName
};
```

where:

- pName is name provided in whiteList/blackList array.
- cName is current filename in processing

## Example

This example assume fileName are generated with hash (which is common pattern now):
filename : main-98becfc0b54581da9521.js

```JS
// webpack.config.js
const Optimizer = require("webpack-bundle-optimizer");
module.exports = {
  entry: //...,
  output: //...,
  plugins: [
    new Optimizer({
    whiteList: ['vendor-react', 'vendor-all', 'runtime', 'main'],
    predicate: function (pName, cName) {
      const fileNameParts = cName.split('-');
      fileNameParts.pop();
      const fileName = fileNameParts.join('-');
      return pName === fileName;
    }
  })
  ]
}
```

Here as I am removing hash and extension I am passing name in whiteList array without extension.

> Please note: If you have serviceworker with importScript, it should be added in blackList. For more info go [here](https://github.com/kishorsharma/webpack-bundle-optimizer/issues/6).

## Documentation

Optimisation is one place which make many web developers to bang their head on wall. As mobile user
are increasing, initial load time plays also a major factor in you web-app performance.

One of JavaScript’s heaviest costs is the time for a JS engine to parse/compile/optimize JS code. There is very good article provides insight of JS execution and parsing cost: [The cost of JavaScript in 2019](https://v8.dev/blog/cost-of-javascript-2019).

Modern JS engine V8 (others) do a pre-parse most functions before doing a full parse. This step checks for syntax errors. This saves cost of full parse if there exist any error. However, there are use cases (like webpack output bundle) where we want to execute our JS code as soon as possible.
In cases (which include common module formats like UMD/Browserify/Webpack/etc.), the browser will actually parse the function twice, first as a pre-parse and second as a full parse.

## Benchmark overview

----
| Tool | Typical speed boost/regression using webpack-bundle-optimizer | old score | new score
| ---- | ----- | ----- | ----- |
| google page speed score| 15.15% | 33 | 38

Reports are available inside reports folder.

## How pagespeed insight works

Acc. to google, [lighthouse pagespeed](https://docs.google.com/spreadsheets/d/1up5rxd4EMCoMaxH8cppcK1x76n6HLx0e7jxb0e0FXvc/edit#gid=0) score are calculated on following metric:

| **Metric** | **Category Weighting** |
| --- | --- |
| first-contentful-paint | 20.00% |
| first-meaningful-paint | 6.70% |
| speed-index | 26.70% |
| interactive | 33.30% |
| first-cpu-idle | 13.30% |
| max-potential-fid | 0.00% |

Based on the above, plugin targets speed-index and interactive. Following were impactful zone for optimisation:

- Script Evaluation
- JS execution and parsing

For which following were done as follows:

With optimization we were able to reduce significant time as follows (all time in seconds):

#### Page Speed Optimisation:

|   | FCP (second) | First CPU Idle | TTI (second) | Score |
| --- | --- | --- | --- | --- |
| Unoptimized | 1.1 | 12.3 | 13.2 | 33 |
| Optimized | 1 | 11.6 | 12.4 | 38 |
| Diff | -0.1 | -0.7 | -0.8 | 5 |

This is a **15% gain** in performance score.

|   | Script Evaluation | JS execution &amp; parsing | Main Thread work |
| --- | --- | --- | --- |
| Unoptimized | 5.526 | 0.537 | 8 |
| Optimized | 4.953 | 0.493 | 7.1 |
| Diff | 0.575 | 0.1 | 0.9 |

We are saving approx. 1 sec on JS execution time overall after optimisation.

## TODOS:

- [x] Whitelisting file: Only optimize files mentioned.

- [x] Blacklist file: Optimize all but these files.

## Support

If you find any problems or bugs, please open a new [issue](https://github.com/kishorsharma/webpack-bundle-optimizer/issues).

## Ref

- [Why does download and execution time matter?](https://v8.dev/blog/cost-of-javascript-2019#download-execute)
- [JavaScript Start-up Performance - By Addy Osmani](https://medium.com/reloading/javascript-start-up-performance-69200f43b201)
- [JavaScript Start-up Optimization - By Addy Osmani](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization)
- [Optimize JS](https://github.com/nolanlawson/optimize-js)
