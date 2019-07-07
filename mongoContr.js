module.exports = function () {
    //npms
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    //project files
    const website = require('./websiteContr')();

    var mongo = mongo || {};
    mongo = {
        settings: {
            url: 'mongodb://' + website.ipAddress + ':27017',
            dbName: 'ligaosu',
            client: {}, //temp connection, to make it global,
        },
        error: function(issuedThing){
            console.log('MongoDB problem: '+issuedThing)
            return 'MongoDB problem: '+issuedThing
        },
        queries: {
            /*
                All basic queries from mongoDB node documentation
                in a nutshell
            */
            findDocuments: function (db, table, callback) {
                const collection = db.collection(table);

                collection.find({}).toArray(function (err, result) {
                    if (err) mongo.error('Something is wrong with finding record')
                    callback(result)
                });
            },
            findDocumentsQuery: function (db, table, query, callback) {
                const collection = db.collection(table);

                collection.find(query).toArray(function (err, result) {
                    if (err) mongo.error('Something is wrong with finding records')
                    callback(result)
                });
            },
            addDocument: function (db, table, value, callback) {
                const collection = db.collection(table);

                collection.insertOne(value, function (err, result) {
                    if (err) mongo.error('Something is wrong with adding record')
                    callback(result)
                });
            },
            modifyDocument: function (db, table, newQuery, query) {
                const collection = db.collection(table);

                collection.updateOne(query, newQuery, function (err, result) {
                    if (err) mongo.error('Something is wrong with modifying record')
                });
            },
            removeDocument: function (db, table, query, callback) {
                const collection = db.collection(table);

                collection.deleteOne(query, function (err, result) {
                    if (err) mongo.error('Something is wrong with deleting record')
                    callback(result)
                });
            }
        },
        connect: function () {
            return new Promise(function (resolve, reject) {
                MongoClient.connect(mongo.settings.url, { useNewUrlParser: true }, function (err, client) {
                    assert.equal(null, err);
                    //console.log("Connected to the database named: " + mongo.settings.dbName);
                    resolve(mongo.settings.client = client);
                });
            })
        },
        disconnect: function (client) {
            client.close(client);
            mongo.settings.client = {}; //refresh object, to forget about this connection
        },
        allRecords: function (table, callback) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.findDocuments(db, table, function (result, err) {
                        if (err || result.length == 0) mongo.error('There is no records in that table or database does not exists!')
                        callback(result);
                    })
                    mongo.disconnect(mongo.settings.client);
                })

        },
        addRecord: function (table, record) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.addDocument(db, table, record, function (result, err) {
                    });

                    mongo.disconnect(mongo.settings.client);
                })
        },
        removeRecord: function (table, query) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    
                    mongo.queries.removeDocument(db, table, query, function (result, err) {
                        mongo.disconnect(mongo.settings.client);
                    });
                })
        },
        removeRecords: function (table, query) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.findDocumentsQuery(db, table, query, function (result, err) {
                        if (result.length == 0) mongo.error('There is no records with this kind of query')

                        let userAmount = result.length;
                        let x = 0;
                        for (x; x < userAmount; x++) {
                            mongo.queries.removeDocument(db, table, { '_id': result[x]._id }, function(result, err){
                            })
                        }

                        mongo.disconnect(mongo.settings.client);
                    });
                })
        },
        searchRecords: function (table, query, callback) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.findDocumentsQuery(db, table, query, function (result, err) {
                        if (err || result.length == 0) mongo.error('There is no records with this kind of query')
                        callback(result)
                    });

                    mongo.disconnect(mongo.settings.client);
                })
        },
        updateRecord: function (table, query, newQuery) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.modifyDocument(db, table, { $set: newQuery }, query);
                    mongo.disconnect(mongo.settings.client);
                })

        },
        updateRecords: function (table, query, newQuery) {
            mongo.connect()
                .then(function () {
                    const db = mongo.settings.client.db(mongo.settings.dbName);

                    mongo.queries.findDocumentsQuery(db, table, query, function (result, err) {
                        if (err || result.length == 0) mongo.error('There is no records with this kind of query')

                        let userAmount = result.length;
                        let x = 0;

                        for (x; x < userAmount; x++) {
                            mongo.queries.modifyDocument(db, table, newQuery, { '_id': result[x]._id })
                        }

                        mongo.disconnect(mongo.settings.client);
                    });
                })
        }
    }

    return mongo || 'Problem z kontrolerem MONGO';

}