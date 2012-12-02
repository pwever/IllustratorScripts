// pwever@knittingpxiel.com
// This script exports a package of the currently active document.
// Choose output folder, and indicate whether or not you want to 
// outline text elements.

const FILE_SUFFIX = "-export";
const ASSET_SUFFIX = "-assets";
var doc = app.activeDocument;
if (!doc.saved) doc.save();
var original_file = doc.fullName;


// create text outlines if desired.
if (confirm("Create text outlines?", true)) { while (doc.textFrames.length != 0) { doc.textFrames[0].createOutline(); }}


// collect all linked files
var export_folder = Folder.selectDialog("Choose a folder to package into.");
var arr = doc.name.split(".");
var extension = "";
if (arr.length>1) extension = "." + arr.pop();
var filename = arr.join(".");
var assets_folder = new Folder(export_folder + "/" + filename + ASSET_SUFFIX);
if (assets_folder.exists || assets_folder.create()) {
	var i, in_file, out_file;
	for (i=0;i<doc.placedItems.length;i++) {
		in_file = doc.placedItems[i].file;
		out_file = File(assets_folder+"/"+in_file.name);
		in_file.copy(out_file);
		doc.placedItems[i].file = out_file;
	}
	for (i=0;i<doc.rasterItems.length;i++) {
		if (doc.rasterItems[i].embedded) continue;
		in_file = doc.rasterItems[i].file;
		out_file = File(assets_folder+"/"+in_file.name);
		in_file.copy(out_file);
		doc.rasterItems[i].file = out_file;
	}
	
	// save as new file
	packaged_file = File(export_folder + "/" + filename + FILE_SUFFIX + extension);
	doc.saveAs(packaged_file);
	doc.close();
	
	// re-open the original file
	app.open(File(original_file));
	
} else {
	alert("Unable to create the assets folder.");
}

	

