///* WUG Utils module for flea */
//var pluginLogger;
//var pluginDAO;
//var pluginConfig;
//
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
//
///* regex*/
//var placemarkre = /<Placemark>[\S\s]*?<\/Placemark>/gm;
//var namere = /<name>.*<\/name>/;
//var coordre = /<coordinates>[\S\s]*?<\/coordinates>/;
//var idre = /Location.id:.\d*/;
//var ownerre = /Location.owner:.*?\;last/;
//
//
//var nodes = [];
//
//var download = function (url, dest, cb) {
//    /* This function will download url to dest and then call callback cb */
//    var file = fs.createWriteStream(dest);
//    var request = http.get(url, function (response) {
//        response.pipe(file);
//        file.on('finish', function () {
//            file.close(cb);  // close() is async, call cb after close completes.
//        });
//    }).on('error', function (err) { // Handle errors
//        fs.unlink(dest); // Delete the file async. (But we don't check the result)
//        if (cb)
//            cb(err.message);
//    });
//};
//
//var getKMZFunction = function (url) {
//    download(url, "data/kmzdata.kmz", function () {
//        pluginLogger.info("KML Download completed");
//        var currentPath = process.cwd();
//        extract(currentPath + "/data/kmzdata.kmz", {dir: currentPath + "/data"}, function (err) {
//            if (err)
//                pluginLogger.error("KML Unzip failed:" + err);
//            else
//                pluginLogger.info("KML Unzip completed");
//            fs.readFile('./data/doc.kml', 'utf8', function (oErr, sText) {
//
//                var placemark;
//
//                do {
//                    placemark = placemarkre.exec(sText);
//                    if (placemark) {
//                        var name = namere.exec(placemark[0]);
//                        var coord = coordre.exec(placemark[0]);
//                        var id = idre.exec(placemark[0]);
//                        var owner = ownerre.exec(placemark[0]);
//
//                        if (coord && name && id)
//                        {
//                            var cleanName = name[0].replace("<name>", "").replace("</name>", "").trim();
//                            var cleanCoOrd = coord[0].replace("<coordinates>", "").replace("</coordinates>", "").trim();
//                            var cleanId = id[0].replace("Location id: ", "").trim();
//                            var cleanOwner = owner[0].replace("Location owner: ", "").replace("&lt;b&gt;", "").replace("&lt;br&gt;last", "").trim();
//                            var lat = cleanCoOrd.split(",")[1].trim();
//                            var lon = cleanCoOrd.split(",")[0].trim();
//
//                            if (cleanCoOrd.split('\n').length == 1 && cleanCoOrd.split(',').length < 4)
//                            {
//                                var newNode = {name: cleanName, coord: cleanCoOrd, id: cleanId, owner: cleanOwner, lat: lat, lon: lon};
//                                nodes.push(newNode);
//                                //console.log(JSON.stringify(newNode));
//                            } else
//                                console.log(coord, name, id);
//                        }
//                    }
//                } while (placemark);
//
//            });
//
//        });
//    });
//};
//
//var getNodeByName = function (search) {
//    // first try exact match
//    var picked = nodes.find(o => o.name.toUpperCase() === search.toUpperCase());
//    if (picked)
//        return picked;
//
//    // next try startswith match
//    picked = nodes.find(o => o.name.toUpperCase().lastIndexOf(search.toUpperCase()) === 0);
//    if (picked)
//        return picked;
//
//    // next try contains match
//    picked = nodes.find(o => o.name.toUpperCase().lastIndexOf(search.toUpperCase()) > 0);
//    if (picked)
//        return picked;
//
//};
//
//var initFunction = function (logger) {
//    pluginLogger = logger.getLogger("WUG Utils");
//
//    mkdirp('data', function (err) {
//        if (err)
//            pluginLogger.error("Unable to create ./data directory");
//    });
//};
//
//exports.init = initFunction;
//exports.getKMZ = getKMZFunction;
//exports.getNodeByName = getNodeByName;
//
