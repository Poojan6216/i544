import SpreadsheetWs from './ss-ws.js';

import { Result, okResult, errResult, OkResult } from 'cs544-js-utils';

import { Errors, makeElement } from './utils.js';

const [N_ROWS, N_COLS] = [10, 10];
//type Updates = { [cellId: string]: number };

export default async function make(ws: SpreadsheetWs, ssName: string) {
  return await Spreadsheet.make(ws, ssName);
}


class Spreadsheet {

  private readonly ws: SpreadsheetWs;
  private readonly ssName: string;
  private readonly errors: Errors;
  cellData:any={};
  updateSpreadsheet: any;
  
  //TODO: add more instance variables
  
  constructor(ws: SpreadsheetWs, ssName: string) {
    this.ws = ws; this.ssName = ssName;
    this.errors = new Errors();
    this.makeEmptySS();
    this.addListeners();
    //TODO: initialize added instance variables
  }

  static async make(ws: SpreadsheetWs, ssName: string) {
    const ss = new Spreadsheet(ws, ssName);
    await ss.load();
    return ss;
  }

  /** add listeners for different events on table elements */
  private addListeners() {
    //TODO: add listeners for #clear and .cell
    const clearButton = document.querySelector('#clear') as HTMLButtonElement;
    clearButton.addEventListener('click', this.clearSpreadsheet);

    // Add listeners for .cell elements
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('focus', this.focusCell);
      cell.addEventListener('blur', this.blurCell);
      cell.addEventListener('copy', this.copyCell);
      cell.addEventListener('paste', this.pasteCell);
    });
  }

  /** listener for a click event on #clear button */
  private readonly clearSpreadsheet = async (ev: Event) => {
    //TODO
    type Updates = { [cellId: string]: number };
    const cellIds = Object.keys(this.cellData);
    const updates: Updates = {};
    for (const cellId of cellIds) {
      updates[cellId] = 0;
    }
    await this.updateSpreadsheet(updates);
  };
 
  /** listener for a focus event on a spreadsheet data cell */
  private readonly focusCell = (ev: Event) => {
    //TODO
    const cell = ev.target as HTMLElement;
    cell.classList.add('focused');
  };
  
  /** listener for a blur event on a spreadsheet data cell */
  private readonly blurCell = async (ev: Event) => {
    //TODO
    const cell = ev.target as HTMLElement;
    const cellId = cell.id;
    const expr = cell.textContent!.trim();
    if (expr !== this.cellData[cellId]?.expr) {
      // Update the cell's expression and value
      const result = await this.ws.evaluate(this.ssName, cellId, expr);
      if (result instanceof OkResult) {
        const updates = result.val;
        this.updateSpreadsheet(updates);
      } else {
        // Handle errors, e.g., display an error message
      }
    }
    cell.classList.remove('focused');
  };
  
  /** listener for a copy event on a spreadsheet data cell */
  private readonly copyCell = (ev: Event) => {
    //TODO
    const clipboardEvent = ev as ClipboardEvent; 
    const cell = ev.target as HTMLElement;
    const cellId = cell.id;
    clipboardEvent.clipboardData?.setData('text/plain', this.cellData[cellId]?.expr || '');
    ev.preventDefault();
  };

  /** listener for a paste event on a spreadsheet data cell */
  private readonly pasteCell = async (ev: Event) => {
    //TODO
    const clipboardEvent = ev as ClipboardEvent;
    const cell = ev.target as HTMLElement;
    const cellId = cell.id;
    const pastedText = clipboardEvent.clipboardData?.getData('text/plain') || '';
    cell.textContent = pastedText;
    cell.dispatchEvent(new Event('blur', { bubbles: true })); // Trigger blur event to update the value
    ev.preventDefault();
  };

  /** Replace entire spreadsheet with that from the web services.
   *  Specifically, for each active cell set its data-value and 
   *  data-expr attributes to the corresponding values returned
   *  by the web service and set its text content to the cell value.
   */
  /** load initial spreadsheet data into DOM */
  private async load() {
    //TODO
    const result = await this.ws.dumpWithValues(this.ssName);
    if (result instanceof OkResult) {
      const data = result.val;
      for (const [cellId, expr, value] of data) {
        this.cellData[cellId] = { value, expr };
        const cell = document.getElementById(cellId) as HTMLElement;
        cell.textContent = value.toString();
      }
    } else {
      // Handle errors, e.g., display an error message
    }
  }

  
  private makeEmptySS() {
    const ssDiv = document.querySelector('#ss')!;
    ssDiv.innerHTML = '';
    const ssTable = makeElement('table');
    const header = makeElement('tr');
    const clearCell = makeElement('td');
    const clear = makeElement('button', {id: 'clear', type: 'button'}, 'Clear');
    clearCell.append(clear);
    header.append(clearCell);
    const A = 'A'.charCodeAt(0);
    for (let i = 0; i < N_COLS; i++) {
      header.append(makeElement('th', {}, String.fromCharCode(A + i)));
    }
    ssTable.append(header);
    for (let i = 0; i < N_ROWS; i++) {
      const row = makeElement('tr');
      row.append(makeElement('th', {}, (i + 1).toString()));
      const a = 'a'.charCodeAt(0);
      for (let j = 0; j < N_COLS; j++) {
	const colId = String.fromCharCode(a + j);
	const id = colId + (i + 1);
	const cell =
	  makeElement('td', {id, class: 'cell', contentEditable: 'true'});
	row.append(cell);
      }
      ssTable.append(row);
    }
    ssDiv.append(ssTable);
  }

}



