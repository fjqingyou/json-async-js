# json async

[![NPM version](https://img.shields.io/npm/v/json-async-js.svg?style=flat-square)](https://npmjs.org/package/json-async-js)
[![node version](https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square)](http://nodejs.org/download/)
[![npm download](https://img.shields.io/npm/dm/json-async-js.svg?style=flat-square)](https://npmjs.org/package/json-async-js)
[![NPM count](https://img.shields.io/npm/dt/json-async-js.svg?style=flat-square)](https://www.npmjs.com/package/json-async-js)
[![License](https://img.shields.io/npm/l/json-async-js.svg?style=flat-square)](https://www.npmjs.com/package/json-async-js)

English | [简体中文](./readme-cn.md)

Function for asynchronous parsing and serialization of JSON.

The main purpose is to solve the problem of occupying a large amount of CPU resources during parsing and serialization of large JSONs. Only after the synchronization of JSON.stringify and JSON.parse is completed can other logical issues be executed.

The implementation idea of this library is to disperse the task of parsing and serialization that was previously completed in a single synchronous call to multiple Promise tasks. Every time an execution opportunity is given, only a small portion of the small tasks are processed.

Although it can solve the problem of occupying a large amount of CPU time resources at once, the problem will shift to the time of parsing and serialization tasks being dispersed across different times for execution. Objectively speaking, the time to complete the overall task will become longer

***Note:*** is currently a test version and there is a risk of bugs. It is not recommended to use it in an production environment now.

## install

Please select one of the NPM or Yarn options below to execute according to your preference

``` shell
# npm
npm install json-async-js --save

# yarn
yarn add json-async-js --save
```

## test

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

    // obj stringify json string
    let jsonStr = await JsonAsync.stringify(obj1, undefined, 4)
    let jsonStr2 = JSON.stringify(obj1, undefined, 4);
    console.log("jsonStr === jsonStr2 is " + (jsonStr === jsonStr2));

    // output local file observe
    // fs.writeFileSync("local/jsonStr.json", jsonStr, { encoding: "utf8" });
    // fs.writeFileSync("local/jsonStr2.json", jsonStr2, { encoding: "utf8" });

    // json string parse obj
    let res = await JsonAsync.parse(jsonStr)
    let res2 = await JSON.parse(jsonStr)
    console.log(`obj1 JSON.stringify(res) === JSON.stringify(res2) is ${JSON.stringify(res) === JSON.stringify(res2)}`)

    // template
    let template = `{"a":"1\\r\\n\\t'\\"\\\\2\\u4F60\\u597D"}`;
    res = await JsonAsync.parse(template);
    res2 = JSON.parse(template)
    console.log(`template JSON.stringify(res) === JSON.stringify(res2) is ${JSON.stringify(res) === JSON.stringify(res2)}`)

    // test empty array
    jsonStr = await JsonAsync.stringify([]);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    // test empty object
    jsonStr = await JsonAsync.stringify({});
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    // test null
    jsonStr = await JsonAsync.stringify(null);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    // test undefined
    jsonStr = await JsonAsync.stringify(undefined);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    // bigInt support
    res = await JsonAsync.parse('{"n_bigint":9007199254740992,"n_number":9007199254740991}');
    jsonStr = await JsonAsync.stringify(res);
    console.log("res", JSON.stringify(jsonStr), res);
}

doTest();
```
