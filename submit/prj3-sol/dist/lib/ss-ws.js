import cors from 'cors';
import Express from 'express';
import STATUS from 'http-status';
import { Err } from 'cs544-js-utils';
export function makeApp(ssServices, base = '/api') {
    const app = Express();
    app.locals.ssServices = ssServices;
    app.locals.base = base;
    setupRoutes(app);
    return app;
}
/******************************** Routing ******************************/
const CORS_OPTIONS = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: 'Location',
};
function setupRoutes(app) {
    const base = app.locals.base;
    app.use(cors(CORS_OPTIONS)); //will be explained towards end of course
    app.use(Express.json()); //all request bodies parsed as JSON.
    //routes for individual cells
    app.get(`${base}/:ssName/:cellId`, getCellHandler);
    app.patch(`${base}/:ssName/:cellId`, setCellHandler);
    app.patch(`${base}/:ssName/:cellId`, copyCellHandler);
    app.delete(`${base}/:ssName/:cellId`, deleteCellHandler);
    //routes for entire spreadsheets
    app.delete(`${base}/:ssName`, clearSpreadsheetHandler);
    app.put(`${base}/:ssName`, loadSpreadsheetHandler);
    app.get(`${base}/:ssName`, getSpreadsheetHandler);
    //generic handlers: must be last
    app.use(make404Handler(app));
    app.use(makeErrorsHandler(app));
}
/* A handler can be created by calling a function typically structured as
   follows:

   function makeOPHandler(app: Express.Application) {
     return async function(req: Express.Request, res: Express.Response) {
       try {
         const { ROUTE_PARAM1, ... } = req.params; //if needed
         const { QUERY_PARAM1, ... } = req.query;  //if needed
     VALIDATE_IF_NECESSARY();
     const SOME_RESULT = await app.locals.ssServices.OP(...);
     if (!SOME_RESULT.isOk) throw SOME_RESULT;
         res.json(selfResult(req, SOME_RESULT.val));
       }
       catch(err) {
         const mapped = mapResultErrors(err);
         res.status(mapped.status).json(mapped);
       }
     };
   }
*/
/****************** Handlers for Spreadsheet Cells *********************/
async function getCellHandler(req, res) {
    try {
        const { ssName, cellId } = req.params;
        const result = await req.app.locals.ssServices.getCell(ssName, cellId);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
async function setCellHandler(req, res) {
    try {
        const { ssName, cellId } = req.params;
        const { expr } = req.query;
        const result = await req.app.locals.ssServices.setCell(ssName, cellId, expr);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
async function copyCellHandler(req, res) {
    try {
        const { ssName, cellId } = req.params;
        const { srcCellId } = req.query;
        const result = await req.app.locals.ssServices.copyCell(ssName, cellId, srcCellId);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
async function deleteCellHandler(req, res) {
    try {
        const { ssName, cellId } = req.params;
        const result = await req.app.locals.ssServices.deleteCell(ssName, cellId);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
/**************** Handlers for Complete Spreadsheets *******************/
async function clearSpreadsheetHandler(req, res) {
    try {
        const { ssName } = req.params;
        const result = await req.app.locals.ssServices.clearSpreadsheet(ssName);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result, STATUS.OK));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
async function loadSpreadsheetHandler(req, res) {
    try {
        const { ssName } = req.params;
        const { body } = req;
        const result = await req.app.locals.ssServices.loadSpreadsheet(ssName, body);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result, STATUS.OK));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
async function getSpreadsheetHandler(req, res) {
    try {
        const { ssName } = req.params;
        const result = await req.app.locals.ssServices.getSpreadsheet(ssName);
        if (!result.isOk)
            throw result;
        res.json(selfResult(req, result.result));
    }
    catch (err) {
        const mapped = mapResultErrors(err);
        res.status(mapped.status).json(mapped);
    }
}
/*************************** Generic Handlers **************************/
/** Default handler for when there is no route for a particular method
 *  and path.
  */
function make404Handler(app) {
    return async function (req, res) {
        const message = `${req.method} not supported for ${req.originalUrl}`;
        const result = {
            status: STATUS.NOT_FOUND,
            errors: [{ options: { code: 'NOT_FOUND' }, message, },],
        };
        res.status(404).json(result);
    };
}
/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */
function makeErrorsHandler(app) {
    return async function (err, req, res, next) {
        const message = err.message ?? err.toString();
        const result = {
            status: STATUS.INTERNAL_SERVER_ERROR,
            errors: [{ options: { code: 'INTERNAL' }, message }],
        };
        res.status(STATUS.INTERNAL_SERVER_ERROR).json(result);
        console.error(result.errors);
    };
}
/************************* HATEOAS Utilities ***************************/
/** Return original URL for req */
function requestUrl(req) {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}
function selfHref(req, id = '') {
    const url = new URL(requestUrl(req));
    return url.pathname + (id ? `/${id}` : url.search);
}
function selfResult(req, result, status = STATUS.OK) {
    return { isOk: true,
        status,
        links: { self: { href: selfHref(req), method: req.method } },
        result,
    };
}
/*************************** Mapping Errors ****************************/
//map from domain errors to HTTP status codes.  If not mentioned in
//this map, an unknown error will have HTTP status BAD_REQUEST.
const ERROR_MAP = {
    EXISTS: STATUS.CONFLICT,
    NOT_FOUND: STATUS.NOT_FOUND,
    BAD_REQ: STATUS.BAD_REQUEST,
    AUTH: STATUS.UNAUTHORIZED,
    DB: STATUS.INTERNAL_SERVER_ERROR,
    INTERNAL: STATUS.INTERNAL_SERVER_ERROR,
};
/** Return first status corresponding to first options.code in
 *  errors, but SERVER_ERROR dominates other statuses.  Returns
 *  BAD_REQUEST if no code found.
 */
function getHttpStatus(errors) {
    let status = 0;
    for (const err of errors) {
        if (err instanceof Err) {
            const code = err?.options?.code;
            const errStatus = (code !== undefined) ? ERROR_MAP[code] : -1;
            if (errStatus > 0 && status === 0)
                status = errStatus;
            if (errStatus === STATUS.INTERNAL_SERVER_ERROR)
                status = errStatus;
        }
    }
    return status !== 0 ? status : STATUS.BAD_REQUEST;
}
/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapResultErrors(err) {
    const errors = (err instanceof Error)
        ? [new Err(err.message ?? err.toString(), { code: 'UNKNOWN' }),]
        : err.errors;
    const status = getHttpStatus(errors);
    if (status === STATUS.SERVER_ERROR)
        console.error(errors);
    return { isOk: false, status, errors, };
}
//# sourceMappingURL=ss-ws.js.map