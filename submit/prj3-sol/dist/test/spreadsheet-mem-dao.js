import { makeSpreadsheetDao, } from 'cs544-prj2-sol';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { assert } from 'chai';
;
export default class MemSpreadsheetDao {
    static async setup() {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        assert(mongod.instanceInfo, `mongo memory server startup failed`);
        const daoResult = await makeSpreadsheetDao(uri);
        assert(daoResult.isOk === true);
        const dao = daoResult.val;
        dao.mongod = mongod;
        return dao;
    }
    static async tearDown(dao) {
        await dao.close();
        const mongod = dao.mongod;
        await mongod.stop();
        assert(mongod.instanceInfo === undefined, `mongo memory server stop failed`);
    }
}
//# sourceMappingURL=spreadsheet-mem-dao.js.map