import {
	App,
	PluginSettingTab,
	Setting
} from 'obsidian';

import type TldrawPlugin from "./main";
import {FILENAME_DESC, FILENAME_SAMPLE} from "./constants";
import {getDrawingFilename} from "./utils/FileUtils";

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
	matchTheme: true
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
				.setName("Tldraw folder") // TODO: i18n
				.setDesc("Where to save Tldraw drawings. Default location is in the Vault root.")
				.addText(text => text
					.setPlaceholder('tldraw')
					.setValue(this.plugin.settings.folder)
					.onChange(async (value) => {
						this.plugin.settings.folder = value;
						await this.plugin.saveSettings();
					})
				);

		containerEl.createEl('h3', { text: 'Filename' });
		containerEl.createDiv("", (el) => {
			el.innerHTML = FILENAME_DESC;
		});

		const getFilenameSample = () => {
			return `${ FILENAME_SAMPLE }<i>${ getDrawingFilename(this.plugin.settings) }</i>`;
		};

		const filenameEl = containerEl.createEl("p", { text: "" });
		filenameEl.innerHTML = getFilenameSample();

		new Setting(containerEl)
			.setName("Filename prefix") // TODO: i18n
			.setDesc("First part of filename")
			.addText(text => text
				.setValue(this.plugin.settings.drawingFilenamePrefix)
				.onChange(async (value) => {
					this.plugin.settings.drawingFilenamePrefix = value;
					filenameEl.innerHTML = getFilenameSample();
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Filename Date") // TODO: i18n
			.setDesc("Last part of the filename. Leave empty, if not needed")
			.addText(text => text
				.setValue(this.plugin.settings.drawingFilenameDateTime)
				.onChange(async  (value) => {
					this.plugin.settings.drawingFilenameDateTime = value;
					filenameEl.innerHTML = getFilenameSample();
					await this.plugin.saveSettings();
				})
			);

	}
}
