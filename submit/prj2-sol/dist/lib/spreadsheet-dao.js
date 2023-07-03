import { okResult, errResult } from 'cs544-js-utils';
import * as mongo from 'mongodb';
/** All that this DAO should do is maintain a persistent map from
 *  [spreadsheetName, cellId] to an expression string.
 *
 *  Most routines return an errResult with code set to 'DB' if
 *  a database error occurs.
 */
/** return a DAO for spreadsheet ssName at URL mongodbUrl */
export async function makeSpreadsheetDao(mongodbUrl, ssName) {
    return SpreadsheetDao.make(mongodbUrl, ssName);
}
export class SpreadsheetDao {
    client;
    db;
    collection;
    constructor(client, db, collection) {
        this.client = client;
        this.db = db;
        this.collection = collection;
    }
    // Factory method
    static async make(dbUrl, ssName) {
        try {
            const client = await mongo.MongoClient.connect(dbUrl);
            const db = client.db(ssName);
            const collection = db.collection('cells');
            return okResult(new SpreadsheetDao(client, db, collection));
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Release all resources held by persistent spreadsheet.
     *  Specifically, close any database connections.
     */
    async close() {
        try {
            await this.client.close();
            return okResult(undefined);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Return name of this spreadsheet */
    getSpreadsheetName() {
        return this.db.databaseName;
    }
    /** Set cell with id cellId to string expr. */
    async setCellExpr(cellId, expr) {
        try {
            const filter = { _id: new mongo.ObjectId(cellId) };
            await this.collection.updateOne(filter, { $set: { expr } }, { upsert: true });
            return okResult(undefined);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Return expr for cell cellId; return '' for an empty/unknown cell. */
    async query(cellId) {
        try {
            const filter = { _id: new mongo.ObjectId(cellId) };
            const result = await this.collection.findOne(filter);
            const expr = result ? result.expr : '';
            return okResult(expr);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Clear contents of this spreadsheet */
    async clear() {
        try {
            await this.collection.deleteMany({});
            return okResult(undefined);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Remove all info for cellId from this spreadsheet. */
    async remove(cellId) {
        try {
            const filter = { _id: new mongo.ObjectId(cellId) };
            await this.collection.deleteOne(filter);
            return okResult(undefined);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
    /** Return array of [ cellId, expr ] pairs for all cells in this spreadsheet */
    async getData() {
        try {
            const data = await this.collection.find().toArray();
            const cellData = data.map((item) => [item._id, item.expr]);
            return okResult(cellData);
        }
        catch (error) {
            return errResult('DB', error.message);
        }
    }
}
//# sourceMappingURL=spreadsheet-dao.js.map