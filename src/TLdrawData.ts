import {TFile} from "obsidian";
import {debug} from "./utils/Utils";

export class TLdrawData {
	private compatibilityMode: boolean = false;

	// @ts-ignore
	private file: TFile = null;

	// TODO: deal with compressed json
	disableCompression: boolean = false;

	public loaded: boolean = false;
	public tldrawJson: any = null;

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

		debug({where:"TLdrawData.loadLegacyData",file:this.file.name, data:this.tldrawJson, after:"loadLegacyData"});

		return true;

	}
}
