
export interface IRepository {
    saveUsingRepository<T>(log:  T): Promise<T>;
    findAll(): any
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