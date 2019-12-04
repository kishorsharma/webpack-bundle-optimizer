
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

## Table of Contents
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

## Documentation

Optimisation is one place which make many web developers to bang their head on wall. As mobile user
are increasing, initial load time plays also a major factor in you web-app performance.

One of JavaScript’s heaviest costs is the time for a JS engine to parse/compile/optimize JS code. There is very good article provides insight of JS execution and parsing cost: [The cost of JavaScript in 2019](https://v8.dev/blog/cost-of-javascript-2019).

Modern JS engine V8 (others) do a pre-parse most functions before doing a full parse. This step checks for syntax errors. This saves cost of full parse if there exist any error. However, there are use cases (like webpack output bundle) where we want to execute our JS code as soon as possible.
In cases (which include common module formats like UMD/Browserify/Webpack/etc.), the browser will actually parse the function twice, first as a pre-parse and second as a full parse.

Benchmark overview
----

| Tool | Typical speed boost/regression using webpack-bundle-optimizer | old score | new score
| ---- | ----- | ----- | ----- |
| google page speed score| 15.15% | 33 | 38

Reports are available inside reports folder.

## TODOS:
[] Whitelisting file: Only optimize files mentioned.
[] Blacklist file: Optimize all but these files.

## Support

If you find any problems or bugs, please open a new [issue](https://github.com/kishorsharma/webpack-bundle-optimizer/issues).

## Ref:

* [Why does download and execution time matter?](https://v8.dev/blog/cost-of-javascript-2019#download-execute)
* [JavaScript Start-up Performance - By Addy Osmani](https://medium.com/reloading/javascript-start-up-performance-69200f43b201)
* [JavaScript Start-up Optimization - By Addy Osmani](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization)
* [Optimize JS](https://github.com/nolanlawson/optimize-js)

