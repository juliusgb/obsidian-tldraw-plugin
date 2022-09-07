:zap: Development has just started. Definitely not stable. See <https://github.com/tldraw/tldraw/issues/919> :zap:

# Obsidian Tldraw Plugin

This plugin integrates [Tldraw](https://github.com/tldraw/tldraw) in [Obsidian](https://obsidian.md).

## Setup

Since development has just started, this plugin is not yet registered as a community plugin for downloading within Obisidian.

Prepare the required files:

- Naviate to the `releases` tab <https://github.com/juliusgb/obsidian-tldraw-plugin/releases>
- Download the `obsidian-tldraw-plugin-<version-number>`
- Open your preferred zip tool, navigate to `obsidian-tldraw-plugin` and extract it into
	`/path/to/ObsidianVault/plugins/`
- The directory structure should look like this: `.obsidian/plugins/plugins/obsidian-tldraw-plugin`

## Test & Run

- In your Obsidian Vault, on the ribbon, hover over the `dice` icon. It displays `New Tldrawing`
- Click on it. That will create a file with extension `.tldraw` and will activate the `obsidian-tldraw-plugin`.

## Features

Current features:

- Ribbon icon, which when clicked, creates a file with extension `.tldraw` opens up Tldraw.
- Any file with extension `.tldraw` opens up Tldraw.

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
