/* ---- internal fns */

function _getSheet () {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

/* ---- utils */

function initializeSheet () {
    return _getSheet().appendRow([ "date", "weight" ]);
}

function appendRow (date) {
    return _getSheet().appendRow([ formatDate(date) ]);
}

function updateLastValue (newvalue) {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), 2).setValue(newvalue);
}

function getLastValue () {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), 2).getValue();
}

function deleteLastRow () {
    var sheet = _getSheet();
    return sheet.getRange(sheet.getLastRow(), 1, 1, 2).clear();
}

function getChart () {
    var sheet = _getSheet();
    return sheet.newChart().addRange(sheet.getDataRange()).build();
}
