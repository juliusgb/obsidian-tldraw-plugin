import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	addIcon, WorkspaceLeaf, TFile, normalizePath
} from 'obsidian';

import {
	BLANK_DRAWING,
	CTRL_OR_CMD, DARK_BLANK_DRAWING,
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
import {checkAndCreateFolder, getDrawingFilename, getNewUniqueFilepath} from "./utils/FileUtils";
import {getNewOrAdjacentLeaf, isObsidianThemeDark} from "./utils/ObsidianUtils";
import {debug} from "./utils/Utils";

export default class TldrawPlugin extends Plugin {
	settings: TldrawSettings;

	async onload() {
		addIcon(ICON_NAME, TLDRAW_ICON);

		await this.loadSettings();
		// adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TldrawSettingTab(this.app, this));

		// register custom view with the plugin
		this.registerView(
			VIEW_TYPE_TLDRAW_EMBED,
			(leaf: WorkspaceLeaf) => new TLdrawView(leaf, this)
		);

		// Register the extensions you want the view to handle.
		this.registerExtensions(["tldraw"], VIEW_TYPE_TLDRAW_EMBED);

		this.registerCommands();
		this.registerEventListeners();
		this.setStatusBar();
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

	private registerCommands() {
		debug({where:"TLdrawPlugin.registerCommands",})
		// TODO: handle i18n (internationalization and localization)

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(TLDRAW_ICON, 'New Tldraw drawing', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('TLdraw clicked!');
			this.createAndOpenDrawing(
				getDrawingFilename(this.settings),
				evt[CTRL_OR_CMD]?"new-pane":"active-pane", // TODO: check if really needed
			);
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

	private async createAndOpenDrawing(
		filename: string,
		location: "active-pane"|"new-pane"|"popout-window",
		foldername?: string,
		initialData?: string): Promise<string> {
		debug({where:"TLdrawPlugin.createAndOpenDrawing",})


		const file = await this.createDrawing(filename, foldername, initialData);
		this.openDrawing(file, location, true);

		return file.path;

	}

	private async createDrawing(
		filename: string,
		foldername?: string,
		initData?: string): Promise<TFile> {

		debug({where:"TLdrawPlugin.createDrawing",})

		const folderpath = normalizePath(foldername ? foldername : this.settings.folder);

		await checkAndCreateFolder(folderpath); //create folder if it does not exist

		const fname = getNewUniqueFilepath(this.app.vault, filename, folderpath);

		const file =
			await this.app.vault.create(
				fname,
				initData ?? (await this.getBlankDrawing()));

		// TODO: wait for metadata cache

		return file;
	}

	public async getBlankDrawing(): Promise<string> {
		debug({where:"TLdrawPlugin.getBlankDrawing",})
		// TODO: add template stuff

		const blankDrawing = this.settings.matchTheme && isObsidianThemeDark()
			? DARK_BLANK_DRAWING
			: BLANK_DRAWING;

		if (this.settings.compatibilityMode) {
			return blankDrawing;
		}
		else {
			// TODO: compressed json

			return blankDrawing;
		}
	}

	private openDrawing(
		drawingFile: TFile,
		location: "active-pane" | "new-pane" | "popout-window",
		active: boolean,
		subpath?: string) {
		debug({where:"TLdrawPlugin.openDrawing", drawingFile:drawingFile, location:location, active:active, subpath:subpath})

		let leaf: WorkspaceLeaf;
		if(location === "popout-window") {
			//@ts-ignore
			leaf = app.workspace.openPopoutLeaf();
		}
		else {
			leaf = this.app.workspace.getLeaf(false);
			if ((leaf.view.getViewType() !== 'empty') && (location === "new-pane")) {
				leaf = getNewOrAdjacentLeaf(this, leaf)
			}
		}

		leaf.openFile(
			drawingFile,
			!subpath || subpath === ""
				? {active}
				: { active, eState: { subpath } }
		);
	}


}
