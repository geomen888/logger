import { EntityManager, Repository } from "typeorm";
import { Service } from "typedi";
import * as csv from "fast-csv";
import { Transaction } from "../entity/transaction";
import { InjectRepository, InjectManager } from "typeorm-typedi-extensions";
import { IRepository, LogCsvRow } from "../types";

const autoBind = require("auto-bind"),
    path = require("path"),
    fs = require('mz/fs');


@Service("transaction:rep")
export class TransActionRepository implements IRepository {

    @InjectManager()
    private entityManager: EntityManager;

    constructor(@InjectRepository(Transaction) private InjectRepository: Repository<Transaction>) {
        autoBind(this);

    }


    async saveTransactionManager(file: any) {

        const { entityManager } = this;


        return await new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(__dirname, '..', 'uploadedFiles', file.originalname))
                .pipe(csv.parse({ headers: true }))
                // pipe the parsed input into a csv formatter
                .pipe(
                    csv.format<LogCsvRow, LogCsvRow>({ headers: true }),
                )
                // Using the transform function from the formatting stream
                .transform((row, next): void => {
                    Transaction.findByParams(row.id, row.cardHolderNumberHash, row.datetime, row.amount, (err, transLog) => {
                        if (err) {
                            return next(err);
                        }
                        if (!transLog) {
                            return next(err);
                        }
                        return next(null, entityManager.save(transLog));
                    });
                })
                .pipe(process.stdout)
                .on('error', reject)
                .on('end', resolve);

        });

    }

    findAll() {
        return this.InjectRepository.find();
    }



}