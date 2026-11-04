export const APP_VERSION = "0.4.0";
export const BUILD_NUMBER = "013";
export const BUILD_DATE = "04.11.2026";

export function getVersionString(): string {
  return `Chatty Ver. ${APP_VERSION} | Build ${BUILD_NUMBER} | ${BUILD_DATE}`;
}
