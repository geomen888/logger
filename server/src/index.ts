import "reflect-metadata";

import { createKoaServer  } from "routing-controllers";

// create Koa server
const koa = createKoaServer({
    controllers: [__dirname + "/routing/controllers/*{.js,.ts}"],
    cors: true, // register controllers routes in our express app
});

koa.listen(9003); // run koa app

console.log("Koa server is running on port 9003. Open http://localhost:9003/");
