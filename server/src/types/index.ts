import { type } from "os";

export interface IRepository {
    findAll(): Promise<any>;
    saveTransactionManager(file: any): Promise<any>;
    // removeAll(): Promise<void>;
}

export interface LogCsvRow {
    id: string;
    cardHolderNumberHash: string;
    datetime: string;
    amount: number;
}

export type LogCsvRowT = {
    id: string;
    cardHolderNumberHash: string;
    datetime: string;
    amount: string;
}
