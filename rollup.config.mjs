import fs from "fs"
import copy from "rollup-plugin-copy-watch"

const { default: foundryPath } = await import("./foundry-path.js")
const modulePath = foundryPath()
const manifest = JSON.parse(fs.readFileSync("./module.json", "utf-8"))
const moduleId = manifest.id

console.log("Bundling " + moduleId + " to " + modulePath)

const isProduction = process.env.NODE_ENV === "production"

export default {
    input: `./modules/${moduleId}.mjs`,
    output: {
        file: `${modulePath}/modules/${moduleId}.mjs`,
        format: "es"
    },
    watch: {
        clearScreen: true
    },
    plugins: [
        copy({
            targets: [
                { src: "module.json", dest: modulePath },
                { src: "languages/*", dest: `${modulePath}/languages` },
                { src: "styles/*", dest: `${modulePath}/styles` }
            ],
            watch: isProduction ? false : ["languages/**", "styles/**", "module.json"]
        })
    ]
}
