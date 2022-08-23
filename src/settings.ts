export interface MyPluginSettings {
	mySetting: string;
	folder: string
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	folder: 'tldraw'
};
