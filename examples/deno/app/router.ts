import {Router} from "https://deno.land/x/oak/mod.ts";
import flagsmith from './bullet-train.ts';

const router = new Router();
router
    .get("/", context => {
        context.response.body = flagsmith.getValue("hello_response") || "Create a remote config called hello_response to see this message change";
    })
    .post("/webhook", context => {
        flagsmith.getFlags();
        context.response.body = "OK";
    });

export default router;
