
/** Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer A function that transforms the results.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export async function stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): Promise<string>

/** Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export async function stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): Promise<string>;


/** Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value
 * @param replacer
 * @param space
 * @returns
 */
export async function stringify(value: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number): Promise<string> {
    let result = "undefined";
    if (value !== undefined) {
        let spaceInfo: IDataSpaceInfo = {
            template: "",
            text: "",
        };

        if (space != undefined) {
            if (typeof space == "number") {
                spaceInfo.template = (Array(space + 1).join(" "));
            } else {
                spaceInfo.template = space;
            }

            spaceInfo.text = "\n";// JSON.stringify(xxx, undefined, 4); is lf not crlf
        }

        result = "" + await stringifyItem(value, replacer || null, spaceInfo);
    }
    return result;
}


async function stringifyItem(value: any, replacer: ((this: any, key: string, value: any) => any) | (number | string)[] | null, spaceInfo: IDataSpaceInfo): Promise<string | number | boolean | null> {
    if (value == null) {
        return null;
    }

    let valueType = typeof value;
    switch (valueType) {
        case "number":
            return isFinite(value) ? value : null;
        case "boolean":
            return value;
        case "string":
            return JSON.stringify(value);
        case "bigint":
            return String(value);
        default:
            // else return
            break;
    }

    let toJSON = value.toJSON as (() => string) | undefined;
    if (toJSON) {
        let v = toJSON.call(value);
        return stringifyItem(v, replacer, spaceInfo);
    }

    let nextSpaceInfo = createNextSpaceInfo(spaceInfo);

    let items: any[] = [];
    if (isArray(value)) {
        for (const item of value) {
            let v = await stringifyItem(item, replacer, nextSpaceInfo);

            // null value special treatment
            if (v === null) {
                //subsequent joins need to maintain null existence
                items.push("null");
                continue;
            }

            items.push(v);
        }

        // empty array
        if (items.length < 1) {
            return "[]";
        }

        return `[${nextSpaceInfo.text}${items.join("," + nextSpaceInfo.text)}${spaceInfo.text}]`;
    }

    // object colon right space
    let spaceOfColonRight = "";
    if (spaceInfo.text) {
        spaceOfColonRight = " ";
    }

    //object
    for (let key in value) {
        let v = value[key];

        // ignore undefined values
        if (v === undefined) {
            continue;
        }

        // user custom replacer
        if (replacer) {
            if (isArray(replacer)) {// array
                if (!replacer.indexOf(key)) {
                    continue;
                }
            } else {// function
                v = await replacer.call(value, key, v);
            }
        }

        let strValue = await stringifyItem(v, replacer, nextSpaceInfo);
        items.push(`\"${key}\":${spaceOfColonRight}${strValue}`);
    }

    // empty object
    if (items.length < 1) {
        return "{}";
    }

    return `{${nextSpaceInfo.text}${items.join("," + nextSpaceInfo.text)}${spaceInfo.text}}`;
}

function isArray(value: any): value is Array<any> {
    return (Array.isArray && Array.isArray(value)) || Object.prototype.toString.call(value) === '[object Array]';
}

function createNextSpaceInfo(spaceInfo: IDataSpaceInfo) {
    let si = spaceInfo;

    if (spaceInfo.template !== "") {
        si = {
            template: spaceInfo.template,
            text: spaceInfo.text + spaceInfo.template,
        }
    }
    return si;
}

interface IDataSpaceInfo {
    text: string;
    template: string;
}
