import {TextFileView, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import * as ReactDOM from "react-dom";
import TLdrawObsApp from "./TLdrawObsApp";
import { AppContext } from "./context";

import {
	VIEW_TYPE_TLDRAW, VIEW_TYPE_TLDRAW_EMBED
} from "./constants"
import {createRoot} from "react-dom/client";

export default class TLdrawView extends TextFileView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	// returns the current state of the data.
	// Obsidian uses this method to decode the view data into plaintext before writing it to a file.
	getViewData() {
		console.log("view.getViewData()");

		// TODO:
		// return what should be saved to disk
	}

	// updates the view whenever Obsidian reads new data from a file.
	// Use this method to encode the text data into a format that makes it easier to work with.
	setViewData(data: string, clear: boolean) {
		console.log("view.setViewData()");

		// TODO:
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
	async onOpen() {
		console.log("view.onOpen()");

		console.log(this.containerEl.children);
		// Output of console.log
		// HTMLCollection(2) [div.view-header, div.view-content]
		// 0: div.view-header
		// 1: div.view-content

		console.log(this.containerEl); // prints the actual HTMLElement, i.e., <div>...</div>

		// mount the component
		const obsidianContentDivContainer = this.containerEl.children[1];

		const mountableReactRoot = createRoot(obsidianContentDivContainer);

		mountableReactRoot.render(
			<AppContext.Provider value={this.app}>
				<TLdrawObsApp />
			</AppContext.Provider>
		);

		// TODO: how pass the data (tldraw json) to the tldraw react component
	}

	async onClose() {
		console.log("view.onClose()");

		// TODO: migrate to React 18's way of removing a mounted React component from the DOM.
		// root.unmount()

		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);

		this.contentEl.empty();
	}

	refresh() {
		console.log("view.refresh()");

		// TODO: how to let user save diagram
	}
}
