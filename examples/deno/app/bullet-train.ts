import BulletTrain
    from "https://gist.githubusercontent.com/kyle-ssg/ed6140ae5294b5d4dbe2c76db26dfb0a/raw/a54cf57bbb67195adda1c5489f6be4dd875d854e/bullet-train-deno.js"

const bulletTrain = BulletTrain({fetch, AsyncStorage: null});
export default bulletTrain;
export const init  = async function (){
    return await bulletTrain.init({
        environmentID: Deno.env("BULLET_TRAIN"),
        api: "https://api.bullet-train.io/api/v1/",
        onError: (err) => {},
        onChange: (err) => {},
        cacheFlags: false,
        preventFetch: false,
        enableLogs: false,
        AsyncStorage: null,
        defaultFlags: {},
        state: null
    });
}
