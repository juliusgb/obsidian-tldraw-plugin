import {Notice, TFile} from "obsidian";
import {debug} from "./utils/Utils";
import {TDDocument, TDFile} from "@tldraw/tldraw";

export class TLdrawData {
	private compatibilityMode: boolean = false;

	// @ts-ignore
	private file: TFile = null;

	// TODO: deal with compressed json
	disableCompression: boolean = false;

	public loaded: boolean = false;
	public tldrawJson: any = null;

	/**
	 * Represents the file using Tldraw's type.
	 * <br/>
	 * When user triggers the plugin to create a tldraw drawing:
	 * the plugin takes the json strings this member field
	 * 	- json string -> tldrawDataInTDFile -> TDFile
	 * <br/>
	 * After user makes changes in Tldraw,
	 *
	 */

	// tldraw specific types
	// initial file loaded into tldraw
	// json string -> tldrawDataInTDFile -> TDFile
	// same field is used after user makes changes in tldraw
	public tldrawDataFile: TDFile;
	// after file is modified in tldraw and tldraw sends changes back
	// tldraw -> tldrawDataOutTDFile -> obsidian


	public async loadLegacyData(data: string, file: TFile): Promise<boolean> {

		if (!file) {
			return false;
		}

		if (!data) {
			return false;
		}

		this.compatibilityMode = true;
		this.file = file;
		this.tldrawJson = JSON.parse(data);
		this.loaded = true;

		try {
			this.tldrawDataFile = JSON.parse(data) as TDFile;
		}
		catch (error) {
			// TODO: what to do when we get a badly formed .tldr file?
			new Notice('The file looks corrupted!');
		}

		// debug({where:"TLdrawData.loadLegacyData",file:this.file.name, data:this.tldrawJson, after:"loadLegacyData"});

		return true;

	}
}
