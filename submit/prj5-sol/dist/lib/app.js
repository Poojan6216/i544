import { Err } from 'cs544-js-utils';
import * as utilsJs from './utils.js';
import SpreadsheetWs from './ss-ws.js';
import makeSpreadsheet from './spreadsheet.js';
export default async function makeApp(wsUrl) {
    makeTopLevelUI(wsUrl);
    setupLoadFormHandler();
}
function setupLoadFormHandler() {
    const errors = new utilsJs.Errors();
    const wsUrlInput = document.querySelector('#ws-url');
    const ssNameInput = document.querySelector('#ss-name');
    let ws;
    let ssName;
    const ssForm = document.querySelector('#ss-form');
    ssForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        errors.clear();
        const wsUrl = wsUrlInput.value.trim();
        const ssName = ssNameInput.value.trim();
        if (wsUrl.length === 0 || ssName.length === 0) {
            const msg = 'both the Web Services Url and Spreadsheet Name must be specified';
            errors.display([new Err(msg, { code: 'BAD_REQ' })]);
        }
        else {
            const ws = SpreadsheetWs.make(wsUrl);
            await makeSpreadsheet({ ws, ssName });
        }
    });
}
/** Add UI corresponding to following HTML structure to #app

  <form class="form" id="ss-form">

    <label for="ws-url">Web Services Url</label>
    <input name="ws-url" id="ws-url">

    <label for="ss-name">Spreadsheet Name</label>
    <input name="ss-name" id="ss-name">

    <label></label>
    <button type="submit">Load Spreadsheet</button>
    
  </form>

  <ul class="error" id="errors"></ul>
    
  <div id="ss">
    <!-- innerHTML of this div replaced by spreadsheet table -->
  </div>
*/
function makeTopLevelUI(wsUrl) {
    function makeLoadForm(wsUrl) {
        const form = utilsJs.makeElement('form', { class: 'form', id: 'ss-form' });
        form.append(utilsJs.makeElement('label', { for: 'ws-url' }, 'Web Services URL'));
        form.append(utilsJs.makeElement('input', { name: 'ws-url', id: 'ws-url',
            value: wsUrl }));
        form.append(utilsJs.makeElement('label', { for: 'ss-name' }, 'Spreadsheet Name'));
        form.append(utilsJs.makeElement('input', { name: 'ss-name', id: 'ss-name' }));
        form.append(utilsJs.makeElement('label'));
        form.append(utilsJs.makeElement('button', { type: 'submit' }, 'Load Spreadsheet'));
        return form;
    }
    const app = document.querySelector('#app');
    app.append(makeLoadForm(wsUrl));
    app.append(utilsJs.makeElement('ul', { class: 'error', id: 'errors' }));
    //spreadsheet table should be rendered within this div
    app.append(utilsJs.makeElement('div', { id: 'ss' }));
}
//# sourceMappingURL=app.js.map