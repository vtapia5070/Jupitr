var mongoose = require('mongoose');

// sets db location to Heroku Mongolab uri or local host
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/jupitr';
mongoose.connect(dbUri);

var db = mongoose.connection;

// db connection and error logging
db.once('open', function() {
  console.log('Connection established with MongoDB at: ' + dbUri);
});
db.on('error', console.error.bind(console, 'Connection error: unable to establish connection with MongoDB at: ' + dbUri));
db.on('diconnected', mongoose.connect);

module.exports = db;

module.exports = {
  github: {
    appId: '0d89f243fcd157e1907c',
    appSecret: '651f673086cee00cedd98a4830c4c45bfd70014f'
  },
  linkedin: {
    appId: '78nkitgng9t2p3',
    appSecret: 'hGF4gZlBNghdXZS4'
  }
};