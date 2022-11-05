import * as React from "react";
import {Tldraw, TldrawApp, TDDocument, TDFile} from "@tldraw/tldraw";
//import "../styles.css";

import {debug, errorlog} from "../utils/Utils";
import {defaultDocument} from "./defaultDocument";
import * as util from "util";

/**
 * returns the current TDFile object. It contains the most current drawing.
 */
let getTldrawDoc: Function;

export default function ObsTLdrawApp(props: any) {
	const rTldrawApp = React.useRef<TldrawApp>();

	const tldrawDataFile = props.obsTldrawDataFile;
	const rCurrentDoc = React.useRef<TDDocument>(
		tldrawDataFile ? tldrawDataFile.document : defaultDocument
	);
	const rLoaded = React.useRef(false);
	const rMounted = React.useRef(false);
	// tracks first time handleMount is called and before useEffect ran
	const rUseEffectKickedIn = React.useRef(false);

	// When the editor mounts, save the state instance in a ref, and load initial document
	const handleMount = React.useCallback((tldrawApp: TldrawApp) => {
		TldrawApp.assetSrc = props.assetSrc ?? 'tldraw-assets.json'
		rTldrawApp.current = tldrawApp;

		rCurrentDoc.current = tldrawDataFile.document;

/*		debug({
			where: "ObsTLdrawApp.handleMount",
			mApp: rTldrawApp,
			appcss: TldrawApp.assetSrc,
			before: "tldrawApp.loadDocument",
			rCurr: rCurrentDoc,
			currTDFile: tldrawDataFile,
			docInHandleMount: rCurrentDoc.current,
			mProps: props,
			loaded: rLoaded.current,
			useEffectKickedIn: rUseEffectKickedIn.current
		});
*/

		// file only changes in tldraw that's embedded in obsidian
		if (!rLoaded.current && !rUseEffectKickedIn.current) {
			console.log("Loading doc");
			tldrawApp.loadDocument(rCurrentDoc.current);
			rLoaded.current = true;
			rMounted.current = true;
		}
		else {
			console.log("Doc already loaded");
		}

	}, [])

	const handleChange = React.useCallback((tldrawApp: TldrawApp) => {
		// debug({ where:"ObsTLdrawApp.handleChange", callBackTldraw:tldrawApp, docInHandleChange:rCurrentDoc.current,
		// myStateSnapshot: tldrawApp.state, before:"state change" });

		const nextDocUpdatedInTldraw = tldrawApp.state.document;
		rCurrentDoc.current = nextDocUpdatedInTldraw;
	}, []);

	getTldrawDoc = () => {
		const currentDrawingDocument = rCurrentDoc.current;

		const drawingDocFromTldrawSide: TDFile = {
			...tldrawDataFile,
			document: currentDrawingDocument
		} as TDFile;

		return drawingDocFromTldrawSide;
	}


	function openAnotherDrawingInSamePaneAsAlreadyOpenedDrawing(
		mounted: boolean,
		loaded: boolean,
		prevDoc: TDDocument | null,
		nextDoc: TDDocument) {

/*
		debug({
			where: "ObsTLdrawApp.openAnotherDrawingInPanelOfAlreadyLoadedDrawing",
			rMounted: rMounted.current,
			rLoaded: rLoaded.current,
			prevDocLoadedInTldraw: prevDoc,
			newDocToLoadInTldraw: nextDoc
		});
*/

		if (
			rMounted.current === true &&
			rLoaded.current === true &&
			!(util.isDeepStrictEqual(prevDoc, nextDoc))
		) {
			console.log("Conditions met");
			return true;
		}
		else {
			console.log("Conditions NOT met");
			return false;
		}
	}

	const [isAnotherFileLoaded, setIsAnotherFileLoaded] = React.useState(false);
	React.useEffect(() => {
		// will run after React renders tldraw
		function watchNewFileLoaded(evt: CustomEvent<any>) {
			const app = rTldrawApp.current;
			const prevDocLoadedInTldraw = rCurrentDoc.current;

			const newFileLoadedInObsidian: TDFile = evt.detail.newFile;
			const newDocToLoadInTldraw = newFileLoadedInObsidian.document;

/*	debug({
				where: "ObsTLdrawApp.useEffect",
				mEvt: evt,
				mtldrawApp: rTldrawApp,
				mApp: app,
				prevDoc: prevDocLoadedInTldraw,
				nextDoc: newDocToLoadInTldraw,
				myrLoaded: rLoaded.current,
				myrMounted: rMounted.current,
				useEffectKickedIn: rUseEffectKickedIn.current,
				mProps: props
			});
*/

			// 1. new drawing (fileA) is being opened for first time and there's no other drawing open in same pane:
			//		expect: drawing in fileA to be shown. Not drawing from previously closed files.
			//		How? Works out-of-the-box.
			// 2. drawing (fileA) already opened in pane1 in obsidian and user opens same drawing file (fileA) in another pane2:
			//		expect: drawings in fileA are preserved. Both are visible in both panes. TODO: how to sync between them?
			//		How? Works out-of-the-box. But TODO: how to sync between them?
			// 3. drawing (fileA) already opened in pane1 in obsidian and User opens another drawing (fileB) in same pane1.
			//		expect: drawing (fileB) to replace fileA
			// 4. drawing (fileA) already opened in pane1 in obsidian. User opens another drawing (fileB) in another pane1.
			//		expect: drawing (fileA) in pane1 and fileB in pane2.
			//		How? Works out-of-the-box.

			// logic below is for #3.
			try {
				const openNewFileOntopOfAlreadyOpenedFile = openAnotherDrawingInSamePaneAsAlreadyOpenedDrawing(
						rMounted.current, rLoaded.current, prevDocLoadedInTldraw, newDocToLoadInTldraw);
				if (openNewFileOntopOfAlreadyOpenedFile) {
					console.log("re-load");
					app?.loadDocument(newDocToLoadInTldraw);
					rUseEffectKickedIn.current = true;
				}
			}
			catch (e) {
				errorlog({ where: "ObsTLdrawApp.useEffect", error: e });
			}
			setIsAnotherFileLoaded(evt.detail.isNewFileLoaded);
		}
		// when document receives the 'newFile:Obsidianloaded' eventType, re-register the function to the document
		document.addEventListener("newFile:Obsidianloaded", watchNewFileLoaded);
		// when we're finished, react calls this clean up function
		return function() {
			console.log("Cleaning up...");
			setIsAnotherFileLoaded(false);
			document.removeEventListener("newFile:Obsidianloaded", watchNewFileLoaded);
		}
	}, [isAnotherFileLoaded]);


	return (
		<div className="tldrawApp">
			<h1>TLdraw Example</h1>
			<div className="tldraw-wrapper">
				<Tldraw
					onMount={handleMount}
					onChange={handleChange} // get updated when the document changes / adds an undo/redo entry
					// leave saving the drawing as json to Obsidian
					darkMode={ props.theme }
				/>
			</div>
		</div>
	)
}

function triggerEvent(eventType: string, data: any) {
	const event = new CustomEvent(eventType, { detail: data });
	document.dispatchEvent(event);
}

export { getTldrawDoc, triggerEvent }
