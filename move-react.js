const path = require("path")
const fs = require("fs")

fs.rmSync(path.join(__dirname,"flagsmith/react/flagsmith-core.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/flagsmith-core.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/react/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/react/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/isomorphic-es.d.ts"))


fs.renameSync(path.join(__dirname,"flagsmith/react/react/index.d.ts"), path.join(__dirname,"flagsmith/react/index.d.ts"))
fs.renameSync(path.join(__dirname,"flagsmith-es/react/react/index.d.ts"), path.join(__dirname,"flagsmith-es/react/index.d.ts"))

fs.rmdirSync(path.join(__dirname,"flagsmith/react/react"))
fs.rmdirSync(path.join(__dirname,"flagsmith-es/react/react"))

fs.rmSync(path.join(__dirname,"flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/isomorphic-es.d.ts"))

fs.rmSync(path.join(__dirname,"react-native-flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"react-native-flagsmith/isomorphic-es.d.ts"))

