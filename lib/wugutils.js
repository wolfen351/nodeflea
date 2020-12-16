/* WUG Utils module for flea */
let pluginLogger;
let pluginDAO;
let pluginConfig;

const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const extract = require('extract-zip');

/* regex*/
const placemarkre = /<Placemark>[\S\s]*?<\/Placemark>/gm;
const namere = /<name>.*<\/name>/;
const coordre = /<coordinates>[\S\s]*?<\/coordinates>/;
const idre = /Location.id:.\d*/;
const ownerre = /Location.owner:.*?\;last/;


const nodes = [];

/**
 *
 * @param {*} url
 * @param {*} dest
 * @param {*} cb
 */
const download = function(url, dest, cb) {
    /* This function will download url to dest and then call callback cb */
    const file = fs.createWriteStream(dest);
    const request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) {
            cb(err.message);
        }
    });
};

/**
 *
 * @param {*} url
 */
const getKMZFunction = function(url) {
    download(url, 'data/kmzdata.kmz', function() {
        pluginLogger.info('KML Download completed');
        const currentPath = process.cwd();
        extract(currentPath + '/data/kmzdata.kmz', { dir: currentPath + '/data' }, function(err) {
            if (err) {
                pluginLogger.error('KML Unzip failed:' + err);
            } else {
                pluginLogger.info('KML Unzip completed');
            }
            fs.readFile('./data/doc.kml', 'utf8', function(oErr, sText) {
                let placemark;
                do {
                    placemark = placemarkre.exec(sText);
                    if (placemark) {
                        const name = namere.exec(placemark[0]);
                        const coord = coordre.exec(placemark[0]);
                        const id = idre.exec(placemark[0]);
                        const owner = ownerre.exec(placemark[0]);

                        if (coord && name && id) {
                            const cleanName = name[0].replace('<name>', '').replace('</name>', '').trim();
                            const cleanCoOrd = coord[0].replace('<coordinates>', '').replace('</coordinates>', '').trim();
                            const cleanId = id[0].replace('Location id: ', '').trim();
                            const cleanOwner = owner[0].replace('Location owner: ', '').replace('&lt;b&gt;', '').replace('&lt;br&gt;last', '').trim();
                            const lat = cleanCoOrd.split(',')[1].trim();
                            const lon = cleanCoOrd.split(',')[0].trim();

                            if (cleanCoOrd.split('\n').length == 1 && cleanCoOrd.split(',').length < 4) {
                                const newNode = {
                                    name: cleanName,
                                    coord: cleanCoOrd,
                                    id: cleanId,
                                    owner: cleanOwner,
                                    lat: lat,
                                    lon: lon
                                };
                                nodes.push(newNode);
                                // console.log(JSON.stringify(newNode));
                            } else {
                                console.log(coord, name, id);
                            }
                        }
                    }
                } while (placemark);
            });
        });
    });
};

/**
 *
 * @param {*} search
 * @return {*}
 */
const getNodeByName = function(search) {
    // first try exact match
    let picked = nodes.find((o) => o.name.toUpperCase() === search.toUpperCase());
    if (picked) {
        return picked;
    }

    // next try startswith match
    picked = nodes.find((o) => o.name.toUpperCase().lastIndexOf(search.toUpperCase()) === 0);
    if (picked) {
        return picked;
    }

    // next try contains match
    picked = nodes.find((o) => o.name.toUpperCase().lastIndexOf(search.toUpperCase()) > 0);
    if (picked) {
        return picked;
    }
};

/**
 *
 * @param {*} logger
 */
const initFunction = function(logger) {
    pluginLogger = logger.getLogger('WUG Utils');

    mkdirp('data', function(err) {
        if (err) {
            pluginLogger.error('Unable to create ./data directory');
        }
    });
};

exports.init = initFunction;
exports.getKMZ = getKMZFunction;
exports.getNodeByName = getNodeByName;