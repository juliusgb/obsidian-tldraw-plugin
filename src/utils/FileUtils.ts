// taken from https://github.com/zsviczian/obsidian-excalidraw-plugin/blob/master/src/utils/FileUtils.ts
import {TldrawSettings} from "../settings";
import {normalizePath, Notice, TAbstractFile, TFile, TFolder, Vault} from "obsidian";

export function getDrawingFilename(settings: TldrawSettings): string {

	// E.g., YYYY-MM-DD HH.mm.ss is formatted to 2022-09-03 17.53.10
	const dateTimeValue = window.moment().format(settings.drawingFilenameDateTime);

	const filenameWithDateTime = settings.drawingFilenameDateTime !== "" ? dateTimeValue : "";

	const markdownFileExtension = settings.useTldrawExtension ? ".tldr.md" : ".md";

	const fileExtension = settings.compatibilityMode ? ".tldr" : markdownFileExtension;

	return settings.drawingFilenamePrefix + filenameWithDateTime + fileExtension ;
}

/**
 * Open or create a folderpath if it does not exist
 * @param folderpath
 */
export async function checkAndCreateFolder(folderpath: string) {
	const vault = app.vault;
	folderpath = normalizePath(folderpath);

	// https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/658
	//@ts-ignore
	const folder = vault.getAbstractFileByPathInsensitive(folderpath);

	if (folder && folder instanceof TFolder) {
		return;
	}

	if (folder && folder instanceof TFile) {
		new Notice(`The folder cannot be created because it already exists as a file: ${folderpath}.`)
	}

	await vault.createFolder(folderpath);
}

/**
 * Create new file, if file already exists find first unique filename by adding a number to the end of the filename
 * @param vault
 * @param filename
 * @param folderpath
 * @returns
 */
export function getNewUniqueFilepath(
	vault: Vault,
	filename: string,
	folderpath: string,
): string {

	let fname = normalizePath(`${folderpath}/${filename}`);

	// @ts-ignore
	let file: TAbstractFile = vault.getAbstractFileByPath(fname);

	let i = 0;

	const extension = filename.endsWith(".tldr.md")
		? ".tldr.md"
		: filename.slice(filename.lastIndexOf("."));

	while (file) {
		fname = normalizePath(
			`${folderpath}/${filename.slice(
				0,
				filename.lastIndexOf(extension),
			)}_${i}${extension}`,
		);
		i++;
		// @ts-ignore
		file = vault.getAbstractFileByPath(fname);
	}

	return fname;
}
