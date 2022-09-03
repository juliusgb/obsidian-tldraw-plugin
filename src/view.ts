import { ItemView, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE_TLDRAW } from "./constants";

export default class TLdrawView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_TLDRAW;
	}

	// returns a human-friendly name for the view.
	getDisplayText(): string {
		return "TLdraw";
	}

	// called when the view is opened within a new leaf
	// is responsible for building the content of your view.
	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", {text: "TLdraw"} )
	}

	// called when the view should close
	// and is responsible for cleaning up any resources used by the view.
	async onClose() {
		// nothing to cleanup
	}
}
