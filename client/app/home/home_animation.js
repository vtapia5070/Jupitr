// map for Geo data visual homepage
var width = window.innerWidth;
var height = window.innerHeight - 100;
var scale0 = 1250;

var svg = d3.select("#map").append('svg')
  .attr('class', 'vis')
  .attr("width", width)
  .attr("height", height);

// storing map using US state data, TODO ask team if they want world data.
var states = d3.geo.albersUsa()
  .scale(1250)
  .translate([width/2, height/2]);
// d3.geo.albersUsa for US map
// d3.geo.equirectangular for world map
// https://github.com/mbostock/d3/wiki/Geo-Projections

var g = svg.append("g");

// using states variable to render map
var map = d3.geo.path()
  .projection(states);

// zoom event
var zoom = d3.behavior.zoom().scaleExtent([1, 40]).on("zoom", zoomed);
var zoomToggle = false;
svg
  .call(zoom)
  .call(zoom.event);

// stores generalized location count
// format: {'[x, y]': 24, '[x2, y2]': 2, ...}
var locStoreGen = {};
// stores generalized location coords
// format: [[x, y], [x2, y2], ...]
var userLocGen = [];
// stores precise user location coords by cohort
// format: {HRR8: [[x, y], [x2, y2], ...]}
var cohortCoords = {};

// get data obj from localStorage
var allUsers = JSON.parse(window.localStorage.getItem('hrr8.jupitr'));
// iterate through data obj and extract out coords info to save into 
// respective arrays and objects
allUsers.forEach(function(user){
  if (user.longitude) {
    var coordsGen = floorCoords([user.longitude, user.latitude]).slice();

    locStoreGen[coordsGen] = locStoreGen[coordsGen] || 0;
    if (locStoreGen[coordsGen] === 0) {
      userLocGen.push([coordsGen, user.city + ', ' + user.state]);
    }
    locStoreGen[coordsGen]++;
    
    var coords = [noise(user.longitude), noise(user.latitude)];
    cohortCoords[user.cohort] = cohortCoords[user.cohort] || [];
    cohortCoords[user.cohort].push(coords);
  }
});

d3.json('app/home/us.json', function(err, us){
  if(err){
    console.log(err);
  }

  // draw the us map
  g.append('g')
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", map)
    .attr('fill', 'rgba(0, 0, 0, 0.95)')
    .attr('stroke', 'rgba(255, 255, 255, 0.35)')
    .attr('stroke-width', 0.5);

  // draw the us state border
  g.append('g')
    .attr('id', 'state-borders')
    .append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { 
      return a !== b; 
    }))
    .attr('id', 'state-borders')
    .attr('d', map);

  // path connecting people from the same cohort
  for (var prop in cohortCoords) {
    var color= randomColor(0.8);
    var connectionData = cohortCoords[prop];
    var connection = d3.svg.line()
                           .x(function(d){
                              return states(d)[0];
                            })
                           .y(function(d){
                            return states(d)[1];
                            })
                           .interpolate('linear');
    // connections between people in the same cohort; right now for demo and 
    // speed, only use path from start to end so it's not a one to one connection
    // will fix later; low priority
    g.append('g')
      .attr('id', prop)
       .append('path')
       .attr('class', 'connection')
       .attr('d', connection(connectionData))
       .attr('stroke', color)
       .attr('stroke-width', 0.2)
       .attr('baseS', 0.2)
       .attr('fill', 'none')
       .on('mouseover', function(){
          d3.select(this).transition().duration(50).attr('stroke-width', 1.5);
       })
       .on('mouseleave', function(){
          d3.select(this).transition().duration(50).attr('stroke-width', 0.2);
       })

    // precise location info per cohort
    g.append('g')
      .attr('id', prop)
      .selectAll('circle')
      .data(connectionData).enter()
      .append('circle')
      .attr('class', 'user')
      .attr('transform', function(d) {
        return 'translate(' + states(d) + ')'; 
      })
      .attr('baseR', 7)
      .attr('r', 7)
      .attr('fill', 'rgba(255, 0, 0, 0.5)');
  }  

  // general data location
  var divs = g.append('g')
    .attr('id', 'userGen')
    .selectAll('circle')
    .data(userLocGen).enter()
    .append('g')
    .attr('num', function(d) {
      return locStoreGen[d[0]];
    })
    .on('mouseover', function() {
      var self = d3.select(this);
      var dad = d3.select(this.parentNode);
      // transform text
      self.select('text')
        .transition()
        .duration(200)
        .style('font-size', '35px');
      // change circle fill
      var circle = self.select('circle');
      if (circle.attr('toggled') === 'false') {
        circle.attr('prevColor', function(d) {
          circle.attr('toggled', 'true');
          return circle.attr('fill');
        });
      }
      circle.attr('fill', 'rgba(255, 255, 255, 0.5)');
      // manage popup
      var num = self.attr('num');
      var arc = d3.svg.arc() 
                  .innerRadius(40) 
                  .outerRadius(80) 
                  .startAngle(0) 
                  .endAngle((num/35 + 0.5) * Math.PI);
      var x = d3.mouse(this)[0] - 200;
      var y = d3.mouse(this)[1] - 200;

      if (!d3.select('#popup')[0][0]) {
        var popup = dad.append('g')
                        .attr('id', 'popup')
                        .attr('transform', 'translate(' + x + ',' + y + ')');

        popup.append('rect')   
              .attr('width', 200)
              .attr('height', 200)
              .attr('rx', 10)
              .attr('ry', 10)
              .attr('stroke-width', 1)
              .attr('stroke', 'rgba(150, 150, 150, 0.9)')
              .style('fill', 'rgba(255, 255, 255, 0.6)');
        popup.append('circle')
              .attr('transform', 'translate(' + 100 + ',' + 100 + ')')
              .attr('stroke-width', 0.1)
              .attr('stroke', 'rgba(0, 0, 0, 0.3)')
              .attr('fill', 'rgba(120, 120, 120, 0.4)')
              .attr('r', 75);
        popup.append('path')
              .attr('d', arc)
              .attr('transform', 'translate(' + 100 + ',' + 100 + ')')
              .attr('stroke', 'rgba(255, 255, 255, 0.3)')
              .attr('fill', 'rgba(120, 120, 120, 0.5)')
              .style('fill', 'rgba(0, 0, 0, 0.5)');
        popup.append('text')
              .attr('transform', 'translate(' + 77 + ',' + 110 + ')')
              .style('font-size', '35px')
              .text(function(){
                var text = self.attr('num');
                if (text.length < 2) {
                  text = 0 + text;
                }
                return text;
              });
      }
    })
    .on('mouseleave', function(){
      var self = d3.select(this);
      self.select('text')
        .transition()
        .duration(200)
        .style('font-size', '10px');
      var circle = self.select('circle');
      circle.attr('toggled', 'false')
        .attr('fill', function(d) {
          return circle.attr('prevColor');
        });
      d3.selectAll('#popup').remove();
    });

  // sort the circles so smaller ones appear before the bigger ones
  divs.sort(function(a, b){
    return locStoreGen[b[0]] - locStoreGen[a[0]];
  });

  divs.append('circle')
    .attr('class', 'userGen')
    .attr('transform', function(d) {
      return "translate(" + states(d[0]) + ")";  
    })
    .attr('zoomed', 'false')
    .attr('toggled', 'false')
    .attr('r', function(d) {
      return getCirGenRadius(d);
    })
    .attr('baseR', function(d) {
      return getCirGenRadius(d);
    })
    .attr('fill', function(d) {
      var num = floorCoords(d[0], function(data) {
        return locStoreGen[data];
      });
      var r = 120 + num;
      var g = 120 + num * 4;
      var b = 150 + num * 6;
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + 0.4 + ')';
    })
    .attr('stroke', 'white')
    .attr('stroke-width', 0.35);

  divs.append('text')
    .attr('x', function(d) {
      return states(d[0])[0];  
    })
    .attr('y', function(d) {
      return states(d[0])[1];  
    })
    .text(function(d) {
      return d[1];
    });

});

