function Flare(object) {
  var obj = {};
  obj = {
    "name": object.location,
    "children": [{
      "name": object.name,
      "children": [{
        "name": object.email
      }, {
        "name": object.company
      }, {
        "name": object.cohort
      }]
    }]
  };
  return obj;
}


  // var flare = {
  //   "name": "San Francisco, CA",
  //   "children": [{
  //     "name": "Doug Shamoo",
  //     "children": [{
  //       "name": "something@example.com"
  //     }, {
  //       "name": "Uber"
  //     }, {
  //       "name": "HRR8"
  //     }, {
  //       "name": "Greenfield",
  //       "children": [{
  //         "name": "Contextualize",
  //         "url": "https://contextualize.herokuapp.com/"
  //       }],
  //       "url": "#/home"
  //     }],
  //     "url": "#/home"
  //   }, {
  //     "name": "Victoria Tapia",
  //     "children": [{
  //       "name": "something@example.com"
  //     }, {
  //       "name": "Uber"
  //     }, {
  //       "name": "HRR8"
  //     }],
  //     "url": "#/home"
  //   }, {
  //     "name": "Rex Suter",
  //     "children": [{
  //       "name": "something@example.com"
  //     }, {
  //       "name": "Uber"
  //     }, {
  //       "name": "HRR8"
  //     }, {
  //       "name": "Google",
  //       "url": "https://www.google.com"
  //     }],
  //     "url": "#/home"
  //   }, {
  //     "name": "Verlon Smith",
  //     "children": [{
  //       "name": "vsmith3113@gmail.com"
  //     }, {
  //       "name": "Uber"
  //     }, {
  //       "name": "HRR8"
  //     }],
  //     "url": "#/home"
  //   }],
  //   "url": "#home"
  // };