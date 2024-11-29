const path = require("path")
const fs = require("fs")

const replaceInFileSync = (file,from,to) => {
    const data = fs.readFileSync(file, 'utf8');
    const newData = data.replace(from, to)
    fs.writeFileSync(file, newData, {encoding:"utf8"})
}

// Copy source files to lib/flagsmith/src
fs.copyFileSync(path.join(__dirname,"index.ts"),path.join(__dirname,"lib/flagsmith/src/index.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith/src/flagsmith-core.ts"))
fs.copyFileSync(path.join(__dirname,"next-middleware.ts"),path.join(__dirname,"lib/flagsmith/src/next-middleware.ts"))
fs.copyFileSync(path.join(__dirname,"isomorphic.ts"),path.join(__dirname,"lib/flagsmith/src/isomorphic.ts"))
fs.copyFileSync(path.join(__dirname,"react.tsx"),path.join(__dirname,"lib/flagsmith/src/react.tsx"))
fs.copyFileSync(path.join(__dirname,"react.tsx"),path.join(__dirname,"lib/react-native-flagsmith/src/react.tsx"))
fs.copyFileSync(path.join(__dirname,"react.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/react.d.ts"))
fs.copyFileSync(path.join(__dirname,"react.d.ts"),path.join(__dirname,"lib/flagsmith/react.d.ts"))
fs.copyFileSync(path.join(__dirname,"react.d.ts"),path.join(__dirname,"lib/flagsmith-es/react.d.ts"))
fs.copyFileSync(path.join(__dirname,"index.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/index.d.ts"))
fs.copyFileSync(path.join(__dirname,"index.d.ts"),path.join(__dirname,"lib/flagsmith/index.d.ts"))
fs.copyFileSync(path.join(__dirname,"index.d.ts"),path.join(__dirname,"lib/flagsmith-es/index.d.ts"))

// Copy source files to lib/react-native-flagsmith/src
fs.copyFileSync(path.join(__dirname,"index.react-native.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/index.react-native.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/flagsmith-core.ts"))

// fix flagsmith es sourcemap
fs.copyFileSync(path.join(__dirname,"index-es.ts"),path.join(__dirname,"lib/flagsmith-es/src/index-es.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith-es/src/flagsmith-core.ts"))
fs.copyFileSync(path.join(__dirname,"isomorphic-es.ts"),path.join(__dirname,"lib/flagsmith-es/src/isomorphic-es.ts"))






const files= fs.readdirSync(path.join(__dirname, "lib/flagsmith"));
files.forEach((fileName)=>{
    console.log(fileName)
    if (fileName.endsWith(".d.ts")) {
        fs.copyFileSync(path.join(__dirname, "lib/flagsmith",fileName),path.join(__dirname, "lib/flagsmith/src",fileName))
    }
})

// fix paths in flagsmith/index.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/index.js.map"),"../../../index.ts","./src/index.ts"  )

// fix paths in flagsmith-es/index.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/index.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/index.js.map"),"../../../index-es.ts","./src/index-es.ts"  )

// fix paths in flagsmith/next-middleware.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith/next-middleware.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/next-middleware.js.map"),"../../../next-middleware.ts","./src/next-middleware.ts"  )

// fix paths in flagsmith-es/next-middleware.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/next-middleware.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/next-middleware.js.map"),"../../../next-middleware.ts","./src/next-middleware.ts"  )

// fix paths in flagsmith/isomorphic.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith/isomorphic.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith/isomorphic.js.map"),"../../../isomorphic.ts","./src/isomorphic.ts"  )

// fix paths in flagsmith-es/isomorphic.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/isomorphic.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/isomorphic.js.map"),"../../../isomorphic-es.ts","./src/isomorphic-es.ts"  )

// fix paths in react-native-flagsmith/index.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../../../flagsmith-core.ts","./src/flagsmith-core.ts"  )
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/index.js.map"),"../../index.react-native.ts","./src/index.react-native.ts"  )


// fix paths in flagsmith/react.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith/react.js.map"),"../../../react.tsx","./src/react.tsx"  )
replaceInFileSync(path.join(__dirname, "lib/react-native-flagsmith/react.js.map"),"../../../react.tsx","./src/react.tsx"  )

// fix paths in flagsmith-es/react.js sourcemaps
replaceInFileSync(path.join(__dirname, "lib/flagsmith-es/react.js.map"),"../../../react.tsx","./src/react.tsx"  )


// copy types.d
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith/src/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith-es/src/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/types.d.ts"))

fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith-es/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/types.d.ts"))


//Rollup can't ignore lib d.ts files
try {
    fs.rmdirSync(path.join(__dirname,"lib/flagsmith-es/lib"), {recursive:true})
} catch (e){}
try {
    fs.rmdirSync(path.join(__dirname,"lib/flagsmith/lib"), {recursive:true})
} catch (e){}
try {
    fs.rmdirSync(path.join(__dirname,"lib/react-native-flagsmith/lib"), {recursive:true})
} catch (e){}


try {
    fs.rmdirSync(path.join(__dirname,"lib/flagsmith/test"), {recursive:true})
} catch (e){}
try {
    fs.rmdirSync(path.join(__dirname,"lib/flagsmith-es/test"), {recursive:true})
} catch (e){}
try {
    fs.rmdirSync(path.join(__dirname,"lib/react-native-flagsmith/test"), {recursive:true})
} catch (e){}
