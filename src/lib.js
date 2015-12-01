var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var extend = require('extend');

function EncodingApi(userId, userKey) {
  this.userId = userId || process.env.ENCODING_API_USER_ID;
  this.userKey = userKey || process.env.ENCODING_API_USER_KEY;
}

EncodingApi.prototype.getUserInfo = function(cb) {
  var params = {
    "action" : "getuserinfo",
    "action_user_id": this.userId
  };
  this.request(params, cb);
}

EncodingApi.prototype.addMedia = function(source, format, cb) {
  var params = {
    "action" : "addmedia",
    "source" : source,
    "format" : format
  }
  this.request(params, cb);
}

EncodingApi.prototype.restartMedia = function(mediaId, cb) {
  var params = {
    "action": "restartmedia",
    "mediaid": mediaId
  }
  this.request(params, cb);
}

EncodingApi.prototype.cancelMedia = function(mediaId, cb) {
  var params = {
    "action": "restartmedia",
    "mediaid": mediaId
  }
  this.request(params, cb);
}

EncodingApi.prototype.getMediaList = function(cb) {
  this.request({'action': 'getmedialist'}, cb);
}

EncodingApi.prototype.getStatus = function(mediaId, cb) {
  var params = {
    "action": "getstatus",
    "mediaid": mediaId
  }
  this.request(params, cb);
}

EncodingApi.prototype.mergeParams = function(params) {
  var defaultParams = {"query" : {"userid" : this.userId, "userkey" : this.userKey}};
  extend(defaultParams.query, params);
  return 'json=' + JSON.stringify(defaultParams);
}

EncodingApi.prototype.request = function(params, cb) {
  if (cb === undefined) {
    throw new Error('callback missing');
  }
  var postData = this.mergeParams(params);
  request({
    uri: 'http://manage.encoding.com/',
    method: 'POST',
    body: postData,
    headers: {'content-type' : 'application/x-www-form-urlencoded'}
  }).then(function(ret) {
    var ret = JSON.parse(ret[0].body);
    cb(ret.response);
  }).catch(function(e) {
    console.log("err! ", e);
  });
}


module.exports = EncodingApi
