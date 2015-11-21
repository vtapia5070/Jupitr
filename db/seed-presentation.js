var user = require('./userController.js');
var db = require('./config.js');
var students = require('../server/utils/utilsConfig.js').students;

for (var i = 0; i < students.length; i++) {
  //user.addUser(generateRandomUser(), function() {
  user.addUser({
    name: students[i].name,
    email: students[i].email,
    githublogin: '',
    cohort: '',
    zip: '',
    twitter: '',
    website: '',
    gender: '',
    hasGivenPermission: '',
    thesis: '',
    thesisurl: '',
    greenfield: '',
    greenfieldurl: '',
    legacy: '',
    legacyurl: ''
  }, function() {
    console.log('seed record created');
  });
}

// async call to exit profile generator once all records are created
// comment out this setTimout call when seeding a deployed database
// see userController.js to seed deployed db
setTimeout(function() {
  process.exit();
}, 1000);
