import { EntityManager, Repository } from "typeorm";
import { Service} from "typedi";
import { Transaction } from "../entity/transaction";
import { InjectRepository, InjectManager } from "typeorm-typedi-extensions";
import { IRepository } from "../types";

const autoBind = require("auto-bind");

@Service("transaction:rep")
export class TransActionRepository implements IRepository {

    // @InjectManager()
    // private entityManager: EntityManager;

    constructor(@InjectRepository(Transaction) private InjectRepository: Repository<Transaction>) {
        autoBind(this);

    }
    saveUsingRepository<Transaction>(log: Transaction)  {
        return this.InjectRepository.save(log);
    }

//    saveTransactionManager<Transaction>(log: Transaction) {
//         return this.entityManager.save(log);
//     }

    findAll() {
        return this.InjectRepository.find();
    }

   

}