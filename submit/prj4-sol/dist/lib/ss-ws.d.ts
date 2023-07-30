import { Result } from 'cs544-js-utils';
type Updates = {
    [cellId: string]: number;
};
export default class SpreadsheetWs {
    private readonly apiUrl;
    private constructor();
    static make(url: string): SpreadsheetWs;
    /** return { expr, value } object for cell cellId in
     *  spreadsheet ssName.
     */
    query(ssName: string, cellId: string): Promise<Result<{
        value: number;
        expr: string;
    }>>;
    /** remove formula for cell cellId in spreadsheet ssName.
     *  Return Updates object mapping cellId's to the updated value.
     */
    remove(ssName: string, cellId: string): Promise<Result<Updates>>;
    /** copy formula from cell srcCellId in spreadsheet ssName to
     *  cell destCellId.  Update relative references in the formula.
     *  If the formula is empty, then delete cell destCellId.
     *  Return Updates object mapping cellId's to the updated value.
     */
    copy(ssName: string, destCellId: string, srcCellId: string): Promise<Result<Updates>>;
    /** set formula for cell cellId in spreadsheet ssName to expr.
     *  Return Updates object mapping cellId's to the updated value.
     */
    evaluate(ssName: string, cellId: string, expr: string): Promise<Result<Updates>>;
    /** return list of [cellId, expr] pairs for spreadsheet ssName */
    dump(ssName: string): Promise<Result<[string, string][]>>;
    /** return list of [cellId, expr, value] triples for spreadsheet ssName */
    dumpWithValues(ssName: string): Promise<Result<[string, string, number][]>>;
    /** load spreadsheet ssName with dump of list of [ cellId, expr ]. */
    load(ssName: string, dump: [string, string][]): Promise<Result<undefined>>;
    /** clear out all contents of spreadsheet ssName */
    clear(ssName: string): Promise<Result<undefined>>;
}
export {};
//# sourceMappingURL=ss-ws.d.ts.map