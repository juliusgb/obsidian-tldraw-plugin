import {
	Plugin,
	addIcon, WorkspaceLeaf
} from 'obsidian';

import {
	CTRL_OR_CMD,
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
import {debug} from "./utils/Utils";
import {TLdrawPluginAPI} from "./api/plugin-api";

export default class TldrawPlugin extends Plugin {
	public tldrawPluginApi: TLdrawPluginAPI;
	settings: TldrawSettings;

	async onload() {
		addIcon(ICON_NAME, TLDRAW_ICON);

		await this.loadSettings();
		// adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TldrawSettingTab(this.app, this));

		// TODO: is this.manifest.version needed
		this.tldrawPluginApi = new TLdrawPluginAPI(this.app, this.settings, this);

		// register a custom view
		// the custom tldraw view type opens in the 'TLdrawView'
		this.registerView(
			VIEW_TYPE_TLDRAW_EMBED,
			(leaf: WorkspaceLeaf) => new TLdrawView(leaf, this, this.tldrawPluginApi)
		);

		// Register the file extensions you want the view to handle.
		// files with .tldr correspond to the custom view type represented by 'VIEW_TYPE_TLDRAW_EMBED'
		this.registerExtensions(["tldr"], VIEW_TYPE_TLDRAW_EMBED);

		this.registerCommands();
		this.registerEventListeners();
		this.setStatusBar();
	}

	onunload() {
		// ensure to clean up the view whenever the plugin is disabled
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_TLDRAW);
		console.log(`TLdraw: version ${this.manifest.version} unloaded.`);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private registerCommands() {
		debug({where:"TLdrawPlugin.registerCommands",})
		// TODO: handle i18n (internationalization and localization)

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(TLDRAW_ICON, 'New Tldraw drawing', (evt: MouseEvent) => {

			// TODO: check if really need to pass 'new-pane' or 'active-pane'
			this.tldrawPluginApi.createAndOpenDrawing(evt[CTRL_OR_CMD]?"new-pane":"active-pane")
		});
	}

	private registerEventListeners() {
		debug({where:"TLdrawPlugin.registerCommands",});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private setStatusBar() {
		// adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('in Tldraw');
	}
}
