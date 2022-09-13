import {TextFileView, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import {createRoot, Root} from "react-dom/client";
import { AppContext } from "./context";

import {
	VIEW_TYPE_TLDRAW_EMBED
} from "../constants"

import TldrawPlugin from "../main";

import {
	TLdrawData
} from "../TLdrawData";
import {debug} from "../utils/Utils";
import {TLdrawPluginAPI} from "../api/plugin-api";
import {nanoid} from "nanoid";
import ObsTLdrawApp from "./ObsTLdrawApp";

/**
 * The TLdrawView uses Obsidian's TextFileView, which means
 * it's underlying model Obsidian's is a text file.
 */
export default class TLdrawView extends TextFileView {
	public tldrawData: TLdrawData;
	public compatibilityMode: boolean = false;
	private reactRoot: Root;

	constructor(leaf: WorkspaceLeaf, public plugin: TldrawPlugin, public tldrawPluginApi: TLdrawPluginAPI) {
		super(leaf);
		this.tldrawData = new TLdrawData();
		this.reactRoot = this.createReactRoot();
	}

	// returns the current state of the data.
	// Obsidian uses this method to decode the view data into plaintext before writing it to a file.
	getViewData() {
		console.log("view.getViewData()");

		// TODO: return what should be saved to disk
		return "";
	}

	// updates the view whenever Obsidian reads new data from a file.
	// Use this method to encode the text data into a format that makes it easier to work with.
	setViewData(data: string, clear: boolean) {
		debug({where:"TLdrawView.setViewData",file:this.file.name})

		// when the loading of the vault into the memory is done
		this.app.workspace.onLayoutReady(async () => {
			this.compatibilityMode = this.file.extension === "tldr";
			await this.plugin.loadSettings();

			debug({where:"TLdrawView.setViewData.onLayoutReady",file:this.file.name, data:data})

			//	data = the json of our drawing
			//	if data is null, set it to this.tldrawPluginApi.getBlankDrawing()
			//	if compatibilityMode:
			//		loadLegacyData loads the TDFile object
			//	else:
			//		process .tldraw.md files
			//		compress these files
			//	call loadDrawing


			// TODO: improve if block with one liner
			let dataToUse = null;

			if (data) {
				dataToUse = data;
			}
			else {
				dataToUse = await(this.tldrawPluginApi.blankDrawing(this.file.name, nanoid()));
			}

			debug({where:"TLdrawView.setViewData.onLayoutReady",file:this.file.name, data:dataToUse, after:"checkingDataForNull"})

			if (this.compatibilityMode) {
				// populate tldrawDataJson
				await this.tldrawData.loadLegacyData(dataToUse, this.file);

				this.tldrawData.disableCompression = true;
			}
			else {
				// TODO: process .tldr.md files
				this.tldrawData.disableCompression = false;
			}
			// use tldrawDataJson
			await this.loadDrawing(true);

		});
	}

	// resets the view whenever Obsidian unloads the file.
	clear() {
		console.log("view.clear()");
		console.log("view.clear()");

		// TODO:
	}

	// returns the current state of the data.
	// Obsidian uses this method to decode the view data into plaintext before writing it to a file.
	getViewType() {
		console.log("view.getViewType()");

		return VIEW_TYPE_TLDRAW_EMBED
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

	// make data editable
	refresh() {
		console.log("view.refresh()");

		// TODO: how to let user save diagram
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
		debug({
			where:"TLdrawView.instantiateTldraw",
			file:this.file.name,
			width: this.contentEl.clientWidth,
			height: this.contentEl.clientHeight,
		})

		console.log(this.containerEl.children);
		// Output of console.log
		// HTMLCollection(2) [div.view-header, div.view-content]
		// 0: div.view-header
		// 1: div.view-content
		console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>

		// mount the component
		const mountableReactRoot = this.reactRoot;

		mountableReactRoot.render(
			<AppContext.Provider value={this.app}>
				<ObsTLdrawApp
					currentFile={this.tldrawData.tldrawDataTDFile}
					theme={this.tldrawPluginApi.darkTheme()}
				/>
			</AppContext.Provider>
		);
	}
}
