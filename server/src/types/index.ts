
export interface IRepository {
    findAll(): Promise<any>;
    saveTransactionManager(file: any): Promise<any>;
}

export interface LogCsvRow {
    id: number;
    cardHolderNumberHash: string;
    datetime: Date;
    amount: number;
}

/**
 * fileUploadOptions: () => {
        options: () => {
            storage: any;
            fileFilter: (ctx: Context, file: any, cb: Function) => void;
            limits: {
                fieldNameSize: number;
                fileSize: number;
            };
        };
    }
 */