
import {App, normalizePath, TFile, WorkspaceLeaf} from "obsidian";
import {TldrawSettings} from "../settings";
import {debug} from "../utils/Utils";
import {checkAndCreateFolder, getDrawingFilename, getNewUniqueFilepath} from "../utils/FileUtils";
import {getNewOrAdjacentLeaf, isObsidianThemeDark} from "../utils/ObsidianUtils";
import TldrawPlugin from "../main";
import {TLdrawData} from "../TLdrawData";
import {nanoid} from "nanoid";
import {getTldrawDoc} from "../ui/ObsTLdrawApp";

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

		// TODO: improve if block with one liner
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
					initData ?? (await(this.blankDrawing(filename, nanoid())))
				);

			// TODO: wait for metadata cache

			return file;
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

	async loadLegacyData(dataToUse: any, file: TFile): Promise<TLdrawData> {
		return new TLdrawData();
	}

	/**
	 * Blank tldraw drawing in json format.
	 * <br/>
	 * It can be opened in other tdlraw tools (tldraw.com, vscode extension)
	 * @param drawingFilename
	 * @param drawingId
	 */
	public blankDrawing(drawingFilename: string, drawingId: string): string {

		const drawing =
			`
{
  "name": "${drawingFilename}",
  "fileHandle": null,
  "document": {
    "id": "${drawingId}",
    "name": "${drawingFilename}",
    "version": 15.5,
    "pages": {
      "page": {
        "id": "page",
        "name": "Page 1",
        "childIndex": 1,
        "shapes": {},
        "bindings": {}
      }
    },
    "pageStates": {
      "page": {
        "id": "page",
        "selectedIds": [],
        "camera": {
          "point": [
            273.97,
            -52.98
          ],
          "zoom": 0.75
        },
        "editingId": null
      }
    },
    "assets": {}
  },
  "assets": {}
}
	`;

		debug({where:"TLdrawPluginAPI.blankDrawing", mdrawing:drawing});
		return drawing;
	}

	public darkTheme(): boolean {
		return this.settings.matchTheme && isObsidianThemeDark()
	}

	// TODO: move to own file
	// back and forth with tldraw
	getCurrentTldrawDoc() {
		const currentTldrawDoc = getTldrawDoc();
		return currentTldrawDoc;
	}
}
