# Obsidian Tldraw Plugin Changelog

## 0.1.4

### Improvements

Replaced the dice logo with the tldraw logo on the ribbon:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/29

## 0.1.3

### Improvements

The tldraw `Styles` pop-up is now visible:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/39

![SpaceForStylesPopup](https://user-images.githubusercontent.com/85777/204081610-37b9213c-4b7b-4638-9d17-cdffe19c6062.gif)


## 0.1.2

### New

Make filename properties (prefix and date format) changeable via the plugin's settings:
https://github.com/juliusgb/obsidian-tldraw-plugin/issues/23

- make the change
- reload the plugin
- create the drawing

![Settings-Filename-uniqueness](https://user-images.githubusercontent.com/85777/203471639-aae7e5b5-80dc-4fd6-b2f3-423a2045fb3e.gif)


if the date format of the filename doesn't guarantee that the next created filename is not unique, then a
suffix of `_` followed by a number is added to the filename.

- this number starts from `0` when Obsidian starts. It increases by `1` for every newly created file.
- to reset this number to `0`, restart Obsidian.

![Settings-Filename-Suffix-when-no-uniqueness](https://user-images.githubusercontent.com/85777/203471538-29768d69-d2d0-4773-8c87-16e6e3aa8085.gif)


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
