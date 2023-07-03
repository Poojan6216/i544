import { Result, okResult, errResult } from 'cs544-js-utils';
import * as mongo from 'mongodb';


const mongodbUrl = 'mongodb+srv://poojanpatel119:Poojan6216@ppatel17.waj9koq.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URL
const dbName = 'mydatabase'; 
const collectionName = 'mycollection'; 
export async function makeSpreadsheetDao(mongodbUrl: string, ssName: string): Promise<Result<SpreadsheetDao>> {
  return SpreadsheetDao.make(mongodbUrl, ssName);
}

export class SpreadsheetDao {
  private client: mongo.MongoClient;
  private db: mongo.Db;
  private collection: mongo.Collection;

  constructor(client: mongo.MongoClient, db: mongo.Db, collection: mongo.Collection) {
    this.client = client;
    this.db = db;
    this.collection = collection;
  }

  
  static async make(dbUrl: string, ssName: string): Promise<Result<SpreadsheetDao>> {
    try {
      const client = await mongo.MongoClient.connect(dbUrl);
      const db = client.db(ssName);
      const collection = db.collection('cells');
      return okResult(new SpreadsheetDao(client, db, collection));
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  
  async close(): Promise<Result<undefined>> {
    try {
      await this.client.close();
      return okResult(undefined);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  getSpreadsheetName(): string {
    return this.db.databaseName;
  }

  
  async setCellExpr(cellId: string, expr: string): Promise<Result<undefined>> {
    try {
      const filter: mongo.Filter<Document> = { _id: new mongo.ObjectId(cellId) };
      await this.collection.updateOne(filter, { $set: { expr } }, { upsert: true });
      return okResult(undefined);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  
  async query(cellId: string): Promise<Result<string>> {
    try {
      const filter: mongo.Filter<Document> = { _id: new mongo.ObjectId(cellId) };
      const result = await this.collection.findOne(filter);
      const expr = result ? result.expr : '';
      return okResult(expr);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  
  async clear(): Promise<Result<undefined>> {
    try {
      await this.collection.deleteMany({});
      return okResult(undefined);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  
  async remove(cellId: string): Promise<Result<undefined>> {
    try {
      const filter: mongo.Filter<Document> = { _id: new mongo.ObjectId(cellId) };
      await this.collection.deleteOne(filter);
      return okResult(undefined);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }

  
  async getData(): Promise<Result<[string, string][]>> {
    try {
      const data = await this.collection.find().toArray();
      const cellData: [string, string][] = data.map((item: { _id: any; expr: any; }) => [item._id, item.expr]);
      return okResult(cellData);
    } catch (error) {
      return errResult('DB', error.message);
    }
  }
}