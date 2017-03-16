var fs = require('fs');
var schemize = require('schemize').default;

module.exports = function(lib,argv){
  var jsonfile = argv['_'][2]
  var collectionname = argv['_'][1]
  if( !jsonfile )
    lib.error("ERROR: no json file provided",true,true)
  if( !collectionname )
    lib.error("ERROR: no json file provided",true,true)
  if (!fs.existsSync( process.cwd()+'/data' ) ) 
    lib.error("ERROR: data-dir not found..are you in a expressa-app directory?",true)
  if (!fs.existsSync(jsonfile) )
    lib.error("ERROR: jsonfile not found..please pass absolute path",true)

  var json = require(jsonfile)
  var collectionfile = process.cwd()+"/data/collection/"+collectionname+".json"

  fs.writeFileSync(collectionfile , JSON.stringify({
    "_id":collectionname,
    "schema":schemize(json),
    "storage": "file",
    "documentsHaveOwners": false,
    "meta": {
      "updated": new Date().toISOString(),
      "created": new Date().toISOString()
    }
  },null,2))
  console.log("created: "+collectionfile)


  return this

}.bind({})
