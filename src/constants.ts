export const ICON_NAME = "tldraw-icon";
// TODO: svg for tldraw logo
export const TLDRAW_ICON = "dice";

export const VIEW_TYPE_TLDRAW = "tldraw-editor";
export const VIEW_TYPE_TLDRAW_EMBED = "tldraw-embed-view";

export const CREATE_NEW = "New Tldraw drawing";

// TODO: use non-deprecated option: https://developer.mozilla.org/en-US/docs/web/api/navigator/platform#browser_compatibility
export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
export const CTRL_OR_CMD = isDarwin ? "metaKey" : "ctrlKey";

export const DISK_ICON_NAME = "disk";
export const DISK_ICON = `<path fill="none" stroke="currentColor" fill="#fff" d="M0 0h100v100H0z"/><path fill="none" stroke="currentColor" d="M20.832 4.168c21.824.145 43.645.289 74.68.5m-74.68-.5c17.09.113 34.176.227 74.68.5m0 0c.094 27.3.191 54.602.32 91.164m-.32-91.164c.113 32.633.23 65.27.32 91.164m0 0H4.168m91.664 0H4.168m0 0v-75m0 75v-75m0 0L20.832 4.168M4.168 20.832L20.832 4.168M20.832 4.168h58.336m-58.336 0h58.336m0 0v25m0-25v25m0 0H20.832m58.336 0H20.832m0 0v-25m0 25v-25" stroke-width="1.66668" /><path fill="none" stroke="currentColor" d="M29.168 4.168h16.664v16.664H29.168"/><path fill="none" stroke="currentColor" d="M29.168 4.168h16.664m-16.664 0h16.664m0 0v16.664m0-16.664v16.664m0 0H29.168m16.664 0H29.168m0 0V4.168m0 16.664V4.168M12.5 54.168h75m-75 0h75m0 0v41.664m0-41.664v41.664m0 0h-75m75 0h-75m0 0V54.168m0 41.664V54.168M20.832 62.5c20.11-.18 40.219-.36 55.68-.5m-55.68.5c14.656-.133 29.313-.262 55.68-.5M20.832 71.332c13.098-.117 26.2-.234 55.68-.5m-55.68.5l55.68-.5M21.117 79.582c20.645-.184 41.285-.371 55.68-.5m-55.68.5c18.153-.16 36.301-.324 55.68-.5" stroke-width="1.66668"/>`;
