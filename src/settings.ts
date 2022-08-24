import {
	App,
	PluginSettingTab,
	Setting
} from 'obsidian';

import type TldrawPlugin from "./main";

export interface TldrawSettings {
	mySetting: string;
	folder: string
}

export const DEFAULT_SETTINGS: TldrawSettings = {
	mySetting: 'default',
	folder: 'tldraw'
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
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
				.setName("Tldraw folder")
				.setDesc("Where to save Tldraw drawings. When not set, drawing saved to Vault root.")
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
