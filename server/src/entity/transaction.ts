import {Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn, PrimaryColumn, Index } from "typeorm";
import { LogCsvRow } from "./../types";
import { removeNL } from "./../services";

export type UserCallback = (err: Error | null, trans?:Transaction) => void;
const autoBind = require("auto-bind");


@Entity()
@Index(["cardHolderNumberHash", "datetime"], { unique: true })
export class Transaction  {
    @PrimaryGeneratedColumn()
    id!: string;
  
    @ObjectIdColumn({ name: 'id' })
    _id!: string;
    
    @Column()
    cardHolderNumberHash: string;
    
    @Column()
    datetime: string;

    @Column()
    amount: number;

    static executeByParams({ id, cardHolderNumberHash, datetime, amount }:LogCsvRow, cb: UserCallback): void {
        setImmediate(() => {
            
            cb(null, new Transaction(id, cardHolderNumberHash, datetime, amount));
        });
    }
    
    constructor(id: string, cardHolderNumberHash: string, datetime: string, amount: number)  {
        if (id) {
        console.log("constructor:",removeNL(id).trim())
        this.id = removeNL(id).trim();
        this.cardHolderNumberHash = cardHolderNumberHash;
        this.datetime = datetime;
        this.amount = amount;
        }
        autoBind(this);
    }
    
}