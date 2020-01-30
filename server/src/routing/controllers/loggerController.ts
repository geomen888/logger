import {JsonController, UploadedFile, Param, Body, Get, Ctx, Post, Put, Delete} from "routing-controllers";
import { Context } from "koa";
import { Container } from "typedi";
import { IRepository } from "../../types";
import * as _ from "partial-js";
import "./../../repository/transactionRepository";
const fs = require("fs"),
 autoBind = require("auto-bind");


@JsonController()
export class TransactionController {
    protected transRep: IRepository;

    constructor() {
        this.transRep = Container.get<IRepository>("transaction:rep");
            autoBind(this);
    }

    @Get("/transactions")
    getAll(@Ctx() ctx: Context, next?: (err?: any) => any):any {
       return ;
    }

    @Post("/file") // this.transRep.fileUploadOptions
    saveFile(@Ctx() ctx: Context, @UploadedFile("file") file: any) {

return _.go(file, _.callback((file, next) => { 
    
    fs.writeFile(process.cwd() + `/uploadedFiles/${file.originalname}`, file.buffer, (err: Error) => {
    if(err) {
        console.error('uploadPhoto errerrerr:::', err);
        next(err);
        return; 
    }
    console.log("The file was saved!", ctx.request);
   next(file);

}) 

}), feed => {
    if (feed  instanceof Error) {
        ctx.response.status = 401;
        return {
            message: "Error write file"
        };
    }
    return {
        status: 1,
        data: { filename: file.originalname,
        size: file.size,
        fieldname: file.fieldname
       }
    };

})
       


        
    
    }




}