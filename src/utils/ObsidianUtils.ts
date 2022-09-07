// from https://github.com/zsviczian/obsidian-excalidraw-plugin/blob/master/src/utils/ObsidianUtils.ts

import {WorkspaceLeaf} from "obsidian";
import TldrawPlugin from "../main";

export const isObsidianThemeDark = () => document.body.classList.contains("theme-dark");

/*
| Setting                 |                                       Originating Leaf                                                       |
|                         | Main Workspace                   | Hover Editor                           | Popout Window                    |
| ----------------------- | -------------------------------- | -------------------------------------- | -------------------------------- |
| InMain  && InAdjacent   | 1.1 Reuse Leaf in Main Workspace | 1.1 Reuse Leaf in Main Workspace       | 1.1 Reuse Leaf in Main Workspace |
| InMain  && !InAdjacent  | 1.2 New Leaf in Main Workspace   | 1.2 New Leaf in Main Workspace         | 1.2 New Leaf in Main Workspace   |
| !InMain && InAdjacent   | 1.1 Reuse Leaf in Main Workspace | 3   Reuse Leaf in Current Hover Editor | 4   Reuse Leaf in Current Popout |
| !InMain && !InAdjacent  | 1.2 New Leaf in Main Workspace   | 2   New Leaf in Current Hover Editor   | 2   New Leaf in Current Popout   |
*/

export const getNewOrAdjacentLeaf = (
	plugin: TldrawPlugin,
	leaf: WorkspaceLeaf
): WorkspaceLeaf => {
	//@ts-ignore
	const leafId = leaf.id;
	const layout = app.workspace.getLayout();
	const getLeaves = (l:any)=> l.children
		.filter((c:any)=>c.type!=="leaf")
		.map((c:any)=>getLeaves(c))
		.flat()
		.concat(l.children.filter((c:any)=>c.type==="leaf").map((c:any)=>c.id))

	const mainLeavesIds = getLeaves(layout.main);

	const leafLoc =
		layout.main && mainLeavesIds.contains(leafId)
			? "main"
			: layout.floating && getLeaves(layout.floating).contains(leafId)
				? "popout"
				: layout.left && getLeaves(layout.left).contains(leafId)
					? "left"
					: layout.right && getLeaves(layout.right).contains(leafId)
						? "right"
						: "hover";

	const getMainLeaf = ():WorkspaceLeaf => {
		let mainLeaf = app.workspace.getMostRecentLeaf();
		if(mainLeaf && mainLeaf !== leaf && mainLeaf.view?.containerEl.ownerDocument === document) {
			return mainLeaf;
		}
		mainLeaf = null;
		mainLeavesIds
			.forEach((id:any)=> {
				const l = app.workspace.getLeafById(id);
				if(mainLeaf ||
					!l.view?.navigation ||
					leaf === l
				) return;
				mainLeaf = l;
			})

		// @ts-ignore
		return mainLeaf;
	}

	//1
	// @ts-ignore
	if(plugin.settings.openInMainWorkspace || ["main","left","right"].contains(leafLoc)) {
		//1.1
		// @ts-ignore
		if(!plugin.settings.openInAdjacentPane) {
			if(leafLoc === "main") {
				return app.workspace.createLeafBySplit(leaf);
			}
			const ml = getMainLeaf();
			return ml
				? (ml.view.getViewType() === "empty" ? ml : app.workspace.createLeafBySplit(ml))
				: app.workspace.getLeaf(true);
		}

		//1.2
		const ml = getMainLeaf();
		return ml ?? app.workspace.getLeaf(true);
	}

	//2
	// @ts-ignore
	if(!plugin.settings.openInAdjacentPane) {
		return app.workspace.createLeafBySplit(leaf);
	}

	//3
	if(leafLoc === "hover") {
		const leaves = new Set<WorkspaceLeaf>();
		app.workspace.iterateAllLeaves(l=>{
			//@ts-ignore
			if(l!==leaf && leaf.containerEl.parentElement === l.containerEl.parentElement) leaves.add(l);
		})
		if(leaves.size === 0) {
			return plugin.app.workspace.createLeafBySplit(leaf);
		}
		return Array.from(leaves)[0];
	}

	//4
	if(leafLoc === "popout") {
		const popoutLeaves = new Set<WorkspaceLeaf>();
		app.workspace.iterateAllLeaves(l=>{
			if(l !== leaf && l.view.navigation && l.view.containerEl.ownerDocument === leaf.view.containerEl.ownerDocument) {
				popoutLeaves.add(l);
			}
		});
		if(popoutLeaves.size === 0) {
			return app.workspace.createLeafBySplit(leaf);
		}
		return Array.from(popoutLeaves)[0];
	}

	return plugin.app.workspace.createLeafBySplit(leaf);
};
