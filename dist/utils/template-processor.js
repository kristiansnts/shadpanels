"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTemplate = processTemplate;
exports.getDefaultVariables = getDefaultVariables;
function processTemplate(content, variables) {
    let processed = content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processed = processed.replace(regex, value);
    }
    return processed;
}
function getDefaultVariables(appName) {
    return {
        APP_NAME: appName,
        DASHBOARD_TITLE: `Dashboard - ${appName}`,
    };
}
