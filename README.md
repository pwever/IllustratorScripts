# Illustrator scripts #

A number of scripts, to work around some of the pain-points of Adobe Illustrator:

* Previewing and emailing AI files is often impeded, because they are either huge, or are missing linked assets.
* It is rather difficult to export individual elements as image files in order to embed them into PDFs or PPTs. Web export allows for some of this, but feels rather involved.




## Collect.js ##

Very straightforward script that copies all embedded image files into a ASSET_FOLDER_NAME folder, next to the current Illustrator file.

## Distribute To Grid.jsx ##

Specify the number of columns, as well as width and height for each grid cell, and the script scales, crops and moves all selected elements into a grid. The grid dimensions default to the smallest width and height within the selection.


## Distribute To Strip.jsx ##

This script takes the selection and arranges all items into a strip with even height. Choose the height of the strip, otherwise the script defaults to the shortest item in the selection.


## End Of Day.jsx ##

1. collects all linked assets in an asset folder
2. exports PNGs based on special layer names
3. saves a 'smallest file size' PDF

The PNGs are exported as follows. There are two tags (#device and #screen) that can be added to a layer. If the script find a layer with that name, it will export all layer root level elements bounds as a PNG. Prior to the export, it will turn off all layers tagged with either !device/!screen or !png.

### Todo ###

* In stead of hard coding the tags, it would be nice to allow freeform tagging (anything with a # and !).

## Export Selection To PNGs.jsx ##

Exports PNGs based on bounds of all the selected elements.

## Package.js ##

Choose output folder, and indicate whether or not you want to 
outline text elements, and this script will save a copy of the currently open document, and collect all embedded files into a _asset folder.






