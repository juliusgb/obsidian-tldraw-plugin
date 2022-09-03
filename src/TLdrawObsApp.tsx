import * as React from "react";
import { Tldraw, TldrawApp } from "@tldraw/tldraw";
//import "../styles.css";

import { useObsidianApp } from "./hooks";

export default function TLdrawObsApp(props) {
	const { vault } = useObsidianApp();
	console.log("vault name: " + vault.getName());

	console.log(props.initialData);

  const rTLDrawApp = React.useRef<TldrawApp>();

  const id = "tldraw-example"; // [1]

	// TODO: figure out how to use
  const handleMount = React.useCallback((tldrawApp: TldrawApp) => {
    rTLDrawApp.current = tldrawApp; // [2]
  }, []);

  return (
		<div className="tldrawApp" ref={rTLDrawApp}>
			<h1>Tldraw Example</h1>
			<div className="tldraw-wrapper">
				<Tldraw id={id} />
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
