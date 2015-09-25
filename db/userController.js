var User = require('./userModel.js');

// creates new user record
exports.addUser = function(data, callback) {
  var user = new User({
    email: data.email,
    cohort: data.cohort,
    zip: data.zip,
    github: data.github,
    twitter: data.twitter,
    website: data.website,
    gender: data.gender,
    race: data.gender,
    thesis: data.thesis,
    thesisurl: data.thesisurl,
    greenfield: data.greenfield,
    legacy: data.legacy,
    technologies: data.technologies,    
  });
  
  // adds current and past employment records to 
  user.currentemployer.push(data.currentemployer);
  
  // TODO -- coordinate how employment info will be passed
  // currentemployer: [employerSchema],
  // prioremployers: [employerSchema],
  
  console.log(user);
  
  user.save(function(err) {
    if (err) {
      console.error(err);
      return;
    }
      // possibly change to res.sendStatus(201)
    console.log('user record created');  
    callback();
  });
  
};

// TODO -- figure out functionality to update a user record

// returns all user data
exports.sendAllUsers = function(callback) {
  User.find({}, function(err, users) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('sending user information');
    callback(users);
  });
};
