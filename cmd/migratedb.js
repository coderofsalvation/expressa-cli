var fs = require('fs')
var expressa = require('expressa')
var auth = require('expressa/auth')
var async = require('async')

module.exports = function(lib,argv) {
	if ( argv['_'].length == 1 )
		lib.error("no collection name provided",true,true)
	if ( argv['_'].length == 2 )
		lib.error("no new db type provided",true,true)

	var collection_id = argv['_'][1]
	var newdbtype = argv['_'][2]
	if (!fs.existsSync( process.cwd()+'/data' ) )
		lib.error("data-dir not found..are you in a expressa-app directory?",true)

	var expressa = require('expressa');
	expressa.addListener('ready', function() {
		expressa.db[collection_id].all()
			.then(function(data) {
				if (data.length == 0) {
					return console.error('error: ' + collection + ' has no documents')
				}
				expressa.db[collection_id] = expressa.dbTypes[newdbtype](expressa.settings, collection_id);
				expressa.db[collection_id].init()
					.then(function() {
						console.log('successfully initialized new collection')
						return async.eachLimit(data, 10, function(doc, callback) {
							return expressa.db[collection_id].create(doc)
								.then(function() {
									callback();
								}, function(err) {
									callback(err);
								});
						}, function(err) {
							if (err) {
								console.error('failed to copy some of the documents')
								console.error(err)
								process.exit()
							} else {
								console.log('all ' + data.length + ' documents copied successfully')
								process.exit()
							}
						})
					})
					.catch( (err) => {
						console.error('failed to initialize new collection')
						console.error(err)
						process.exit()
					})
			})
	});
	return this

}.bind({})
