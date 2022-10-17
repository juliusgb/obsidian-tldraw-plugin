export const ICON_NAME = "tldraw-icon";
// TODO: svg for tldraw logo
export const TLDRAW_ICON = "dice";

export const VIEW_TYPE_TLDRAW = "tldraw-editor";
export const VIEW_TYPE_TLDRAW_EMBED = "tldraw-embed-view";

export const CREATE_NEW = "New Tldraw drawing";

// TODO: use non-deprecated option: https://developer.mozilla.org/en-US/docs/web/api/navigator/platform#browser_compatibility
export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
export const CTRL_OR_CMD = isDarwin ? "metaKey" : "ctrlKey";

// use icons from https://lucide.dev/
export const SAVE_DISK_ICON = "save"
