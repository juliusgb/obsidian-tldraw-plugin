import * as React from "react";
import { Tldraw, TldrawApp, TDDocument, TDFile } from "@tldraw/tldraw";
//import "../styles.css";

import { useObsidianApp } from "../hooks";

import { defaultDocument } from '../../utils/defaultDocument'
import {debug} from "../../utils/Utils";

// Will be placed in global scope by extension
declare let currentFile: TDFile
declare let assetSrc: string

export default function TLdrawObsApp() {
	// @ts-ignore
	const { vault } = useObsidianApp();
	console.log("vault name: " + vault.getName());

	const rLoaded = React.useRef(false)
	const rTldrawApp = React.useRef<TldrawApp>()

	// When the editor mounts, save the state instance in a ref.
	const handleMount = React.useCallback((tldrawApp: TldrawApp) => {
		debug({where:"TLdrawObsApp.handleMount" })
		TldrawApp.assetSrc = assetSrc ?? 'tldraw-assets.json'
		rTldrawApp.current = tldrawApp
	}, [])

  //const id = "tldraw-example"; // [1]

	// TODO: figure out how to use the handleMount

	// @ts-ignore
	return (
		<div className="tldrawApp" >
			<h1>Tldraw Example</h1>
			<div className="tldraw-wrapper">
				{/*<Tldraw*/}
				{/*	id={rInitialDocument.current.id}*/}
				{/*	document={rInitialDocument.current}*/}
				{/*	onMount={handleMount}*/}
				{/*/>*/}
				<Tldraw />
			</div>
    </div>
  );
}

/*
[1] The state will be preserved under this id
[2] You can issue imperative commands to the state. For example:

  state
    .createShapes({
      id: "rect1",
      type: "rectangle",
      point: [100, 100],
      size: [200, 200]
    })
    .updateShapes({
      id: "rect1",
      point: [150, 150]
    })
    .selectAll();

Will create a shape, move its point, and then select it.
*/
