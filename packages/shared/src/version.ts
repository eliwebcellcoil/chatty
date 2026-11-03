export const APP_VERSION = "0.2.3";
export const BUILD_NUMBER = "008";
export const BUILD_DATE = "03.11.2026";

export function getVersionString(): string {
  return `Chatty Ver. ${APP_VERSION} | Build ${BUILD_NUMBER} | ${BUILD_DATE}`;
}
