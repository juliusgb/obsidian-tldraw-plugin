import * as React from "react";

import {
	App,
} from "obsidian";

import { AppContext } from "./context";

/**
 * custom hook that makes easier to use the context in your components.
 */
export const useObsidianApp = (): App | undefined => {
	return React.useContext(AppContext);
};
