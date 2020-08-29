var _properties = PropertiesService.getScriptProperties();

var SLACK_CHANNEL_NAME       = _properties.getProperty("SLACK_CHANNEL_NAME");
var SLACK_VERIFICATION_TOKEN = _properties.getProperty("SLACK_VERIFICATION_TOKEN");
var SLACK_WEBHOOK_URL        = _properties.getProperty("SLACK_WEBHOOK_URL");
var SLACK_ACCESS_TOKEN       = _properties.getProperty("SLACK_ACCESS_TOKEN");
var END_OF_DATE_TIME         = _properties.getProperty("END_OF_DATE_TIME") || 4;
var START_OF_NIGHT_TIME      = _properties.getProperty("START_OF_NIGHT_TIME") || 16;
