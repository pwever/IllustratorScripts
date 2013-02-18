

// End of day Illustrator script
// 1. collects all linked assets in an asset folder
// 2. exports PNGs based on special layer names
// 3. saves a small PDF and the original file. 

// The PNGs are exported as follows. First the script
// looks through all layers, and collects any #tag it finds
// Then it loops through the layers, *hides* all layers
// with a equivalent !tag string present, and then exports
// PNG files based on the bounds of all objects found on
// the original #tag layer.

// In order to hide a layer for all tags (for instance
// a notes or comment layer), use !png. 

try {
    var doc, i;
    if (app.documents.length > 0 ) {
        doc = app.activeDocument;
	} else{
		throw new Error('There is no document open.');
	}

    source_file = doc.fullName;
    doc.save();

    // Asset collection
    var asset_folder = new Folder(doc.path + "/_assets");
    if (asset_folder.exists || asset_folder.create()) {
        this.collectAssets(doc.placedItems, asset_folder);
        this.collectAssets(doc.rasterItems, asset_folder);
    } else {
        throw new Error('Unable to create or access the "_asset" folder.');
    }
	
	


    // PNG Export
    var layer;
    var image_options = new ImageCaptureOptions();
    image_options.antiAliasing = true;
    image_options.matte = false;
    image_options.transparency = true;
    image_options.resolution = 72;
    
    var tags = this.findTags(doc);
    for (var i=0; i<tags.length; i++) {
        // find the tagged layer
        layer = this.returnLayer(doc, tags[i]);
        // hide all layers tagged with !tag
        this.showAllLayers(doc);
        this.toggleLayers(doc, "!png", false); // backwards compatibility
        this.toggleLayers(doc, "!"+tags[i].slice(1), false);
        if (layer) {
            this.exportImageFiles(doc, layer.pageItems, image_options, "-"+tags[i]);
        }
    }


    // PDF Export
    var pdf_options, source_file, pdf_target_file;
    pdf_options = this.getPDFOptions();
    pdf_target_file = this.getTargetFile(doc.fullName.parent + "/" + this.changeExtension(doc.name, ".pdf"));
    // make sure all layers are visible
    this.showAllLayers(doc);
    doc.saveAs( pdf_target_file, pdf_options );
    doc.close();
    
    app.open(source_file);
    
} catch(e) {
    alert( e.message, "Script Alert", true);
}







function showAllLayers(doc) {
    for (var i=0; i<doc.layers.length; i++) {
        doc.layers[i].visible = true;
    }
}


function toggleLayers(doc, needle, do_show) {
    // turn off layers whose name matches needle
    for (var i=0; i<doc.layers.length; i++) {
        if (doc.layers[i].name.indexOf(needle)>=0) {
            doc.layers[i].visible = do_show;
        }
    }
}

function findTags(doc) {
    var tags = [];
    for (var i=0; i<doc.layers.length; i++) {
        var matches = doc.layers[i].name.match(/\#\w+/g);
        if (matches!==null) { tags = tags.concat(matches); }
    }
    return tags;
}

function returnLayer(doc, needle) {
    for (var i=0; i<doc.layers.length; i++) {
        if (doc.layers[i].name.indexOf(needle)>=0) {
            return(doc.layers[i]);
        }
    }
    return false;
}


function collectAssets(elements, asset_folder) {
    var i;
    var linked_file, collected_file;
    for (i=0;i<elements.length;i++) {
        // ignore if embedded
        if (elements[i].embedded) continue;
        // ignore if already in the asset folder
        if (elements[i].file.fullName.indexOf(asset_folder)==0) continue;
        
        linked_file = elements[i].file;
        collected_file = File(asset_folder+"/"+linked_file.name);
        linked_file.copy(collected_file);
        elements[i].file = collected_file;
    }
}
    
 
 function getPDFOptions() {
	var options = new PDFSaveOptions();
    options.pDFPreset = "[Smallest File Size]";
	
    options.compatibility = PDFCompatibility.ACROBAT7;
    // general
    options.preserveEditability = false;
    options.generateThumbnails = false;
    options.optimization = true;
    options.viewAfterSaving = false;
    options.acrobatLayers = false;
    // compression
    options.compressArt = true;
    options.colorCompression = CompressionQuality.AUTOMATICJPEGMEDIUM;
    
	return options;
}
    

function getTargetFile(path) {
	var my_file = new File(path);
    
	// Preflight access rights
	if (my_file.open("w")) {
		my_file.close();
	} else {
		throw new Error('File access is denied');
	}
	return my_file;
}

function getTargetFolder() {}

function changeExtension(filename, new_ext) {
    var new_name = "";
	if (filename.indexOf('.') < 0) {
		new_name = filename + new_ext;
	} else {
		var dot = filename.lastIndexOf('.');
		new_name += filename.substring(0, dot);
		new_name += new_ext;
	}
    return new_name;
}

function exportImageFiles(doc, elements, options, folder_suffix) {
    var folder = new Folder(doc.path + "/" + changeExtension(doc.name, folder_suffix));
    if (folder.exists || folder.create()) {
        for (var j=0; j<elements.length; j++) {
            var element_point = [elements[j].position[0], -elements[j].position[1]];
            element_point = doc.convertCoordinate(element_point, CoordinateSystem.ARTBOARDCOORDINATESYSTEM, CoordinateSystem.DOCUMENTCOORDINATESYSTEM);
            var coordinates = "@" + Math.floor(element_point[1]) + "y" + Math.floor(element_point[0]) + "x";
            var target_file = folder + "/" + changeExtension(doc.name, "-"+coordinates+".png");
            doc.imageCapture(new File(target_file), elements[j].geometricBounds, options)
        }
    } else {
        throw new Error("Unable to create png folder.");
    }
}