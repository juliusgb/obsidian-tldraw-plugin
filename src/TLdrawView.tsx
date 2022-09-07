import {TextFileView, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import {createRoot, Root} from "react-dom/client";
import TLdrawObsApp from "./TLdrawObsApp";
import { AppContext } from "./context";

import {
	VIEW_TYPE_TLDRAW, VIEW_TYPE_TLDRAW_EMBED
} from "./constants"

import TldrawPlugin from "./main";

import {
	TLdrawData
} from "./TLdrawData";
import {debug} from "./utils/Utils";

export default class TLdrawView extends TextFileView {
	public plugin: TldrawPlugin;
	public tldrawData: TLdrawData;
	public compatibilityMode: boolean = false;
	private reactRoot: Root;

	constructor(leaf: WorkspaceLeaf, plugin: TldrawPlugin) {
		super(leaf);
		this.plugin = plugin;
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

		// TODO:

		// when the loading of the vault into the memory is done
		this.app.workspace.onLayoutReady(async () => {
			this.compatibilityMode = this.file.extension === "tldraw";
			await this.plugin.loadSettings();

			debug({where:"TLdrawView.setViewData",file:this.file.name, data:data, before:"checkingDataForNull"})

			let dataToUse = null;

			if (data) {
				dataToUse = data;
			}
			else {
				dataToUse = await(this.plugin.getBlankDrawing());
			}

			debug({where:"TLdrawView.setViewData",file:this.file.name, data:dataToUse, after:"checkingDataForNull"})

			if (this.compatibilityMode) {
				// populate tldrawDataJson
				await this.tldrawData.loadLegacyData(dataToUse, this.file);

				this.tldrawData.disableCompression = true;
			}
			else {
				// TODO: process .tldraw.md files
				this.tldrawData.disableCompression = false;
			}
			// use tldrawDataJson
			await this.loadDrawing(true);

		});
	}

	// resets the view whenever Obsidian unloads the file.
	clear() {
		console.log("view.clear()");

		// TODO:
	}

	getViewType() {
		console.log("view.getViewType()");
		return VIEW_TYPE_TLDRAW_EMBED
	}



	// hooks to setup and tear down the view
	// async onOpen() {
	// 	console.log("view.onOpen()");
	//
	// 	console.log(this.containerEl.children);
	// 	// Output of console.log
	// 	// HTMLCollection(2) [div.view-header, div.view-content]
	// 	// 0: div.view-header
	// 	// 1: div.view-content
	//
	// 	console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>
	//
	// 	// mount the component
	// 	const mountableReactRoot = this.reactRoot;
	//
	// 	mountableReactRoot.render(
	// 		<AppContext.Provider value={this.app}>
	// 			<TLdrawObsApp />
	// 		</AppContext.Provider>
	// 	);
	//
	//
	// 	// TODO: how pass the data (tldraw json) to the tldraw react component
	// }

	private createReactRoot(): Root {
		const obsidianContentDivContainer = this.containerEl.children[1];
		const mountableReactRoot = createRoot(obsidianContentDivContainer);
		return mountableReactRoot;
	}

	async onClose() {
		console.log("view.onClose()");

		// React 18's way of removing a mounted React component from the DOM.
		this.reactRoot.unmount();

		this.contentEl.empty();
	}

	refresh() {
		console.log("view.refresh()");

		// TODO: how to let user save diagram
	}

	/**
	 *
	 * @param justloaded - a flag to trigger zoom to fit after the drawing has been loaded
	 */
	private async loadDrawing(justloaded: boolean) {
		const tldrawDataJson = this.tldrawData.tldrawJson;

		this.instantiateTldraw({
			shapes: tldrawDataJson.shapes,
			bindings: tldrawDataJson.bindings,
			assets: tldrawDataJson.assets
		});
	}

	private instantiateTldraw(param: { assets: number; shapes: any; bindings: any }) {
		debug({where:"TLdrawView.instantiateTldraw",file:this.file.name})

		console.log(this.containerEl.children);
		// Output of console.log
		// HTMLCollection(2) [div.view-header, div.view-content]
		// 0: div.view-header
		// 1: div.view-content
		console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>

		// mount the component
		const mountableReactRoot = this.reactRoot;

		// TODO: how pass the data (tldraw json) to the tldraw react component

		mountableReactRoot.render(
			<AppContext.Provider value={this.app}>
				<TLdrawObsApp />
			</AppContext.Provider>
		);
	}
}
