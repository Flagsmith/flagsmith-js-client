import {Router} from "https://deno.land/x/oak/mod.ts";
import bulletTrain from './bullet-train.ts';

const router = new Router();
router
    .get("/", context => {
        context.response.body = bulletTrain.getValue("hello_response") || "Create a remote config called hello_response to see this message change";
    })
    .post("/webhook", context => {
        bulletTrain.getFlags();
        context.response.body = "OK";
    });

export default router;
