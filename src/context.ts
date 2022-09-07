import * as React from "react";
import {App} from "obsidian";


/**
 * React context for the Obsidian App to make it globally available
 * to all components inside your React views.
 */
// @ts-ignore
export const AppContext = React.createContext<App>(undefined);
