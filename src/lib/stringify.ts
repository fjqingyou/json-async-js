
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

            spaceInfo.text = "\r\n";
        }

        result = "" + await stringifyItem(value, replacer || null, spaceInfo);
    }
    return result;
}


async function stringifyItem(value: any, replacer: ((this: any, key: string, value: any) => any) | (number | string)[] | null, spaceInfo: IDataSpaceInfo): Promise<string | number | boolean | null> {
    if (value == null) {
        return null;
    }

    if (typeof value == "number") {
        return isFinite(value) ? value : null;
    }

    if (typeof value == "boolean") {
        return value;
    }

    if (typeof value == "string") {
        // use JSON.stringify do string, for example \" or \' or other
        return JSON.stringify(value);
    }

    let toJSON = value.toJSON as (() => string) | undefined;
    if (toJSON) {
        return toJSON.call(value);
    }

    let nextSpaceInfo = createNextSpaceInfo(spaceInfo);
    let strSpaceCurrent = getSpaceStr(spaceInfo);
    let strSpaceNext = getSpaceStr(nextSpaceInfo);

    let items: any[] = [];
    if (isArray(value)) {
        for (const item of value) {
            let strValue = await stringifyItem(item, replacer, nextSpaceInfo);
            items.push(strValue);
        }
        return `[${strSpaceNext}${items.join("," + strSpaceNext)}${strSpaceCurrent}]`;
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
        items.push(`\"${key}\":${strValue}`);
    }
    return `{${strSpaceNext}${items.join("," + strSpaceNext)}${strSpaceCurrent}}`;
}

function isArray(value: any): value is Array<any> {
    return (Array.isArray && Array.isArray(value)) || Object.prototype.toString.call(value) === '[object Array]';
}

function getSpaceStr(spaceInfo: IDataSpaceInfo): string {
    return spaceInfo.text;
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