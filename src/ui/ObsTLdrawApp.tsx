import * as React from "react";
import {Tldraw, TldrawApp, TDDocument, TDFile} from "@tldraw/tldraw";
//import "../styles.css";

import {debug} from "../utils/Utils";
import {defaultDocument} from "./defaultDocument";

let currentFile: TDFile | null = null;

export function initializeTDFile(initialTDfile: TDFile) {
	debug({where:"ObsTLdrawApp.initializeTDFile", initTDfile:initialTDfile});
	currentFile = initialTDfile;
}

export default function ObsTLdrawApp(props: any) {
	const rLoaded = React.useRef(false);
	const rTldrawApp = React.useRef<TldrawApp>();
	const rCurrentDoc = React.useRef<TDDocument>(
		currentFile ? currentFile.document : defaultDocument
	)

	// When the editor mounts, save the state instance in a ref, and load initial document
	const handleMount = React.useCallback((tldrawApp: TldrawApp) => {
		TldrawApp.assetSrc = props.assetSrc ?? 'tldraw-assets.json'
		rTldrawApp.current = tldrawApp;

		const document = rCurrentDoc.current;

		debug({
			where: "ObsTLdrawApp.handleMount",
			mApp: rTldrawApp,
			before: "tldrawApp.loadDocument",
			currTDFile: currentFile,
			docInHandleMount: document,
			appcss: TldrawApp.assetSrc});

		if (!rLoaded.current) {
			tldrawApp.loadDocument(document);
			rLoaded.current = true;
		}
	}, [])

	const handleChange = React.useCallback((tldrawApp: TldrawApp) => {
		const document = rCurrentDoc.current;

		debug({
			where:"ObsTLdrawApp.handleChange",
			callBackTldraw:tldrawApp,
			currTDFile:currentFile,
			docInHandlePersist:document,
			myStateSnapshot: tldrawApp.state,
			before:"state change"
		});

		// TODO: figure out why/how this works

		const nextDocUpdatedInTldraw = tldrawApp.state.document;
		rCurrentDoc.current = nextDocUpdatedInTldraw;

		debug({
			where:"ObsTLdrawApp.handleChange",
			after:"state change",
			currTDFile:currentFile
		});
	}, []);

	return (
		<div className="tldrawApp">
			<h1>TLdraw Example</h1>
			<div className="tldraw-wrapper">
				<Tldraw
					id={rCurrentDoc.current.id}
					document={rCurrentDoc.current}
					onMount={handleMount}
					onChange={handleChange} // get updated when the document changes / adds an undo/redo entry
					darkMode={ props.theme }
				/>
			</div>
		</div>
	)
}
