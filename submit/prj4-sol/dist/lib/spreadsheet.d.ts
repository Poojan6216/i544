import SpreadsheetWs from './ss-ws.js';
export default function make(ws: SpreadsheetWs, ssName: string): Promise<Spreadsheet>;
declare class Spreadsheet {
    private readonly ws;
    private readonly ssName;
    private readonly errors;
    cellData: any;
    updateSpreadsheet: any;
    constructor(ws: SpreadsheetWs, ssName: string);
    static make(ws: SpreadsheetWs, ssName: string): Promise<Spreadsheet>;
    /** add listeners for different events on table elements */
    private addListeners;
    /** listener for a click event on #clear button */
    private readonly clearSpreadsheet;
    /** listener for a focus event on a spreadsheet data cell */
    private readonly focusCell;
    /** listener for a blur event on a spreadsheet data cell */
    private readonly blurCell;
    /** listener for a copy event on a spreadsheet data cell */
    private readonly copyCell;
    /** listener for a paste event on a spreadsheet data cell */
    private readonly pasteCell;
    /** Replace entire spreadsheet with that from the web services.
     *  Specifically, for each active cell set its data-value and
     *  data-expr attributes to the corresponding values returned
     *  by the web service and set its text content to the cell value.
     */
    /** load initial spreadsheet data into DOM */
    private load;
    private makeEmptySS;
}
export {};
//# sourceMappingURL=spreadsheet.d.ts.map