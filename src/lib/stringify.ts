
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
        result = "" + await stringifyItem(value, replacer, space);
    }
    return result;
}


async function stringifyItem(value: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number): Promise<string | number | boolean | null> {
    let result = null;
    if (value !== null) {
        if (typeof value == "number") {
            result = isFinite(value) ? value : null;
        } else if (typeof value == "boolean") {
            result = value;
        } else if (typeof value == "string") {
            result = `"${value}"`;
        } else {
            let toJSON = value.toJSON as (() => string) | undefined;
            if (toJSON) {
                result = value.toJSON();
            } else if (isArray(value)) {
                let items: any[] = [];
                for (const item of value) {
                    let strValue = await stringifyItem(item, replacer, space);
                    items.push(strValue);
                }
                let strSpace = getSpaceStr(space);
                result = `[${items.join("," + strSpace)}]`;
            } else {
                let items: any[] = [];

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

                    let strValue = await stringifyItem(v);
                    items.push(`\"${key}\":${strValue}`);
                }
                let strSpace = getSpaceStr(space);
                result = `{${items.join("," + strSpace)}}`;
            }
        }
    }
    return result;
}

function isArray(value: any): value is Array<any> {
    return (Array.isArray && Array.isArray(value)) || Object.prototype.toString.call(value) === '[object Array]';
}

function getSpaceStr(space?: string | number): string {
    let str = "";
    if (space != undefined) {
        if (typeof space == "string") {
            str = `\n${space}`;
        } else {
            let strSpace = (Array(space).join(" ")).slice(-space);
            str = `\n${strSpace}`;
        }
    }
    return str;
}