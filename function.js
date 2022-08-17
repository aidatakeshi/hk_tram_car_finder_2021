var convert = require('xml-js');

/**
 * Load Tram Stops
 */
async function getTramStops(axios){
    try {
        var response = await axios.get('/js/nextTramData.js');
    }catch (error){
        return [];
    }
    //Handle Stop List
    var data = {};
    var nextTramStopsW = [];
    var nextTramStopsE = [];
    try{
        eval(response.data);
    }catch(error){
        return [];
    }
    for (var item of nextTramStopsW){
        if (!data[item[0]]) data[item[0]] = {
            en: item[1], tc: item[2], sc: item[3],
        };
    }
    for (var item of nextTramStopsE){
        if (!data[item[0]]) data[item[0]] = {
            en: item[1], tc: item[2], sc: item[3],
        };
    }
    return data;
}
exports.getTramStops = getTramStops;

/**
 * Load Tram Data
 */
async function getTramETAOfStop(axios, stop){
    try {
        var response = await axios.get(`nextTram/geteat.php?stop_code=${stop}`);
        var xml = convert.xml2json(response.data, {compact: false, spaces: 2});
        xml = JSON.parse(xml);
        var arr = xml?.elements?.[0]?.elements || [];
        for (var i in arr){
            arr[i] = arr[i].attributes;
        }
        return arr;
    }catch (error){
        return [];
    }
}
exports.getTramETAOfStop = getTramETAOfStop;

/**
 * Display Time
 */
exports.dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/zh-hk');
exports.dayjs.extend(localizedFormat);
exports.dayjs.extend(utc);
exports.dayjs.extend(timezone);
var TZ = "Asia/Hong_Kong";

//Get Display Time
exports.getDisplayTime = function(timestamp, showSeconds){
    if (!timestamp) return '-';
    return exports.dayjs(timestamp).tz(TZ).format(showSeconds ? 'H:mm:ss' : 'H:mm');
}

exports.getDisplaySeconds = function(timestamp){
    if (!timestamp) return '-';
    return exports.dayjs(timestamp).tz(TZ).format('ss');
}

/**
 * String Replace
 */
exports.stringReplace = function(str){
    str = str.replace('(西)', '');
    str = str.replace('(東)', '');
    str = str.replace(' Terminus B', '');
    str = str.replace(' Terminus K', '');
    str = str.replace('總站', '');
    str = str.replace(' Terminus', '');
    return str;
}