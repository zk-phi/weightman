/* ---- internal fns */

function _getSheet () {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

/* ---- utils */

function initializeSheet () {
    return _getSheet().appendRow([ "date", "morning", "night" ]);
}

function appendRow (date) {
    return _getSheet().appendRow([ formatDate(date) ]);
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
    return sheet.deleteRow(sheet.getLastRow());
}

function getChart () {
    var sheet = _getSheet();
    return sheet.newChart().addRange(sheet.getDataRange()).build();
}
