const path = require("path")
const fs = require("fs")

const replaceInFileSync = (file,from,to) => {
    const data = fs.readFileSync(file, 'utf8');
    const newData = data.replace(from, to)
    fs.writeFileSync(file, newData, {encoding:"utf8"})
}

fs.rmSync(path.join(__dirname,"lib/flagsmith/react/flagsmith-core.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/react/flagsmith-core.d.ts"))

fs.rmSync(path.join(__dirname,"lib/flagsmith/react/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/react/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"lib/flagsmith/react/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/react/isomorphic-es.d.ts"))


fs.renameSync(path.join(__dirname,"lib/flagsmith/react/react/index.d.ts"), path.join(__dirname,"flagsmith/react/index.d.ts"))
fs.renameSync(path.join(__dirname,"lib/flagsmith-es/react/react/index.d.ts"), path.join(__dirname,"flagsmith-es/react/index.d.ts"))

fs.rmdirSync(path.join(__dirname,"lib/flagsmith/react/react"), {recursive:true})
fs.rmdirSync(path.join(__dirname,"lib/flagsmith-es/react/react"), {recursive:true})

fs.rmSync(path.join(__dirname,"lib/flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"lib/flagsmith/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/flagsmith-es/isomorphic-es.d.ts"))

fs.rmSync(path.join(__dirname,"lib/react-native-flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"lib/react-native-flagsmith/isomorphic-es.d.ts"))

// fix react sourcemap
fs.copyFileSync(path.join(__dirname,"react/index.tsx"),path.join(__dirname,"lib/flagsmith/react/src/index.tsx"))
replaceInFileSync(path.join(__dirname, "lib/flagsmith/react/index.js.map"),"../../../react/index.tsx","./src/index.tsx"  )

// fix flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.ts"),path.join(__dirname,"lib/flagsmith/src/index.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith/src/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../index.ts","./src/index.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
fs.copyFileSync(path.join(__dirname,"isomorphic.ts"),path.join(__dirname,"lib/flagsmith/src/isomorphic.ts"))

// fix react-native-flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.react-native.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/index.react-native.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../index.react-native.ts","./src/index.react-native.ts"  )
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../../flagsmith-core.ts","./src/flagsmith-core.ts"  )


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

// fix flagsmith-es react sourcemap
fs.copyFileSync(path.join(__dirname,"react/index.tsx"),path.join(__dirname,"lib/flagsmith-es/react/src/index.tsx"))
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/react/index.js.map"),"../../../react/index.tsx","./src/index.tsx"  )

fs.rmdirSync(path.join(__dirname, "lib/flagsmith", 'react-native-flagsmith'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/flagsmith", 'react/react-native-flagsmith'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/flagsmith-es", 'react/react-native-flagsmith'),{recursive:true})
fs.rmSync(path.join(__dirname, "lib/flagsmith", 'react/next-middleware.d.ts'))
fs.rmdirSync(path.join(__dirname, "lib/flagsmith", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/flagsmith/react", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/flagsmith-es/react", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/react-native-flagsmith", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "lib/react-native-flagsmith", 'react-native-flagsmith'),{recursive:true})
