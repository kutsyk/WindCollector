const DB = 'analytics';
// const DB = 'test';
const COLLECTION = 'weather';
const INTERVAL = 60000;
const APIID = 'a803455ed728bd8307680f3668e37cf5';

let http = require('http');
let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017/' + DB;

// 708380 - Horodenka

function insertDocument(db, document, callback) {
    db.collection(COLLECTION).insertOne(document, function(err, result) {
        callback();
    });
}

function getAndSaveWeather(db) {
    http.get('http://api.openweathermap.org/data/2.5/weather?APPID=' + APIID + '&id=708380',  (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                insertDocument(db, parsedData, function() {});
                if (DB === 'test')
                    console.log('inserted');
            } catch (e) {
                console.error(e.message);
            }
        });
    });
}

MongoClient.connect(url, function(err, db) {
    setInterval(() => getAndSaveWeather(db), INTERVAL);
});
