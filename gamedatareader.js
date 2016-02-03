var fs = require('fs');
var obj;


function readData(callback){

console.log('Reading game data file....');

fs.readFile('lifeline.json', function(err, data){
  
  if(err){
  	callback(err);
  }

  obj = JSON.parse( data );

  callback( null, obj );


});

}

module.exports = {
	readGameData : readData
}
