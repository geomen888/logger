import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    cardHolderNumberHash: string;
    
    @Column()
    datetime: Date;

    @Column()
    amount: number;
    
    constructor(id: number, cardHolderNumberHash: string, datetime: Date, amount: number)  {
        this.id = id;
        this.cardHolderNumberHash = cardHolderNumberHash;
        this.datetime = datetime;
        this.amount = amount;
    }
    
}