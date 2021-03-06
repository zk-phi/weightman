function isNightTime () {
    const hour = (new Date()).getHours();
    return hour < END_OF_DATE_TIME || hour >= START_OF_NIGHT_TIME;
}

function initialize () {
    initializeSheet();
    postToSlack("Initialization succeeded.");
}

function postChartAsync1 () {
    postImageToSlack("Weightman summary", getChart().getBlob());
    ScriptApp.getProjectTriggers().forEach(function (trigger) {
        if (trigger.getHandlerFunction() == "postChartAsync1") {
            ScriptApp.deleteTrigger(trigger);
        }
    });
}

function postChartAsync () {
    ScriptApp.newTrigger("postChartAsync1").timeBased().after(1).create();
}

function doActionEdit (params) {
    var value = getLastValue(isNightTime() ? 1 : 0);

    openSlackModal(params.trigger_id, {
        type: "modal",
        title: { type: "plain_text", text: "Input weight" },
        callback_id: "edit",
        submit: { type: "plain_text", text: "Save" },
        close: { type: "plain_text", text: "Close" },
        blocks: [
            {
                type: "input",
                element: {
                    type: "plain_text_input",
                    initial_value: value + "",
                    action_id: "weight_value"
                },
                label: { type: "plain_text", text: "Weight" },
                block_id: "weight"
            }, {
                type: "divider"
            }, {
                type: "section",
                text: { type: "mrkdwn", text: "Delete report" },
                accessory: {
                    type: "button",
                    text: { type: "plain_text", text: "Delete" },
                    style: "danger",
                    action_id: "delete",
                }
            }
        ]
    });

    return ContentService.createTextOutput("");
}

function doSubmitEdit (params) {
    var newvalue = params.view.state.values.weight.weight_value.value;

    updateLastValue(isNightTime() ? 1 : 0, newvalue);
    postChartAsync();

    postToSlack("", [{
        type: "section",
        text: { type: "mrkdwn", text: "Weight report updated ! weight = " + newvalue },
        accessory: {
            type: "button",
            text: { type: "plain_text", text: ":pencil2:", emoji: true },
            action_id: "edit"
        }
    }]);

    return ContentService.createTextOutput("");
}

function doActionDelete (params) {
    openSlackModal(params.trigger_id, {
        type: "modal",
        callback_id: "delete",
        title: { type: "plain_text", text: "Delete report" },
        submit: { type: "plain_text", text: "Delete" },
        close: { type: "plain_text", text: "Back" },
        blocks:[
            {
                type: "section",
                text: { type: "mrkdwn", text: "Really delete this report ?" }
            }
        ]
    }, true);

    return ContentService.createTextOutput("");
}

function doSubmitDelete (params) {
    deleteLastRow();
    postChartAsync();

    postToSlack("Deleted the last weight report.");

    return ContentService.createTextOutput(JSON.stringify({
        response_action: "clear"
    })).setMimeType(ContentService.MimeType.JSON);
}

function doNightTimer () {
    postToSlack("", [{
        type: "section",
        text: { type: "mrkdwn", text: "You may report weight before sleep~" }
    }, {
        type: "actions",
        elements: [{
            type: "button",
            text: { type: "plain_text", text: "Start input" },
            action_id: "edit"
        }]
    }]);
}

function doTimer () {
    appendRow(new Date());
    postToSlack("", [{
        type: "section",
        text: { type: "mrkdwn", text: "It's time to report today's weight~" }
    }, {
        type: "actions",
        elements: [{
            type: "button",
            text: { type: "plain_text", text: "Start input" },
            action_id: "edit"
        }]
    }]);
}

function doPost (e) {
    var params = e.parameter.payload ? JSON.parse(e.parameter.payload) : e.parameter;

    var verificationToken = params.token;
    if (verificationToken != SLACK_VERIFICATION_TOKEN) throw "Invalid token";

    if (params.type) {
        if (params.type == 'block_actions') {
            if (params.actions[0].action_id == "edit") {
                return doActionEdit(params);
            } else if (params.actions[0].action_id == "delete") {
                return doActionDelete(params);
            } else {
                throw "Unknown action";
            }
        } else if (params.type == 'view_submission') {
            if (params.view.callback_id == "edit") {
                return doSubmitEdit(params);
            } else if (params.view.callback_id == "delete") {
                return doSubmitDelete(params);
            } else {
                throw "Unknown view";
            }
        } else {
            throw "Unknown action type";
        }
    }

    throw "Unexpedted error";
}
