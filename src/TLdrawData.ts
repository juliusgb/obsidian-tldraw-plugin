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
	 * 	- json string -> tldrawDataFile -> TDFile
	 * <br/>
	 * After user makes changes in Tldraw, this file is updated
	 */
	public tldrawDataFile: TDFile;


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

		// debug({where:"TLdrawData.loadLegacyData", file:this.file.name, mData: data, dataJson: this.tldrawJson,
		// dataAsTDFile: this.tldrawDataFile, });

		return true;

	}
}
