import * as React from "react";
import { useObsidianApp } from "./hooks";

export const ReactComponent1 = () => {
	const { vault } = useObsidianApp();

	return <h4>{vault.getName()}</h4>;
};
