# 异步 JSON

[![NPM version](https://img.shields.io/npm/v/json-async-js.svg?style=flat-square)](https://npmjs.org/package/json-async-js)
[![node version](https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square)](http://nodejs.org/download/)
[![npm download](https://img.shields.io/npm/dm/json-async-js.svg?style=flat-square)](https://npmjs.org/package/json-async-js)
[![NPM count](https://img.shields.io/npm/dt/json-async-js.svg?style=flat-square)](https://www.npmjs.com/package/json-async-js)
[![License](https://img.shields.io/npm/l/json-async-js.svg?style=flat-square)](https://www.npmjs.com/package/json-async-js)

[English](./readme.md) | 简体中文

用于异步解析和序列化 JSON 的功能。

主要目的是为了解决超大 JSON 的解析与序列化时，占据大量 CPU 资源。只有等同步的 JSON.stringify 和 JSON.parse 执行完毕，才能执行其他逻辑问题。

这个库的实现思路是将原先在同步调用一次性完成解析、序列化的任务，分散到多个 Promise 任务。每一次获得执行机会时，仅仅只处理其中的一小部分小任务。

虽然能解决一次性占用大量 CPU 时间资源的问题，但是问题将转变为解析和序列化任务的时间分散到各个不同时间上执行。客观来说完成总任务的时间会变得更长

***注意：*** 当前还是一个测试版本，有存在 bug 的风险，不建议现在就投入到线上环境下使用。

## 安装

请在下方的 npm 或者是 yarn 根据您的习惯选取其中一个执行即可

``` shell
# npm
npm install json-async-js --save

# yarn
yarn add json-async-js --save
```

## 测试

``` js

//import for js if you use .js
// const fs = require("fs");
const JsonAsync = require("json-async-js");

//import for typescript if you use typescript
// import fs from "fs";
// import JsonAsync from "json-async-js";

async function doTest() {
    let date = new Date();
    let objWithToJSON = {
        toJSON: function () {
            return {
                field1: "0",
                field2: 1,
                field3: date,
            }
        }
    }

    let obj1 = {
        a: "1\r\n\t\'\"\\2\u4F60\u597D",
        b: -2.3,
        c: true,
        d: null,
        e: [],
        f: [[1], [2, 3]],
        g: {
            a: "1",
            b: 2,
            c: true,
            d: null,
        },
        h: date,
        i: objWithToJSON,
        j: [
            {
                a: "1",
                b: 2,
                c: true,
                d: null,
                e: [],
                f: [[1], [2, 3]],
                g: {
                    a: "1",
                    b: 2,
                    c: true,
                    d: null,
                },
                h: date,
                i: objWithToJSON,
            },
            {
                a: "1",
                b: 2,
                c: true,
                d: null,
                e: [],
                f: [[1], [2, 3]],
                g: {
                    a: "1",
                    b: 2,
                    c: true,
                    d: null,
                },
                h: new Date(),
                i: objWithToJSON,
            }
        ]
    };

    // obj 序列化为 json 字符串
    let jsonStr = await JsonAsync.stringify(obj1, undefined, 4)
    let jsonStr2 = JSON.stringify(obj1, undefined, 4);
    console.log("jsonStr === jsonStr2 is " + (jsonStr === jsonStr2));

    // 输出本地文件观察
    // fs.writeFileSync("local/jsonStr.json", jsonStr, { encoding: "utf8" });
    // fs.writeFileSync("local/jsonStr2.json", jsonStr2, { encoding: "utf8" });

    // json 字符串解析为 obj
    let res = await JsonAsync.parse(jsonStr)
    let res2 = await JSON.parse(jsonStr)
    console.log(`obj1 JSON.stringify(res) === JSON.stringify(res2) is ${JSON.stringify(res) === JSON.stringify(res2)}`)

    // 模板
    let template = `{"a":"1\\r\\n\\t'\\"\\\\2\\u4F60\\u597D"}`;
    res = await JsonAsync.parse(template);
    res2 = JSON.parse(template)
    console.log(`template JSON.stringify(res) === JSON.stringify(res2) is ${JSON.stringify(res) === JSON.stringify(res2)}`)

    //测试空数组
    jsonStr = await JsonAsync.stringify([]);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    //测试空对象
    jsonStr = await JsonAsync.stringify({});
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    //测试 null
    jsonStr = await JsonAsync.stringify(null);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    //测试 undefined
    jsonStr = await JsonAsync.stringify(undefined);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    // bigInt 支持
    res = await JsonAsync.parse('{"n_bigint":9007199254740992,"n_number":9007199254740991}');
    jsonStr = await JsonAsync.stringify(res);
    console.log("res", JSON.stringify(jsonStr), res);
}

doTest();
```
