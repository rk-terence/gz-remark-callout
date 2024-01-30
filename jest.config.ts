import type { Config } from "jest";

const config: Config = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            { useESM: true }
        ]
    },
    moduleNameMapper: { "(.+)\\.js": "$1" },
    extensionsToTreatAsEsm: [".ts"]
};

export default config;
