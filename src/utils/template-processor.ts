export interface TemplateVariables {
  APP_NAME: string;
  DASHBOARD_TITLE: string;
  [key: string]: string;
}

export function processTemplate(content: string, variables: TemplateVariables): string {
  let processed = content;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value);
  }
  
  return processed;
}

export function getDefaultVariables(appName: string): TemplateVariables {
  return {
    APP_NAME: appName,
    DASHBOARD_TITLE: `Dashboard - ${appName}`,
  };
}