/** Converts a JavaScript Object Notation (JSON) string into an object.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 */
export async function parse<T extends any>(text: string, reviver?: (this: any, key: string, value: any) => any): Promise<T | null> {
    let index = 0;
    if (text == null) {
        return null;
    }

    async function parseValue(): Promise<any> {
        let result = null;
        const char = text[index];

        jumpEmpty();

        if (char === '{') {
            result = parseObject();
        } else if (char === '[') {
            result = parseArray();
        } else if (char === '"') {
            result = parseString();
        } else if (char === '-' || !isNaN(Number(char))) {
            result = parseNumber();
        } else if (char === 't' || char === 'f' || char === 'n') {
            result = parseBooleanOrNull();
        }

        jumpEmpty();

        return result;
    }

    async function parseObject(): Promise<any> {
        const obj = {} as any;

        // jump '{'
        index++;

        while (text[index] !== '}') {
            const key = await parseString();

            jumpEmpty();

            // jump ':'
            index++;

            jumpEmpty();

            let value = await parseValue();

            if (reviver) {
                value = await reviver.call(obj, key, value);
            }

            obj[key] = value;

            jumpEmpty();

            // jump ','
            if (text[index] === ',') {
                index++;

                jumpEmpty();
            }
        }

        // jump '}'
        index++;

        return obj;
    }

    async function parseArray(): Promise<any> {
        const arr = [];

        // jump '['
        index++;

        while (text[index] !== ']') {
            jumpEmpty();

            const value = await parseValue();

            arr.push(value);

            jumpEmpty();

            // jump ','
            if (text[index] === ',') {
                index++;

                jumpEmpty();
            }
        }

        if (reviver) {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = await reviver.call(arr, "" + i, arr[i]);
            }
        }

        // jump ']'
        index++;

        return arr;
    }

    async function parseString(): Promise<string> {
        let str = '';
        // jump '"'
        index++;

        while (text[index] !== '"') {
            str += text[index];
            index++;
        }

        // jump '"'
        index++;

        return str;
    }

    async function parseNumber(): Promise<number> {
        let numStr = '';

        while (!isNaN(Number(text[index]))) {
            numStr += text[index];
            index++;
        }

        return Number(numStr);
    }

    async function parseBooleanOrNull(): Promise<boolean | null> {
        const word = text.slice(index, index + 4);

        if (word === 'true') {
            index += 4;
            return true;
        } else if (word === 'fals') {
            index += 5;
            return false;
        } else if (word === 'null') {
            index += 4;
            return null;
        }
        return null;
    }

    function jumpEmpty(): void {
        for (; ;) {
            let c = text[index];

            if (c !== " " && c !== "\t" && c !== "\r" && c !== "\n") {
                break;
            }

            index++;
        }
    }

    return parseValue();
}
