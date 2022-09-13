import * as React from "react";
import { Tldraw, TldrawApp, TDDocument } from "@tldraw/tldraw";
//import "../styles.css";

import {debug, errorlog} from "../utils/Utils";
import {defaultDocument} from "./defaultDocument";

export default function ObsTLdrawApp(props: any) {

	const rLoaded = React.useRef(false)
	const rTldrawApp = React.useRef<TldrawApp>()
	const rInitialDocument = React.useRef<TDDocument>(
		props.currentFile ? props.currentFile.document : defaultDocument
	)

	// When the editor mounts, save the state instance in a ref, and load initial document
	const handleMount = React.useCallback((tldrawApp: TldrawApp) => {
		TldrawApp.assetSrc = props.assetSrc ?? 'tldraw-assets.json'
		rTldrawApp.current = tldrawApp;
		const currentFile = props.currentFile;

		debug({where:"ObsTLdrawApp.handleMount", mApp:rTldrawApp, before:"tldrawApp.loadDocument", mcurrentFile:currentFile, appcss:TldrawApp.assetSrc});

		tldrawApp.loadDocument(currentFile.document);
		rLoaded.current = true;
	}, [])

	const handlePersist = React.useCallback(() => {
		debug({where:"ObsTLdrawApp.handlePersist"});
		// TODO: saving changes
		// noop
	}, [])

	return (
		<div className="tldrawApp" >
			<h1>TLdraw Example 2</h1>
			<div className="tldraw-wrapper">
				<Tldraw
					id={rInitialDocument.current.id}
					document={rInitialDocument.current}
					onMount={handleMount}
					onPersist={handlePersist}
					darkMode={ props.theme }
				/>
			</div>
		</div>
	)
}
