:zap: Development has just started. Definitely not stable. See <https://github.com/tldraw/tldraw/issues/919> :zap:

# Obsidian Tldraw Plugin

This plugin integrates [Tldraw](https://github.com/tldraw/tldraw) in [Obsidian](https://obsidian.md).

## Installation

To install:
- clone or unzip into your `.obsidian/plugins/` directory.
- in the terminal, change to `.obsidian/plugins/plugins/obsidian-tldraw-plugin`
- run `npm install`
- run `npm run dev`

Since development has just started, this plugin is not yet registered as a community plugin for downloading within Obisidian.

## Test & Run

- In your Obsidian Vault, save any file with extension `.tldraw`, such as `test.tldraw`.
- Click on it. That will activate the `obsidian-tldraw-plugin`.

## Features

Current features:

- Adds a ribbon icon, which shows a pop-up `TLdraw clicked` when clicked.
- Adds a plugin setting tab to the settings page.
- Clicking a file with extension `.tldraw` opens up Tldraw.

[This GitHub Project](https://github.com/users/juliusgb/projects/3/views/1) contains most up-to-date plans.

## Discussion and Feedback

I appreciate any feedback that you're able to give.
Please use the [GitHub issue tracker](https://github.com/juliusgb/obsidian-tldraw-plugin/issues/new) to report bugs, request features,
or suggest improvements, or message me over on Discord (juliusg#0919).

## Helpful resources

- For commits, I'm using "Conventional Commits" - <https://www.conventionalcommits.org/en/v1.0.0/>
- Obisidan Plugin Developer docs at <https://marcus.se.net/obsidian-plugin-docs/>
- Tldraw code
  - clone the repo, <https://github.com/tldraw/tldraw>
  - in terminal, navigate to /path/to/tldraw
  - run `yarn && yarn build:packages && yarn build`
  - run `yarn start` which starts the server on `http://localhost:5420/`
  - navigate to `http://localhost:5420/` and be inspired by all the examples
