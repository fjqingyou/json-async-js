# 异步 JSON

[English](./readme.md) | 简体中文

用于异步解析和序列化 JSON 的功能。

主要目的是为了解决超大 JSON 的解析与序列化时，占据大量 CPU 资源。只有等同步的 JSON.stringify 和 JSON.parse 执行完毕，才能执行其他逻辑问题。

这个库的实现思路是将原先在同步调用一次性完成解析、序列化的任务，分散到多个 Promise 任务。每一次获得执行机会时，仅仅只处理其中的一小部分小任务。

虽然能解决一次性占用大量 CPU 时间资源的问题，但是问题将转变为解析和序列化任务的时间分散到各个不同时间上执行。客观来说完成总任务的时间会变得更长

## 安装
请在下方的 npm 或者是 yarn 根据您的习惯选取其中一个执行即可

```
# npm
npm install json-async-js --save

# yarn
yarn add json-async-js --save
```

## 测试
``` js

//import for js if you use .js
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

