// Collect linked files into a _assets folder next to the active document.


ASSET_FOLDER_NAME = "_assets";
doc = app.activeDocument;

asset_folder = new Folder(doc.path + "/" + ASSET_FOLDER_NAME);
if (asset_folder.exists || asset_folder.create) {
	for (i=0;i<doc.placedItems.length;i++) {
		linked_file = doc.placedItems[i].file;
		collected_file = File(asset_folder+"/"+linked_file.name);
		if (collected_file.fullName!=linked_file.fullName) {
			linked_file.copy(collected_file);
			doc.placedItems[i].file = collected_file;
		}
	}
	for (i=0;i<doc.rasterItems.length;i++) {
		if (doc.rasterItems[i].embedded) {
			alert(doc.rasterItems[i].file)
			continue;
		}
		linked_file = doc.rasterItems[i].file;
		collected_file = File(asset_folder+"/"+linked_file.name);
		if (collected_file.fullName!=linked_file.fullName) {
			linked_file.copy(collected_file);
			doc.rasterItems[i].file = collected_file;
		}
	}
	
} else {
	alert("Unable to create the assets folder.");
}

