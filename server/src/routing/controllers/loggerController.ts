import { JsonController, UploadedFile, Param, Body, Get, Ctx, Post, Put, Delete } from "routing-controllers";
import { Context } from "koa";
import { Container } from "typedi";
import { IRepository } from "../../types";
import { getPath, mimeTypes, reformateError, getErrorMsg } from "./../../services";
import * as _ from "partial-js";
import "./../../repository/transactionRepository";
const fs = require("fs"),
      R = require("ramda"),
    autoBind = require("auto-bind");


@JsonController()
export class TransactionController {
    protected transRep: IRepository;

    constructor() {
        this.transRep = Container.get<IRepository>("transaction:rep");
        autoBind(this);
    }

    @Get("/transactions")
    getAll(): any {
        const { transRep: { findAll } } = this;
        return findAll();
    }
   
    @Post("/file") // this.transRep.fileUploadOptions
    saveFile(@Ctx() ctx: Context, @UploadedFile("file") file: any) {
        const { transRep: { saveTransactionManager } } = this;
        // console.info(file);
        if (!R.contains(R.propOr("N/A","mimetype", file))(mimeTypes)) {
            ctx.response.status = 403;
            return {
                message: "Error mimetype file",
                code: 702,
            };

        }
        return _.go(file, _.callback((file, next) => {
            console.log("path:", getPath(file))
            fs.writeFile(getPath(file), file.buffer, (err: Error | null) => {
                if (err) {
                    console.error('uploadTransactions error:::', err);
                    next(err);
                    return;
                }
                console.log("The file was saved!", ctx.request);
                next(file);

            })

        }), async feed => {
            if (feed instanceof Error) {
                ctx.response.status = 401;
                return {
                    message: "Error read file",
                    code: 700,
                };
            }
            return await saveTransactionManager(feed)
                .then(() => {
                    return {
                        status:1,
                        data: {
                            filename: file.originalname,
                            size: file.size,
                            fieldname: file.fieldname
                        }
                    };


                })
                .catch((err) => {
                    console.error("saveTransactionManager:err:", err);
                   //  console.error("saveTransactionManager:err:reformateError", reformateError(err));
                    if (R.compose(R.has("code"), reformateError)(err)) {
                        // R.evolve({code: R.replace(/\W(\d*)/gmi, "$1")})(k)
                        ctx.response.status = 403;
                        return {
                            ...reformateError(err),
                            ...getErrorMsg(err)
                        };

                    } 
                        ctx.response.status = 501;
                        return {
                            message: "Error write to db",
                            code: 701,
                        };
                })

            })
    }

}