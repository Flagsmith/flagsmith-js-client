const path = require("path")
const fs = require("fs")
const fsExtra = require('fs-extra')

// Copy source files to lib/flagsmith/src
fs.copyFileSync(path.join(__dirname,"index.ts"),path.join(__dirname,"lib/flagsmith/src/index.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/flagsmith/src/flagsmith-core.ts"))
fs.copyFileSync(path.join(__dirname,"next-middleware.ts"),path.join(__dirname,"lib/flagsmith/src/next-middleware.ts"))
fs.copyFileSync(path.join(__dirname,"isomorphic.ts"),path.join(__dirname,"lib/flagsmith/src/isomorphic.ts"))
fs.copyFileSync(path.join(__dirname,"react.tsx"),path.join(__dirname,"lib/flagsmith/src/react.tsx"))
fs.copyFileSync(path.join(__dirname,"react.tsx"),path.join(__dirname,"lib/react-native-flagsmith/src/react.tsx"))
fs.copyFileSync(path.join(__dirname,"react.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/react.d.ts"))
fs.copyFileSync(path.join(__dirname,"react.d.ts"),path.join(__dirname,"lib/flagsmith/react.d.ts"))
fs.copyFileSync(path.join(__dirname,"index.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/index.d.ts"))
fs.copyFileSync(path.join(__dirname,"index.d.ts"),path.join(__dirname,"lib/flagsmith/index.d.ts"))

// Copy source files to lib/react-native-flagsmith/src
fs.copyFileSync(path.join(__dirname,"index.react-native.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/index.react-native.ts"))
fs.copyFileSync(path.join(__dirname,"flagsmith-core.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/flagsmith-core.ts"))

const files= fs.readdirSync(path.join(__dirname, "lib/flagsmith"));
files.forEach((fileName)=>{
    console.log(fileName)
    if (fileName.endsWith(".d.ts")) {
        fs.copyFileSync(path.join(__dirname, "lib/flagsmith",fileName),path.join(__dirname, "lib/flagsmith/src",fileName))
    }
})

// copy types.d
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith/src/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/src/types.d.ts"))

fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/flagsmith/types.d.ts"))
fs.copyFileSync(path.join(__dirname,"types.d.ts"),path.join(__dirname,"lib/react-native-flagsmith/types.d.ts"))

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
    fs.rmdirSync(path.join(__dirname,"lib/react-native-flagsmith/test"), {recursive:true})
} catch (e){}



function syncFolders(src, dest) {
    try {
        // Ensure the destination folder exists
        fsExtra.ensureDirSync(dest);

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isFile()) {
                // Copy only files to the destination, overwriting existing files
                fs.copyFileSync(srcPath, destPath);
            }
        }

        console.log('Folders synchronized successfully!', src, dest);
    } catch (err) {
        console.error('Error synchronizing folders:', err);
    }
}

syncFolders(path.join(__dirname,'utils'),path.join(__dirname,'lib/flagsmith/src/utils'))
syncFolders(path.join(__dirname,'utils'),path.join(__dirname,'lib/react-native-flagsmith/src/utils'))
