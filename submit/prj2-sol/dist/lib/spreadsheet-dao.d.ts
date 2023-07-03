import { Result } from 'cs544-js-utils';
import * as mongo from 'mongodb';
/** All that this DAO should do is maintain a persistent map from
 *  [spreadsheetName, cellId] to an expression string.
 *
 *  Most routines return an errResult with code set to 'DB' if
 *  a database error occurs.
 */
/** return a DAO for spreadsheet ssName at URL mongodbUrl */
export declare function makeSpreadsheetDao(mongodbUrl: string, ssName: string): Promise<Result<SpreadsheetDao>>;
export declare class SpreadsheetDao {
    private client;
    private db;
    private collection;
    constructor(client: mongo.MongoClient, db: mongo.Db, collection: mongo.Collection);
    static make(dbUrl: string, ssName: string): Promise<Result<SpreadsheetDao>>;
    /** Release all resources held by persistent spreadsheet.
     *  Specifically, close any database connections.
     */
    close(): Promise<Result<undefined>>;
    /** Return name of this spreadsheet */
    getSpreadsheetName(): string;
    /** Set cell with id cellId to string expr. */
    setCellExpr(cellId: string, expr: string): Promise<Result<undefined>>;
    /** Return expr for cell cellId; return '' for an empty/unknown cell. */
    query(cellId: string): Promise<Result<string>>;
    /** Clear contents of this spreadsheet */
    clear(): Promise<Result<undefined>>;
    /** Remove all info for cellId from this spreadsheet. */
    remove(cellId: string): Promise<Result<undefined>>;
    /** Return array of [ cellId, expr ] pairs for all cells in this spreadsheet */
    getData(): Promise<Result<[string, string][]>>;
}
//# sourceMappingURL=spreadsheet-dao.d.ts.map