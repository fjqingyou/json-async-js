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
        jumpEmpty();

        const char = text[index];
        if (char === '{') {
            result = await parseObject();
        } else if (char === '[') {
            result = await parseArray();
        } else if (char === '"') {
            result = await parseString();
        } else if (char === '-' || !isNaN(Number(char))) {
            result = await parseNumber();
        } else if (char === 't' || char === 'f' || char === 'n') {
            result = await parseBooleanOrNull();
        }

        jumpEmpty();

        return result;
    }

    async function parseObject(): Promise<any> {
        const obj = {} as any;

        // jump '{'
        index++;

        jumpEmpty();

        while (text[index] !== '}') {
            jumpEmpty();

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

        jumpEmpty();

        return obj;
    }

    async function parseArray(): Promise<any> {
        const arr = [];

        // jump '['
        index++;

        jumpEmpty();

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

        // jump ']'
        index++;

        if (reviver) {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = await reviver.call(arr, "" + i, arr[i]);
            }
        }

        jumpEmpty();

        return arr;
    }

    async function parseString(): Promise<string> {
        // require " character in start
        if (text[index] !== '"') {
            throw new Error(`SyntaxError: Unexpected character '${text[index]}' in JSON at position ${index}`)
        }

        // jump '"'
        index++;

        let indexStart = index;

        for (; ;) {
            if (text[index] === '"') {
                // not escape character
                if (text[index - 1] !== '\\') {
                    break;
                }

                // calc \ character count
                let n = 1;
                while (n < index) {
                    if (text[index - n - 1] !== "\\") {
                        break;
                    }

                    n++;
                }

                //even quantity
                if (n % 2 == 0) {
                    break;
                }
            } else if (index >= text.length) {
                throw new Error(`end of text reached without terminating '\"' of ${indexStart}`);
            }

            index++;
        }

        let indexEnd = index;

        // jump '"'
        index++;

        // crop string content
        let str = text.substring(indexStart, indexEnd);

        // handling Escape character
        return unescapeAll(str);
    }

    async function parseNumber(): Promise<number> {
        let indexStart = index;
        for (; ;) {
            let code = text[index].charCodeAt(0);
            if (code < 48 || code > 57) {
                break;
            }

            index++;
        }
        let indexEnd = index;

        let str = text.substring(indexStart, indexEnd);
        return Number(str);
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

    function unescapeAll(str: string) {
        return str.replace(/\\(u[0-9a-fA-F]{4}|.)/g, function (match, char) {
            if (char.charAt(0) === 'u') {
                return String.fromCharCode(parseInt(char.substr(1), 16));
            } else {
                switch (char) {
                    case 'n':
                        return '\n';
                    case 'r':
                        return '\r';
                    case 't':
                        return '\t';
                    case '\'':
                        return '\'';
                    case '\"':
                        return '\"';
                    case '\\':
                        return '\\';
                    default:
                        return match;
                }
            }
        });
    }

    return parseValue();
}
