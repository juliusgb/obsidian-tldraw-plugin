import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	addIcon, WorkspaceLeaf
} from 'obsidian';

import {
	ICON_NAME,
	TLDRAW_ICON,
	VIEW_TYPE_TLDRAW, VIEW_TYPE_TLDRAW_EMBED
} from "./constants";

import {
	TldrawSettings,
	DEFAULT_SETTINGS,
	TldrawSettingTab
} from './settings';

import TLdrawView from "./TLdrawView";

// Remember to rename these classes and interfaces!

export default class TldrawPlugin extends Plugin {
	settings: TldrawSettings;

	async onload() {
		addIcon(ICON_NAME, TLDRAW_ICON);

		await this.loadSettings();

		// register custom view with the plugin
		this.registerView(
			VIEW_TYPE_TLDRAW_EMBED,
			(leaf: WorkspaceLeaf) => new TLdrawView(leaf)
		);

		// Register the extensions you want the view to handle.
		this.registerExtensions(["tldraw"], VIEW_TYPE_TLDRAW_EMBED);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(TLDRAW_ICON, 'New Tldraw drawing', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('TLdraw clicked!');
			this.activateView();
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('in Tldraw');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TldrawSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		// ensure to clean up the view whenever the plugin is disabled
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_TLDRAW);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Allows user to activate the TLdraw view.
	 */
	async activateView() {
		// TODO:

		this.app.workspace.detachLeavesOfType(VIEW_TYPE_TLDRAW);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_TLDRAW,
			active: true
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_TLDRAW)[0]
		);
	}
}
