import { parse } from "./lib/parse";
import { stringify } from "./lib/stringify";

const JsonAsyncJs = {
    parse,
    stringify,
};

// export default JsonAsyncJs;

// @ts-ignore
const e = exports;

e.default = JsonAsyncJs;
e.JsonAsyncJs = JsonAsyncJs;
e.parse = parse;
e.stringify = stringify;

