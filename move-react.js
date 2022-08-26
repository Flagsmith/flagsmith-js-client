const path = require("path")
const fs = require("fs")

const replaceInFileSync = (file,from,to) => {
    const data = fs.readFileSync(file, 'utf8');
    const newData = data.replace(from, to)
    fs.writeFileSync(file, newData, {encoding:"utf8"})
}


fs.rmSync(path.join(__dirname,"lib/flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"lib/flagsmith/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/isomorphic-es.d.ts"))

fs.rmSync(path.join(__dirname,"lib/react-native-flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/react-native-flagsmith/isomorphic-es.d.ts"))


// fix flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.ts"),path.join(__dirname,"lib/flagsmith/src/index.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith/src/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../index.ts","./src/index.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
fs.copyFileSync(path.join(__dirname,"isomorphic.ts"),path.join(__dirname,"lib/flagsmith/src/isomorphic.ts"))
fs.copyFileSync(path.join(__dirname,"react.tsx"),path.join(__dirname,"lib/flagsmith/src/react.tsx"))

// fix react-native-flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.react-native.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/index.react-native.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../index.react-native.ts","./src/index.react-native.ts"  )
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )

replaceInFileSync(path.join(__dirname, "lib/flagsmith/react.js.map"),"../../../react.tsx","./src/react.tsx"  )

// fix flagsmith isomorphic sourcemap
replaceInFileSync(path.join(__dirname, "lib/flagsmith/isomorphic.js.map"),"../../isomorphic.ts","./src/isomorphic.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/isomorphic.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )

// fix flagsmith es sourcemap
fs.copyFileSync(path.join(__dirname,"index-es.ts"),path.join(__dirname,"lib/flagsmith-es/src/index-es.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith-es/src/flagsmith-core.ts"))
fs.copyFileSync(path.join(__dirname,"isomorphic-es.ts"),path.join(__dirname,"lib/flagsmith-es/src/isomorphic-es.ts"))

replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/index.js.map"),"../../index-es.ts","./src/index-es.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/index.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )

// fix flagsmith-es isomorphic sourcemap
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/isomorphic.js.map"),"../../isomorphic-es.ts","./src/isomorphic-es.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/isomorphic.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )






