import {Notice, TextFileView, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import {createRoot, Root} from "react-dom/client";
import { AppContext } from "./context";

import {
	DISK_ICON_NAME,
	VIEW_TYPE_TLDRAW_EMBED
} from "../constants"

import TldrawPlugin from "../main";

import {
	TLdrawData
} from "../TLdrawData";
import {debug} from "../utils/Utils";
import {TLdrawPluginAPI} from "../api/plugin-api";
import {nanoid} from "nanoid";
import ObsTLdrawApp, {initializeTDFile} from "./ObsTLdrawApp";


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



	diskIcon: HTMLElement;

	onload() {
		console.log("ONLOAD");

		this.diskIcon = this.addAction(
			DISK_ICON_NAME,
			'FORCE_SAVE',
			async () => {
				await this.save(false, true);
				new Notice("Save successful", 1000);
			}
		);
		super.onload();
	}

	async save(preventReload: boolean = true, forcesave: boolean = false) {
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
			console.log("ABOUT TO SAVE");

			return JSON.stringify(currentTldrawDocument, null, "\t");
		}
		// debug({where:"TLdrawView.getViewData",data:this.data})
		return this.data;
	}

	// updates the view whenever Obsidian reads new data from a file.
	// Use this method to encode the text data into a format that makes it easier to work with.
	// If clear is set, then it means we're opening a completely different file.
	setViewData(data: string, clear: boolean) {
		// debug({where:"TLdrawView.setViewData",file:this.file.name})

		this.isLoaded = false;

		if (clear) {
			this.clear();
		}

		// when the loading of the vault into the memory is done
		this.app.workspace.onLayoutReady(async () => {
			this.compatibilityMode = this.file.extension === "tldr";
			await this.plugin.loadSettings();

			// debug({where:"TLdrawView.setViewData.onLayoutReady",file:this.file.name, data:data})

			// TODO: improve if block with one liner
			let dataToUse = null;

			if (data) {
				dataToUse = this.data = data.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
			}
			else {
				dataToUse = await(this.tldrawPluginApi.blankDrawing(this.file.name, nanoid()));
			}

			// debug({
			// 	where:"TLdrawView.setViewData.onLayoutReady",
			// 	file:this.file.name,
			// 	data:dataToUse,
			// 	after:"checkingDataForNull"})

			if (this.compatibilityMode) {
				// populate tldrawDataFile
				await this.tldrawData.loadLegacyData(dataToUse, this.file);

				this.tldrawData.disableCompression = true;
			}
			else {
				// TODO: https://github.com/juliusgb/obsidian-tldraw-plugin/issues/28
				this.tldrawData.disableCompression = false;
			}
			// use tldrawDataJson
			await this.loadDrawing(true);
			this.isLoaded = true;
		});
	}

	// resets the view whenever Obsidian unloads the file.
	clear() {
		console.log("view.clear()");

		// TODO: implement
		// without this, following happens:
		// 1. Open file1.
		// 2. While file1 is open, click on file2 to open.
		// 3. file2 is not displayed. But file1.

		// Workaround: save file1. Close it. Open file2
	}

	getViewType() {
		console.log("view.getViewType()");

		return VIEW_TYPE_TLDRAW_EMBED;
	}


	private createReactRoot(): Root {
		const obsidianContentDivContainer = this.containerEl.children[1];
		const mountableReactRoot = createRoot(obsidianContentDivContainer);
		return mountableReactRoot;
	}

	async onClose() {
		console.log("view.onClose()");

		// React 18's way of removing a mounted React component from the DOM.
		this.reactRoot.unmount();

		// clean up any elements this custom view created.
		this.contentEl.empty();
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
		// debug({
		// 	where:"TLdrawView.instantiateTldraw",
		// 	file:this.file.name,
		// 	width: this.contentEl.clientWidth,
		// 	height: this.contentEl.clientHeight,
		// })

		console.log(this.containerEl.children);
		// Output of console.log
		// HTMLCollection(2) [div.view-header, div.view-content]
		// 0: div.view-header
		// 1: div.view-content
		console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>

		// debug({
		// 	where:"TLdrawView.instantiateTldraw",
		// 	before:"react mounting",
		// 	mmmm:this.tldrawData,
		// })

		initializeTDFile(this.tldrawData.tldrawDataFile);

		// mount the component
		const mountableReactRoot = this.reactRoot;

		mountableReactRoot.render(
			<AppContext.Provider value={this.app}>
				<ObsTLdrawApp
					obsTldrawData={this.tldrawData}
					theme={this.tldrawPluginApi.darkTheme()}
				/>
			</AppContext.Provider>
		);
	}
}
