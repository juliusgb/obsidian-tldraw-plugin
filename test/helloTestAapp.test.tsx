import { render, screen } from "@testing-library/react";
import * as React from "react";

import TestHelloApp from "../src/HelloTestApp";
import TLdrawObsApp from "../src/TLdrawObsApp";

// test("TLdrawObsApp", () => {
// 	render(<TLdrawObsApp />);
// 	screen.debug();
// })

describe('TestHelloApp', () => {
	test('renders TestHelloApp component', () => {
		render(<TestHelloApp />);
		screen.debug();
	});
});
