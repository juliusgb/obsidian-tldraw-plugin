# Development

To install:
- In your terminal, navigate to `/path/to/ObsidianVault/plugins` and clone this repository
- in your terminal, navigate to `.obsidian/plugins/plugins/obsidian-tldraw-plugin`
- run `npm install`
- run `npm run dev`

To run:
- In your Obsidian Vault, on the ribbon, click on the `dice` icon. When hovered over, it displays `New Tldrawing`
- Click on it. That will create a file with extension `.tldraw` and will activate the `obsidian-tldraw-plugin`.

## Helpful resources

- For commits, I'm using "Conventional Commits" - <https://www.conventionalcommits.org/en/v1.0.0/>
- Obisidan Plugin Developer docs at <https://marcus.se.net/obsidian-plugin-docs/>
- Tldraw code
	- clone the repo, <https://github.com/tldraw/tldraw>
	- in terminal, navigate to /path/to/tldraw
	- run `yarn && yarn build:packages && yarn build`
	- run `yarn start` which starts the server on `http://localhost:5420/`
	- navigate to `http://localhost:5420/` and be inspired by all the examples
