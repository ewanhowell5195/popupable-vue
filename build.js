import { minify } from "terser"
import fs from "node:fs"

const version = JSON.parse(fs.readFileSync("package.json", "utf8")).version

fs.mkdirSync("dist", { recursive: true })

const js = fs.readFileSync("src/popupable-vue.js", "utf8")

const banner = `/*!
 * popupable-vue
 * Version  : ${version}
 * License  : MPL-2.0
 * Copyright: ${new Date().getFullYear()} Ewan Howell
 */
`

const minifiedJs = (await minify(js, {
  compress: true,
  module: true
})).code

fs.writeFileSync("dist/popupable-vue.min.js", banner + minifiedJs)

console.log("Built popupable-vue v" + version)
