# Development

To install:
- in your terminal, navigate to `/path/to/ObsidianVault/plugins` and clone this repository
- then still in your terminal, navigate to `.obsidian/plugins/plugins/obsidian-tldraw-plugin`
- run `npm install`

To run:
- in your Obsidian Vault, go to Community Plugins, and enable the plugin
- on the ribbon, click on the `dice` icon. When hovered over, it displays `New Tldrawing`
- Click on it. That will create a file with extension `.tldraw` and will activate the `obsidian-tldraw-plugin`

## Development workflow

- in your Obsidian test Vault, add the [Hot-Reload](https://github.com/pjeby/hot-reload) plugin, which reloads the plugin whenever the source code changes.
- in your terminal, navigate to `/path/to/ObsidianVault/plugins/.obsidian/plugins/plugins/obsidian-tldraw-plugin`
- run `npm run dev`
- any new code changes will appear in the Obsidian

## Helpful resources

- For commits, I'm using "Conventional Commits" - <https://www.conventionalcommits.org/en/v1.0.0/>
- Obisidan Plugin Developer docs at <https://marcus.se.net/obsidian-plugin-docs/>
- Tldraw code
	- clone the repo, <https://github.com/tldraw/tldraw>
	- in terminal, navigate to /path/to/tldraw
	- run `yarn && yarn build:packages && yarn build`
	- run `yarn start` which starts the server on `http://localhost:5420/`
	- navigate to `http://localhost:5420/` and be inspired by all the examples
