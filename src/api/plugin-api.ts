
import {App, normalizePath, TFile, WorkspaceLeaf} from "obsidian";
import {TldrawSettings} from "../settings";
import {debug} from "../utils/Utils";
import {checkAndCreateFolder, getDrawingFilename, getNewUniqueFilepath} from "../utils/FileUtils";
import {getNewOrAdjacentLeaf, isObsidianThemeDark} from "../utils/ObsidianUtils";
import {BLANK_DRAWING, CTRL_OR_CMD, DARK_BLANK_DRAWING} from "../constants";
import TldrawPlugin from "../main";

export class TLdrawPluginAPI {

	public constructor(
		public obsidianApp: App,
		public settings: TldrawSettings,
		public tldrawPlugin: TldrawPlugin) { }

	public async createAndOpenDrawing(
		location: "active-pane"|"new-pane"|"popout-window",
		filename?: string,
		foldername?: string,
		initialData?: string): Promise<string> {

		debug({where:"TLdrawPluginAPI.createAndOpenDrawing",})

		let drawingFilename;

		if (filename) {
			drawingFilename = filename;
		}
		else {
				drawingFilename = getDrawingFilename(this.settings);
		}
		const file = await this.createDrawing(drawingFilename, foldername, initialData);
		this.openDrawing(file, location, true);

		return file.path;
	}

	public async createDrawing(
		filename: string,
		foldername?: string,
		initData?: string): Promise<TFile> {

			debug({where:"TLdrawPluginAPI.createDrawing",})

			const folderpath = normalizePath(foldername ? foldername : this.settings.folder);

			//create folder if it does not exist
			await checkAndCreateFolder(folderpath);

			const fname = getNewUniqueFilepath(this.obsidianApp.vault, filename, folderpath);

			const file =
				await this.obsidianApp.vault.create(
					fname,
					initData ?? (await this.getBlankDrawing()));

			// TODO: wait for metadata cache

			return file;
	}

	public async getBlankDrawing(): Promise<string> {
		debug({where:"TLdrawPluginAPI.getBlankDrawing",})

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

	public loadDrawing() {

	}

	public openDrawing(
		drawingFile: TFile,
		location: "active-pane" | "new-pane" | "popout-window",
		active: boolean,
		subpath?: string) {

		debug({
			where:"TLdrawPluginAPI.openDrawing",
			drawingFile:drawingFile,
			location:location,
			active:active,
			subpath:subpath})

		let leaf: WorkspaceLeaf;
		if(location === "popout-window") {
			//@ts-ignore
			leaf = app.workspace.openPopoutLeaf();
		}
		else {
			leaf = this.obsidianApp.workspace.getLeaf(false);
			if ((leaf.view.getViewType() !== 'empty') && (location === "new-pane")) {
				leaf = getNewOrAdjacentLeaf(this.tldrawPlugin, leaf)
			}
		}

		leaf.openFile(
			drawingFile,
			!subpath || subpath === ""
				? {active}
				: { active, eState: { subpath } }
		);

		return drawingFile.path;
	}



	public saveDrawing() {

	}
	public editDrawing() {

	}
}
