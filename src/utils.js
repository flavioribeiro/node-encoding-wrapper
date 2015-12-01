var format = require('string-template');
var fs = require('fs');

module.exports = {
  getProfileFromFile: function(file, destination) {
    var profileTmpl = fs.readFileSync(file).toString();
    return JSON.parse(format(profileTmpl, {'destination': destination}));
  }
}
