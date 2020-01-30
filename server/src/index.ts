import "reflect-metadata";
import { createConnection, useContainer } from "typeorm";
import { createKoaServer } from "routing-controllers";
import { Container } from "typedi";


 useContainer(Container);


// create Koa server
 // run koa app


(async () => {
  
   await createConnection()
   .then(async connection => {
    console.log("connected MongoDb: OK");
    const koa = createKoaServer({
        routePrefix: "/api",
        controllers: [__dirname + "/routing/controllers/*{.js,.ts}"],
        cors: true, // register controllers routes in our express app
    });
    
    koa.listen(9005);
    console.log("Koa server is running on port 9005. Open http://localhost:9005/");

   })
   .catch(error => console.log("Error: ", error));
  
   
    
  })();