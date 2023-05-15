import fs from "fs";
import path from "path";

import sass from "sass";
import thena from "thena/node";

const __dirname = thena.global.__dirname(import.meta);

const IN_DIR = `${__dirname}/src`;
const OUT_DIR = `${__dirname}/dist`;

const options = {
    input: `${IN_DIR}/index.scss`,
    output: `${OUT_DIR}/primer.css`,
};

/**
 * @type {sass.Options}
 */
const sassOptions = {
    sourceMap: true,
    importers: [
        {
            canonicalize(url) {
                const npmPackageNameRegex = /^@?\w+\//i;

                if (npmPackageNameRegex.test(url)) {
                    thena.log(`Importing ${url}...`, "cyan", "bold");

                    return new URL(url, "file:///");
                }

                return null;
            },
            load(canonicalUrl) {
                const parsed = String(canonicalUrl).replace("file:///", "");

                if (parsed.startsWith("@")) {
                    const [packageName, ...rest] = parsed.split("/");

                    const packagePath = path.join(__dirname, "node_modules", packageName);

                    if (!fs.existsSync(packagePath)) {
                        return null;
                    }

                    const filePath = path.join(packagePath, ...rest);

                    if (!fs.existsSync(filePath)) {
                        return null;
                    }

                    return {
                        contents: fs.readFileSync(filePath, "utf-8"),
                        syntax: "scss",
                    };
                } else {
                    const filePath = path.join(__dirname, "node_modules", parsed);

                    if (!fs.existsSync(filePath)) {
                        return null;
                    }

                    return {
                        contents: fs.readFileSync(filePath, "utf-8"),
                        syntax: "scss",
                    };
                }
            },
        },
    ],
};

const bundle = async () => {
    thena.log("Bundling...", "magenta", "bold");

    try {
        const result = sass.compile(options.input, sassOptions);

        if (!fs.existsSync(OUT_DIR)) {
            fs.mkdirSync(OUT_DIR);
        }

        await fs.promises.writeFile(options.output, result.css);

        thena.log("Wrote to:", "cyan", "bold");

        console.log(options.output);

        if (process.argv.includes("--watch")) {
            await fs.promises.writeFile(
                `${options.output}.dev`,
                `/* Generated local development file */\n\n@import url("https://mwittrien.github.io/BetterDiscordAddons/Themes/EmojiReplace/base/Apple.css");\n\n${result.css}`
            );

            thena.log("Wrote to:", "cyan", "bold");
            console.log(`${options.output}.dev`);
        }
    } catch (error) {
        thena.log("Error:", "red", "bold");
        if (error instanceof sass.Exception) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }

    thena.log("Done!", "green", "bold");
};

bundle();

if (process.argv.includes("--watch")) {
    fs.watch(IN_DIR, { recursive: true }, (event, filename) => {
        if (event === "change" && filename.endsWith(".scss")) {
            console.log();
            console.log(`File ${filename} changed, rebuilding...`);
            bundle();
        }
    });
}
