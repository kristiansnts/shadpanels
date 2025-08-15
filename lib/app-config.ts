// App configuration utility for both client and server
export function getAppName(): string {
  // For client-side, use NEXT_PUBLIC_ prefixed env vars
  // For server-side, use regular env vars
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_NAME || "Shadpanel"
  }
  return process.env.APP_NAME || "Shadpanel"
}

export function getDashboardTitle(): string {
  const appName = getAppName()
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_DASHBOARD_TITLE || `Dashboard - ${appName}`
  }
  return process.env.DASHBOARD_TITLE || `Dashboard - ${appName}`
}