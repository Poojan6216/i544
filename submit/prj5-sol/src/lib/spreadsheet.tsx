import React, { useState, useEffect, useRef } from 'react';
//import './style.css'; 
import SpreadsheetWs from './ss-ws';

type CellData = {
  expr: string;
  value: number;
};

type SpreadsheetData = {
  [cellId: string]: CellData;
};

const N_ROWS = 10;
const N_COLS = 10;

type SpreadsheetProps = {
  ws: SpreadsheetWs;
  ssName: string;
};

const Spreadsheet: React.FC<SpreadsheetProps> = ({ ws, ssName }) => {
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>({});
  const [focusedCellId, setFocusedCellId] = useState<string | null>(null);
  const copyCellIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadSpreadsheetData();
  }, []);

  const loadSpreadsheetData = async () => {
    const loadResult = await ws.dumpWithValues(ssName);
    if (loadResult.isOk) {
      const newData: SpreadsheetData = loadResult.val.reduce((data: SpreadsheetData, [cellId, expr, value]: any[]) => {
        data[cellId] = { expr, value };
        return data;
      }, {} as SpreadsheetData);
      setSpreadsheetData(newData);
    } else {
      // Handle errors
      
    }
  };

  const handleClearSpreadsheet = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    ev.preventDefault();
    const clearResult = await ws.clear(ssName);
    if (clearResult.isOk) {
      setSpreadsheetData({});
    } else {
      // Handle errors
    }
  };

 

  const makeEmptySS = () => {
    const rows = [];
    const headerCells = (
      <th key="clear">
        <button id="clear" type="button" onClick={handleClearSpreadsheet}>
          Clear
        </button>
      </th>
    );

    // Other header cell elements

    rows.push(<tr key="header-row">{headerCells}</tr>);

    for (let i = 0; i < N_ROWS; i++) {
      const cells: JSX.Element[] = [];
      // Loop to create cell elements

      rows.push(<tr key={`row-${i}`}>{cells}</tr>);
    }

    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return <div id="ss">{makeEmptySS()}</div>;
};

export default Spreadsheet;