// helper func
function noise(num) {
  var sign = Math.random() > 0.5 ? 1 : -1;
  var amp = Math.random() * 0.2;
  return num + sign * amp;
}

function floorCoords(arr, cb) {
  cb = cb || function(coords) {
    return coords;
  };
  var x = Math.floor(arr[0] * 1.25) / 1.25 + 0.3;
  var y = Math.floor(arr[1] * 1.25) / 1.25 + 0.3;
  return cb([x, y]);
}

function randomColor(alpha) {
  alpha = alpha || 1;
  var r = Math.floor(Math.random() * 150) + 100;
  var g = Math.floor(Math.random() * 150) + 100;
  var b = 200;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function getCirGenRadius(d) {
  var num = floorCoords(d[0], function(data) {
    return locStoreGen[data];
  });
  num = num < 10 ? 10 : num;
  num = num > 50 ? 50 : num * 1.5;
  return num;
}

// zoom handler
var connectionMouseover, connectionMouseleave;
function zoomed() {
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  g.selectAll('.user')
   .each(function() {
    var baseR = d3.select(this).attr('baseR');
    d3.select(this).attr('r', Math.max(baseR/d3.event.scale, 1));
   });

  g.selectAll('.connection')
   .each(function() {
    var baseS = d3.select(this).attr('baseS');
    connectionMouseover = d3.select(this).on('mouseover');
    connectionMouseleave = d3.select(this).on('mouseleave');
    d3.select(this).attr('stroke-width', Math.max(baseS/d3.event.scale, 0.15))
      .attr('opacity', Math.max(0.8/d3.event.scale, 0.7));
   });

  var userGenCir = g.select('#userGen').selectAll('circle');
  userGenCir.on('click', function() {
    var self = d3.select(this);
    var t = d3.transform(self.attr("transform")),
      x = t.translate[0],
      y = t.translate[1];
    var scale = 30;
    svg.transition().duration(3000)
        .call(zoom.translate([((x * -scale) + (width / 2)), ((y * -scale) + height / 2)])
        .scale(scale).event);
  });
  if (d3.event.scale > 18) {
    g.select('#userGen').style('display', 'none');
  }
  else {
    g.select('#userGen').style('display', 'inline-block');
  }
}