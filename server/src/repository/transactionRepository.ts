"use strict";
import { EntityManager, Repository, Entity } from "typeorm";
import { Service } from "typedi";
import * as csv from "fast-csv";
import { parse } from '@fast-csv/parse';
import * as async from "async";
import { getPath, removeNL } from "./../services";
import { Transaction } from "../entity/transaction";
import { InjectRepository, InjectManager } from "typeorm-typedi-extensions";
import { IRepository, LogCsvRow, LogCsvRowT } from "../types";

const autoBind = require("auto-bind"),
    path = require("path"),
    R = require("ramda"),
    regEx = new RegExp("\\n"),
    { StringDecoder } = require('string_decoder'),
    decoder = new StringDecoder('utf8'),
    fs = require('mz/fs');
    


@Service("transaction:rep")
export class TransActionRepository implements IRepository {

    @InjectManager()
    private entityManager: EntityManager;

    constructor(@InjectRepository(Transaction) private InjectRepository: Repository<Transaction>) {
        autoBind(this);

    }

    async saveTransactionManager(file: any) {
        const { entityManager, InjectRepository } = this,
        pathToFileFolder = getPath(file);
        let buffer: LogCsvRow[] = [],
        headers: string[]=[],
            counter = 0;
        return await new Promise((resolve, reject) => {
            let stream = fs.createReadStream(pathToFileFolder)
                .pipe(parse<LogCsvRowT, LogCsvRowT>({ headers: ["id", "cardHolderNumberHash", "datetime", "amount"], strictColumnHandling: true }))
                .pipe(csv.format<LogCsvRowT, LogCsvRow>({ headers: true }))
                .on("error", reject)
                .on("data", async (doc:Buffer) => {
                    stream.pause();
                   // console.log("doc:", decoder.write(doc));

                    if (counter === 1) {
                        headers = R.split(",", decoder.write(doc));
                        stream.resume();
                        counter = 1;
                        console.log("headers", headers)
                       
                    } else if (counter > 1) {
                        const payl = R.compose(R.evolve({ amount: (int) => parseInt(int, 10) }), R.fromPairs, R.tap(X => console.log("Trimdoc:", JSON.stringify(X))), R.map(R.map(removeNL)))(R.transpose([headers, decoder.write(doc).split(',')]));
                        buffer.push(payl);
                        console.log("doc:", JSON.stringify(payl));

                    }
                    counter++;
                    // console.log("doc:datetime:", typeof doc.datetime);
                    if (counter > 100) {
                        await async.mapSeries(buffer, (payload, cb) => {
                            Transaction.executeByParams(payload, (err, transLog) => {
                                if (err) {
                                    return cb(err);
                                }
                                if (!transLog) {
                                    return cb(new Error("not valid user, pre-save"));
                                }
                                // return cb(null, entityManager.save(transLog));
                                InjectRepository.findOne({cardHolderNumberHash: transLog.cardHolderNumberHash}).then((res:any) =>{
                                    console.log("transLog:InjectRepository:", JSON.stringify(res));
                                    const { cardHolderNumberHash: hash } = res;
                                    if (hash !== transLog.cardHolderNumberHash) {
                                        entityManager.save(transLog).then(result => {
                                            cb(null, result)
                                          },
                                          error => {
                                              cb(error);
                                          });  
                                    }
                                }) 
                            });
                        }, function (err, result) {
                            if (err) {
                                console.error("result:count>100:", err)
                                stream.destroy(err);
                                reject(err);
                                return;
                            }
                            buffer = [];
                            counter = 0;
                            console.info("result:count>100:", result);
                            
                        });
                    }
                    stream.resume();
                })
                .on('data-invalid', (row, rowNumber) => {
                    console.warn(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`);
                    reject(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`);
                })
                .on("end", async () => {
                   // console.info("result:end:counter :", counter );
                    await counter > 1
                     ? async.mapSeries(buffer, (payload, cb) => {
                        Transaction.executeByParams(payload, (err, transLog) => {
                            if (err) {
                                return cb(err);
                            }
                            if (!transLog) {
                                return cb(new Error("not valid user, pre-save"));
                            }
                            console.log("transLog:end:", JSON.stringify(transLog, null, 2));
                            InjectRepository.findOneOrFail({cardHolderNumberHash: transLog.cardHolderNumberHash}).then(res => {
                                if(!res) {
                                    cb(null, "N/A")

                                    return;

                                }
                                console.log("transLog:end:InjectRepository:", JSON.stringify(res));
                                const { cardHolderNumberHash: hash } = res;
                                if (hash !== transLog.cardHolderNumberHash) {
                                   return entityManager.save(transLog).then(result => {
                                        cb(null, result)
                                      },
                                      error => {
                                          cb(error);
                                      });  
                                }

                                cb(null, "duplicate")

                            }).catch(error => {
                                cb(error);
                            })
                          
                        });
                    }, function (err, result) {
                        if (err) {
                            console.error("result:end: error", err)
                            stream.destroy(err);
                            reject(err);
                            return;
                        }
                        buffer = [];
                        counter = 0;
                        console.info("result:end:", result);
                        resolve();
                    })
                    : resolve();

                    
              });
        });
    }

    findAll() {
        return this.InjectRepository.find();
    }



}