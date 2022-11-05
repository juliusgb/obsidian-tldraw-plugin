# Obsidian Tldraw Plugin Changelog

## 0.1.1

### New

When a diagram is already open,
opening another diagram in the same pane displays the new diagram:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/23

![OpenNewFileOnTopExistingOneWorks](https://user-images.githubusercontent.com/85777/198817330-e9fbb6b0-8864-4e91-8a67-447ccee75ee6.gif)

## 0.1.0

### New

Can now edit and click in Obsidian to save the drawing which updates the `.tldr` file:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/26

## 0.0.5

### Improvements

When the Obsidian window resizes, so does the tldraw diagram. And the scrollbars adjust accordingly:
https://github.com/obsidian-tldraw-plugin/issues/25

## 0.0.4

### New
- New files created with this plugin have a file extension of `.tldr` instead of `.tldraw` to be compatible with other
tldraw tools like <https://tldraw.com> and the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=tldraw-org.tldraw-vscode)
- When in Obsidian's Vault settings, the base theme is configured to be dark, the tldraw drawings also open up in a
dark theme.
- When file opened, and shapes are added to it, these are preserved when file is closed and reopened:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/5

### Internal technical changes

- Using tldraw's api to load documents and keep the drawn shapes updated:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/11
- Refactored some logic to sit behind an internal api layer to keep source code files shorter and
to accomodate where a drawing is opened from - via the Obsidian Ribbon or via this custom view.
