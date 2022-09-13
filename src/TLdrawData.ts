import {Notice, TFile} from "obsidian";
import {debug} from "./utils/Utils";
import {TDFile} from "@tldraw/tldraw";

export class TLdrawData {
	private compatibilityMode: boolean = false;

	// @ts-ignore
	private file: TFile = null;

	// TODO: deal with compressed json
	disableCompression: boolean = false;

	public loaded: boolean = false;
	public tldrawJson: any = null;


	// tldraw specific types
	public tldrawDataTDFile: TDFile;

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
			this.tldrawDataTDFile = JSON.parse(data) as TDFile;
		}
		catch (error) {
			// TODO: what to do when we get a badly formed .tldr file?
			new Notice('The file looks corrupted!');
		}

		debug({where:"TLdrawData.loadLegacyData",file:this.file.name, data:this.tldrawJson, after:"loadLegacyData"});

		return true;

	}
}
