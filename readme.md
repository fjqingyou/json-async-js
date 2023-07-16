# json async

English | [简体中文](./readme-cn.md)

Function for asynchronous parsing and serialization of JSON.

The main purpose is to solve the problem of occupying a large amount of CPU resources during parsing and serialization of large JSONs. Only after the synchronization of JSON.stringify and JSON.parse is completed can other logical issues be executed.

The implementation idea of this library is to disperse the task of parsing and serialization that was previously completed in a single synchronous call to multiple Promise tasks. Every time an execution opportunity is given, only a small portion of the small tasks are processed.

Although it can solve the problem of occupying a large amount of CPU time resources at once, the problem will shift to the time of parsing and serialization tasks being dispersed across different times for execution. Objectively speaking, the time to complete the overall task will become longer

## install
Please select one of the NPM or Yarn options below to execute according to your preference

```
# npm
npm install json-async-js --save

# yarn
yarn add json-async-js --save
```

## test
``` js

//import for js if you use .js
const fs = require("fs");
const JsonAsync = require("json-async-js");

//import for typescript if you use typescript
import JsonAsync from "json-async-js";

async function doTest() {
    let obj1 = {
        a: "1\"2",
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
        h: [
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
                }
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
                }
            }
        ]
    };
    let jsonStr = await JsonAsync.stringify(obj1, undefined, 4)
    let res = await JsonAsync.parse(jsonStr)
    console.log("res", JSON.stringify(res));

    jsonStr = await JsonAsync.stringify([]);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    jsonStr = await JsonAsync.stringify({});
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    jsonStr = await JsonAsync.stringify(null);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    jsonStr = await JsonAsync.stringify(undefined);
    res = await JsonAsync.parse(jsonStr);
    console.log("res", JSON.stringify(res))

    res = await JsonAsync.parse(null);
    console.log("res", JSON.stringify(res))
}

doTest();
```


