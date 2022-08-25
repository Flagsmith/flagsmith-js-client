const path = require("path")
const fs = require("fs")

const replaceInFileSync = (file,from,to) => {
    const data = fs.readFileSync(file, 'utf8');
    const newData = data.replace(from, to)
    fs.writeFileSync(file, newData, {encoding:"utf8"})
}

fs.rmSync(path.join(__dirname,"flagsmith/react/flagsmith-core.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/flagsmith-core.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/react/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/react/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/react/isomorphic-es.d.ts"))


fs.renameSync(path.join(__dirname,"flagsmith/react/react/index.d.ts"), path.join(__dirname,"flagsmith/react/index.d.ts"))
fs.renameSync(path.join(__dirname,"flagsmith-es/react/react/index.d.ts"), path.join(__dirname,"flagsmith-es/react/index.d.ts"))

fs.rmdirSync(path.join(__dirname,"flagsmith/react/react"), {recursive:true})
fs.rmdirSync(path.join(__dirname,"flagsmith-es/react/react"), {recursive:true})

fs.rmSync(path.join(__dirname,"flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/index-es.d.ts"))

fs.rmSync(path.join(__dirname,"flagsmith/isomorphic-es.d.ts"))
fs.rmSync(path.join(__dirname,"flagsmith-es/isomorphic-es.d.ts"))

fs.rmSync(path.join(__dirname,"react-native-flagsmith/index-es.d.ts"))
fs.rmSync(path.join(__dirname,"react-native-flagsmith/isomorphic-es.d.ts"))

// fix react sourcemap
fs.copyFileSync(path.join(__dirname,"react/index.tsx"),path.join(__dirname,"flagsmith/react/index.tsx"))
replaceInFileSync(path.join(__dirname, "flagsmith/react/index.js.map"),"../../../react/index.tsx","./index.tsx"  )

// fix flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.ts"),path.join(__dirname,"flagsmith/index.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"flagsmith/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "flagsmith/index.js.map"),"../../index.ts","./index.ts"  )
replaceInFileSync(path.join(__dirname, "flagsmith/index.js.map"),"../../flagsmith-core.ts","./flagsmith-core.ts"  )
fs.copyFileSync(path.join(__dirname,"isomorphic.ts"),path.join(__dirname,"flagsmith/isomorphic.ts"))

// fix react-native-flagsmith sourcemap
fs.copyFileSync(path.join(__dirname,"index.react-native.ts"),path.join(__dirname,"react-native-flagsmith/index.react-native.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"react-native-flagsmith/flagsmith-core.ts"))
replaceInFileSync(path.join(__dirname, "react-native-flagsmith/index.js.map"),"../index.react-native.ts","./index.react-native.ts"  )
replaceInFileSync(path.join(__dirname, "react-native-flagsmith/index.js.map"),"../../flagsmith-core.ts","./flagsmith-core.ts"  )


// fix flagsmith isomorphic sourcemap
replaceInFileSync(path.join(__dirname, "flagsmith/isomorphic.js.map"),"../../isomorphic.ts","./isomorphic.ts"  )
replaceInFileSync(path.join(__dirname, "flagsmith/isomorphic.js.map"),"../../flagsmith-core.ts","./flagsmith-core.ts"  )

// fix flagsmith es sourcemap
fs.copyFileSync(path.join(__dirname,"index-es.ts"),path.join(__dirname,"flagsmith-es/index-es.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"flagsmith-es/flagsmith-core.ts"))
fs.copyFileSync(path.join(__dirname,"isomorphic-es.ts"),path.join(__dirname,"flagsmith-es/isomorphic-es.ts"))

replaceInFileSync(path.join(__dirname, "flagsmith-es/index.js.map"),"../../index-es.ts","./index-es.ts"  )
replaceInFileSync(path.join(__dirname, "flagsmith-es/index.js.map"),"../../flagsmith-core.ts","./flagsmith-core.ts"  )

// fix flagsmith-es isomorphic sourcemap
replaceInFileSync(path.join(__dirname, "flagsmith-es/isomorphic.js.map"),"../../isomorphic-es.ts","./isomorphic-es.ts"  )
replaceInFileSync(path.join(__dirname, "flagsmith-es/isomorphic.js.map"),"../../flagsmith-core.ts","./flagsmith-core.ts"  )

// fix flagsmith-es react sourcemap
fs.copyFileSync(path.join(__dirname,"react/index.tsx"),path.join(__dirname,"flagsmith-es/react/index.tsx"))
replaceInFileSync(path.join(__dirname, "flagsmith-es/react/index.js.map"),"../../../react/index.tsx","./index.tsx"  )

fs.rmdirSync(path.join(__dirname, "flagsmith-es", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "flagsmith", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "flagsmith/react", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "flagsmith-es/react", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "react-native-flagsmith", 'flagsmith-es'),{recursive:true})
fs.rmdirSync(path.join(__dirname, "react-native-flagsmith", 'react-native-flagsmith'),{recursive:true})
