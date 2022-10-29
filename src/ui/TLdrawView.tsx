import {Notice, TextFileView, TFile, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import {createRoot, Root} from "react-dom/client";
import { AppContext } from "./context";

import {
	VIEW_TYPE_TLDRAW_EMBED,
	SAVE_DISK_ICON
} from "../constants"

import TldrawPlugin from "../main";

import {
	TLdrawData
} from "../TLdrawData";
import {debug} from "../utils/Utils";
import {TLdrawPluginAPI} from "../api/plugin-api";
import {nanoid} from "nanoid";
import ObsTLdrawApp, {initializeTDFile, triggerEvent} from "./ObsTLdrawApp";


/**
 * The TLdrawView uses Obsidian's TextFileView, which means
 * it's underlying model Obsidian's is a text file.
 */
export default class TLdrawView extends TextFileView {
	public tldrawData: TLdrawData;
	public compatibilityMode: boolean = false;
	private reactRoot: Root;

	// indicates that a new file is being loaded.
	// After drawing is loaded, it's set to true
	private isLoaded: boolean = false;

	constructor(leaf: WorkspaceLeaf, public plugin: TldrawPlugin, public tldrawPluginApi: TLdrawPluginAPI) {
		super(leaf);
		this.tldrawData = new TLdrawData();
		this.reactRoot = this.createReactRoot();
	}



	forceSaveIcon: HTMLElement;

	onload() {
		console.log("view.ONLOAD");

		this.forceSaveIcon = this.addAction(
			SAVE_DISK_ICON,
			'FORCE SAVE',
			async () => {
				await this.save(false, true);
				new Notice("Save successful", 1000);
			}
		);
		super.onload();
	}

	async save(preventReload: boolean = true, forcesave: boolean = false) {
		console.log("ABOUT TO SAVE");
		if(!this.isLoaded) {
			return;
		}
		const fileRecentlyDeleted = !app.vault.getAbstractFileByPath(this.file.path);
		if (!this.file || fileRecentlyDeleted) {
			return;
		}
		await super.save();
	}

	// returns the current state of the data.
	// save contents to file
	getViewData() {
		console.log("view.getViewData()");

		if (!this.tldrawData.loaded) {
			return this.data;
		}

		const currentTldrawDocument = this.tldrawPluginApi.getCurrentTldrawDoc();

		if (this.compatibilityMode) {
			//debug({where:"TLdrawView.getViewData - current state",file:this.file.name, cTldoc: currentTldrawDocument });

			return JSON.stringify(currentTldrawDocument, null, "\t");
		}
		return this.data;
	}

	// updates the view whenever Obsidian reads new data from a file.
	// Use this method to encode the text data into a format that makes it easier to work with.
	// If clear is set, then it means we're opening a completely different file.
	setViewData(data: string, clear: boolean) {
		// debug({where: "TLdrawView.setViewData", file: this.file.name, mData: data });

		this.isLoaded = false;

		if (clear) {
			this.clear();
		}

		// when the loading of the vault into the memory is done
		this.app.workspace.onLayoutReady(async () => {
			this.compatibilityMode = this.file.extension === "tldr";
			await this.plugin.loadSettings();

			// debug({ where:"TLdrawView.setViewData.onLayoutReady1", file:this.file.name, mData: data, mtldrawDataFile:
			// this.tldrawData.tldrawDataFile, before:"checkingDataForNull" })

			// TODO: improve if block with one liner
			let dataToUse = null;

			if (data) {
				dataToUse = this.data = data.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
			}
			else {
				dataToUse = await(this.tldrawPluginApi.blankDrawing(this.file.name, nanoid()));
			}

			// debug({ where:"TLdrawView.setViewData.onLayoutReady2", file:this.file.name, data: dataToUse, thisData:
			// this.data, mtldrawDataFile: this.tldrawData.tldrawDataFile, after:"checkingDataForNull" })

			if (this.compatibilityMode) {
				// populate tldrawDataFile
				await this.tldrawData.loadLegacyData(dataToUse, this.file);

				this.tldrawData.disableCompression = true;
			}
			else {
				// TODO: https://github.com/juliusgb/obsidian-tldraw-plugin/issues/28
				this.tldrawData.disableCompression = false;
			}
			// debug({ where:"TLdrawView.setViewData.onLayoutReady3", file:this.file.name, data:dataToUse, mtldrawDataFile:
			// this.tldrawData, after:"checkingDataForNull" })

			// use tldrawDataJson
			await this.loadDrawing(true);
			this.isLoaded = true;
		});
	}

	// resets the view whenever Obsidian unloads the file.
	clear() {
		debug({where:"view.clear",fileLoaded:this.isLoaded});

		// TODO: implement
		// without this, following happens:
		// 1. Open file1.
		// 2. While file1 is open, click on file2 to open.
		// 3. file2 is not displayed. But file1.

		// Workaround: save file1. Close it. Open file2
	}

	getViewType() {
		debug({where:"view.getViewType()",fileLoaded:this.isLoaded});

		return VIEW_TYPE_TLDRAW_EMBED;
	}


	private createReactRoot(): Root {
		const obsidianContentDivContainer = this.containerEl.children[1];
		const mountableReactRoot = createRoot(obsidianContentDivContainer);
		return mountableReactRoot;
	}

	async onClose() {
		debug({where:"view.onClose()",fileLoaded:this.isLoaded});

		// React 18's way of removing a mounted React component from the DOM.
		this.reactRoot.unmount();

		// clean up any elements this custom view created.
		this.contentEl.empty();
	}

	// textfileview lifecycle methods
	onLoadFile(file: TFile): Promise<void> {
		debug({where:"view.onLoadFile()",mFile:file });
		super.onLoadFile(file);
	}

	onUnloadFile(file: TFile): Promise<void> {
		debug({where:"view.onUnloadFile()",mFile:file });
		super.onUnloadFile(file);
	}

	onOpen(): Promise<void> {
		debug({where:"view.onOpen()" });
		super.onOpen();
	}

	/**
	 *
	 * @param justloaded - a flag to trigger zoom to fit after the drawing has been loaded
	 */
	private async loadDrawing(justloaded: boolean) {
		// TODO:

		this.instantiateTldraw();
	}

	private instantiateTldraw() {
		// debug({ where:"TLdrawView.instantiateTldraw", file:this.file.name, width: this.contentEl.clientWidth, height:
		// this.contentEl.clientHeight });

		console.log(this.containerEl.children);
		// Output of console.log
		// HTMLCollection(2) [div.view-header, div.view-content]
		// 0: div.view-header
		// 1: div.view-content
		console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>

		debug({where: "TLdrawView.instantiateTldraw2", mtldrawData: this.tldrawData, mtldrawDataFile: this.tldrawData.tldrawDataFile });

		initializeTDFile(this.tldrawData.tldrawDataFile);

		console.log("Trigger custom event");

		// when obsidian opens another file (fileB), the react component
		// is still mounted, but the old file (fileA) hasn't been cleared out in tldraw.
		// so, use a custom event to get tldraw to cleanup fileA and reload fileB.
		triggerEvent(
			"newFile:Obsidianloaded",
			{
				isNewFileLoaded: true,
				newFile: this.tldrawData.tldrawDataFile
			});

		// mount the component
		const mountableReactRoot = this.reactRoot;

		mountableReactRoot.render(
			<AppContext.Provider value={this.app}>
				<ObsTLdrawApp
					obsTldrawDataFile={this.tldrawData.tldrawDataFile}
					theme={this.tldrawPluginApi.darkTheme()}
				/>
			</AppContext.Provider>
		);



	}
}
