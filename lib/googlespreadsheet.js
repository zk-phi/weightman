/* ---- internal fns */

function _getSheet () {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

/* ---- utils */

function initializeSheet () {
    var sheet = _getSheet();
    sheet.clear();
    return sheet.appendRow([ "date", "morning", "night", "week ave." ]);
}

function appendRow (date) {
    const sheet = _getSheet();
    const rowNum = sheet.getLastRow();
    return _getSheet().appendRow([
        formatDate(date),
        "",
        "",
        rowNum >= 7 ? "=AVERAGE(B" + (rowNum - 5) + ":B" + (rowNum + 1) + ")" : ""
    ]);
}

function updateLastValue (ix, newvalue) {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), ix + 2).setValue(newvalue);
}

function getLastValue (ix) {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), ix + 2).getValue();
}

function deleteLastRow () {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), 2, 1, 2).setValues([["", ""]]);
}


function getChart () {
    var tbl = Charts.newDataTable()
                    .addColumn(Charts.ColumnType.DATE, 'date')
                    .addColumn(Charts.ColumnType.NUMBER, 'morning')
                    .addColumn(Charts.ColumnType.NUMBER, 'night')
                    .addColumn(Charts.ColumnType.NUMBER, 'week ave.');

    var sheet = _getSheet();
    var data = sheet.getDataRange().getValues();
    data.shift(); // drop header row
    data.forEach(function (row) {
        tbl.addRow(row.map(function (field) {
            // errors like '!DIV/0' are given as strings
            if (typeof field == 'string') return null;
            return field;
        }));
    });
    tbl.build();

    var chart = Charts.newAreaChart();
    chart.setDataTable(tbl);

    return chart.build();
}
