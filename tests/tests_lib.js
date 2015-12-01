var EncodingApi = require('../src/lib.js')
var utils = require('../src/utils.js');

var expect = require('chai').expect;
var should = require('chai').should();
var nock = require('nock');

describe("Encoding API", function(){
  it("should create an object of type EncodingApi", function() {
    var instance = new EncodingApi('fakeUser', 'fakeKey');
    expect(instance).to.be.an.instanceof(EncodingApi);
    instance.userId.should.equal('fakeUser');
  });

  it("should get info from environment variables", function() {
    process.env.ENCODING_API_USER_ID = "fakeUserFromEnv";
    process.env.ENCODING_API_USER_KEY = "fakeKeyFromEnv";
    var instance = new EncodingApi();
    instance.userId.should.equal('fakeUserFromEnv');
    instance.userKey.should.equal('fakeKeyFromEnv');
  })

  it('should merge parameters', function() {
    var instance = new EncodingApi('f4k3', 'f4k3');
    var desired = 'json={"query":{"userid":"f4k3","userkey":"f4k3","testK":"testV"}}'
    var result = instance.mergeParams({'testK': 'testV'});
    desired.should.equal(result);
  })

  it('should get user info', function(done) {
    var response = {'response': { 'action': 'getuserinfo', 'status': 'Success', 'result': {}}}
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var instance = new EncodingApi();
    instance.getUserInfo(function (res) {
      res.status.should.equal('Success');
      done();
    });
  })

  it('should throw an exception when no callback is passed', function() {
    var instance = new EncodingApi('f4k3', 'f4k3');
    expect(instance.request).to.throw(Error, /callback missing/);
  })

  it('should add media', function(done) {
    var response = {'response': { 'message': 'Added', 'MediaID': '37159388'}};
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var profile = utils.getProfileFromFile('profiles/mp4_240p.json', 'http://good.place');

    var instance = new EncodingApi('user', 'key');
    var source = "http://nytimes-enc.s3.amazonaws.com/src.mp4";

    instance.addMedia(source, profile, function (res) {
      res.message.should.equal('Added');
      done();
    });
  });

  it('should cancel media', function(done) {
    var response = {'response': { 'message': 'Deleted'}};
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var instance = new EncodingApi('user', 'key');
    var mediaId = "37159388"; // this mediaId comes from addMedia() response
    instance.cancelMedia(mediaId, function (res) {
      res.message.should.equal('Deleted');
      done();
    });
  });


  it('should get status of a given media', function(done) {
    var response = {'response': {'progress': '100.0'}};
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var instance = new EncodingApi('user', 'key');
    var mediaId = "37159388"; // this mediaId comes from addMedia() response
    instance.getStatus(mediaId, function (res) {
      res.progress.should.equal('100.0');
      done();
    });
  })

  it('should restart media', function(done) {
    var response = {"response": {"message": "Restarted"}};
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var instance = new EncodingApi('user', 'key');
    var mediaId = "37159388"; // this mediaId comes from addMedia() response
    instance.restartMedia(mediaId, function (res) {
      res.message.should.equal('Restarted');
      done();
    });
  })

  it('should get media list', function(done) {
    var response = {
      "response": {
        "media": [
          {
            "mediafile": "http://nytimes-encoding.s3.amazonaws.com/32902_1_movies-03272015_wg_240p.mp4",
            "mediaid": "37159388",
            "mediastatus": "Success",
            "startdate": "2015-04-06 10:28:08"
          },
          {
            "mediafile": "http://nytimes-encoding.s3.amazonaws.com/32902_1_movies-03272015_wg_240p.mp4",
            "mediaid": "37159397",
            "mediastatus": "Error",
            "startdate": "2015-04-06 10:26:26"
          }
        ]
      }
    }
    var scope = nock('http://manage.encoding.com').post('/').reply(200, response);

    var instance = new EncodingApi('user', 'key');
    instance.getMediaList(function (res) {
      expect(res.media.length).to.equal(2);
      done();
    });
  })
});
