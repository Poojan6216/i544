import React, { useState, useEffect, useRef } from 'react';
const N_ROWS = 10;
const N_COLS = 10;
const Spreadsheet = ({ ws, ssName }) => {
    const [spreadsheetData, setSpreadsheetData] = useState({});
    const [focusedCellId, setFocusedCellId] = useState(null);
    const copyCellIdRef = useRef(null);
    useEffect(() => {
        loadSpreadsheetData();
    }, []);
    const loadSpreadsheetData = async () => {
        const loadResult = await ws.dumpWithValues(ssName);
        if (loadResult.isOk) {
            const newData = loadResult.val.reduce((data, [cellId, expr, value]) => {
                data[cellId] = { expr, value };
                return data;
            }, {});
            setSpreadsheetData(newData);
        }
        else {
            // Handle errors
        }
    };
    const handleClearSpreadsheet = async (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const clearResult = await ws.clear(ssName);
        if (clearResult.isOk) {
            setSpreadsheetData({});
        }
        else {
            // Handle errors
        }
    };
    const makeEmptySS = () => {
        const rows = [];
        const headerCells = (React.createElement("th", { key: "clear" },
            React.createElement("button", { id: "clear", type: "button", onClick: handleClearSpreadsheet }, "Clear")));
        // Other header cell elements
        rows.push(React.createElement("tr", { key: "header-row" }, headerCells));
        for (let i = 0; i < N_ROWS; i++) {
            const cells = [];
            // Loop to create cell elements
            rows.push(React.createElement("tr", { key: `row-${i}` }, cells));
        }
        return (React.createElement("table", null,
            React.createElement("tbody", null, rows)));
    };
    return React.createElement("div", { id: "ss" }, makeEmptySS());
};
export default Spreadsheet;
//# sourceMappingURL=spreadsheet.js.map