import { describe, expect, test } from "@jest/globals";
import { mergeDeep, mergeWithDefault, defaultConfig } from "./config";

describe("Merging with the default configuration", () => {

    test("Function `mergeDeep` should work by deeply merging two objects", () => {
        let obj = {
            key1: "abc",
            key2: {
                subkey1: "def"
            },
            deepKeyL1: {
                deepKeyL2: {
                    deepKeyL3: {
                        deepKeyL4: {
                            deepKeyL5: "value"
                        }
                    }
                }
            }
        };
        let template = {
            key1: "default abc",
            key2: {
                subkey1: "default def",
                subkey2: "default ghi",
            },
            key3: 1.0,
            deepKeyL1: {
                someKey: 2.0,
                deepKeyL2: {
                    someKey: 3.0,
                    deepKeyL3: {
                        someKey: 4.0,
                        deepKeyL4: {
                            someKey: 5.0,
                            deepKeyL5: "default value"
                        }
                    }
                }
            }
        };
        let merged = mergeDeep(obj, template);
        expect(merged).toStrictEqual({
            key1: "abc",
            key2: {
                subkey1: "def",
                subkey2: "default ghi",
            },
            key3: 1.0,
            deepKeyL1: {
                someKey: 2.0,
                deepKeyL2: {
                    someKey: 3.0,
                    deepKeyL3: {
                        someKey: 4.0,
                        deepKeyL4: {
                            someKey: 5.0,
                            deepKeyL5: "value"
                        }
                    }
                }
            }
        });
    });

    test("partial user config should precede the default config", () => {
        let merged = mergeWithDefault({
            callouts: {
                todo: {
                    color: "123456",
                    svg: "the svg"
                }
            }
        });
        let defaultCopy = JSON.parse(JSON.stringify(defaultConfig));
        defaultCopy.callouts.todo = {
            color: "123456",
            svg: "the svg"
        };

        expect(merged).toStrictEqual(defaultCopy);
    });

    test("empty user config should be processed to be the default config", () => {
        let merged = mergeWithDefault({});
        expect(merged).toStrictEqual(defaultConfig);
        expect(merged === defaultConfig).toBe(false);
    });

});
