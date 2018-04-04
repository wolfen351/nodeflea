/* WUG Utils module for flea */
var pluginLogger;
var pluginDAO;
var pluginConfig;

var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var extract = require('extract-zip')

var download = function(url, dest, cb) {
	/* This function will download url to dest and then call callback cb */
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

var getKMZFunction = function(url) {
	download(url, "data/kmzdata.kmz", function() {
	    pluginLogger.info("KML Download completed");
		var currentPath = process.cwd();
	    extract(currentPath + "/data/kmzdata.kmz", {dir: currentPath + "/data"}, function (err) {
            if (err) pluginLogger.error("KML Unzip failed:" + err);
			else pluginLogger.info("KML Unzip completed");
		    fs.readFile('./data/doc.kml', 'utf8', function(oErr, sText) {
						
				var placemarkre = /<Placemark>[\S\s]*?<\/Placemark>/gm;
				var namere = /<name>[\S\s]*?<\/name>/gm;
				var coordre = /<coordinates>[\S\s]*?<\/coordinates>/gm;

				var placemark;
				var name;
				var coord;

				do {
					placemark = placemarkre.exec(sText);
					if (placemark) {
						name = namere.exec(placemark);
						coord = coordre.exec(placemark);
						if (coord && name)
						{
							var cleanName = name[0].replace("<name>","").replace("</name>","").trim();
							var cleanCoOrd = coord[0].replace("<coordinates>","").replace("</coordinates>","").trim();
							if (cleanCoOrd.split('\n').length == 1 && cleanCoOrd.split(',').length < 4)
							{
								console.log(cleanName, cleanCoOrd);
							}
						}
					}
				} while (placemark);
						
			});
					  
		});
	});
}		

var initFunction =  function (logger) {
        pluginLogger = logger.getLogger("WUG Utils");

		mkdirp('data', function(err) {   
		      if (err) pluginLogger.error("Unable to create ./data directory");  
		});
}

exports.init = initFunction;
exports.getKMZ = getKMZFunction;


