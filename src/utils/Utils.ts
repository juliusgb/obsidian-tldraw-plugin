// taken from https://github.com/zsviczian/obsidian-excalidraw-plugin/blob/master/src/utils/Utils.ts

export const errorlog = (data: {}) => {
	console.error({ plugin: "Tldraw", ...data });
};

export const log = console.log.bind(window.console);
export const debug = console.log.bind(window.console);
//export const debug = function(){};
