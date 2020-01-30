import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { LogCsvRow } from "./../types";

export type UserCallback = (err: Error | null, trans?:Transaction) => void;


@Entity()
export class Transaction implements LogCsvRow {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    cardHolderNumberHash: string;
    
    @Column()
    datetime: Date;

    @Column()
    amount: number;

    static findByParams(id: number, cardHolderNumberHash: string, datetime: Date, amount: number, cb: UserCallback): void {
        setImmediate(() => {
            cb(null, new Transaction(id, cardHolderNumberHash, datetime, amount));
        });
    }
    
    constructor(id: number, cardHolderNumberHash: string, datetime: Date, amount: number)  {
        this.id = id;
        this.cardHolderNumberHash = cardHolderNumberHash;
        this.datetime = datetime;
        this.amount = amount;
    }
    
}