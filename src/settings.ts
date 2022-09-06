import {
	App,
	PluginSettingTab,
	Setting
} from 'obsidian';

import type TldrawPlugin from "./main";

export interface TldrawSettings {
	mySetting: string;
	folder: string;
	drawingFilenamePrefix: string;
	drawingFilenameDateTime: string;
	compatibilityMode: boolean;
	useTldrawExtension: boolean;
	matchTheme: boolean
}

export const DEFAULT_SETTINGS: TldrawSettings = {
	mySetting: 'default',
	folder: 'Tldraw',
	drawingFilenamePrefix: "TLDrawing ",
	drawingFilenameDateTime: "YYYY-MM-DD HH.mm.ss",
	compatibilityMode: true,
	useTldrawExtension: false, // TODO: until processing diagram as markdown is sorted
	matchTheme: false
};


export class TldrawSettingTab extends PluginSettingTab {
	plugin: TldrawPlugin;

	constructor(app: App, plugin: TldrawPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h3', { text: 'General Settings'	});

		new Setting(containerEl)
				.setName("Tldraw folder")
				.setDesc("Where to save Tldraw drawings. Default location is in the Vault root.")
				.addText(text => text
					.setPlaceholder('tldraw')
					.setValue(this.plugin.settings.folder)
					.onChange(async (value) => {
						this.plugin.settings.folder = value;
						await this.plugin.saveSettings();
					})
				)

	}
}
