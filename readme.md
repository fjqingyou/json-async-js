# json async

Function for asynchronous parsing and serialization of JSON.


## test
``` js
import JsonAsync from "JsonAsyncJs";

async function doTest() {
    let obj1 = {
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
    let jsonStr = await JsonAsync.stringify(obj1)
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


