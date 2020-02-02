import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import {init} from './bullet-train.ts';
import router from './router.ts';

const start = async ()=> {
    await init();
    const app = new Application();
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen("127.0.0.1:8000");
};

start();
