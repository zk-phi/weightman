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
    var sheet = _getSheet();
    return sheet.newChart().addRange(sheet.getDataRange()).build();
}
