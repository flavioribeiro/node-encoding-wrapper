# Node Encoding Wrapper
> A NodeJS wrapper for the Encoding.com API http://www.encoding.com/api/

## Running tests

1. Clone it:

```sh
$ git clone git@github.com:flavioribeiro/node-encoding-wrapper.git
```

2. Then go to the project's folder:

```sh
$ cd node-encoding-wrapper
```

3. And finally run:
```shell
$ chmod a+x runtests.sh && ./runtests.sh
```

## Example
```js
var EncodingApi = require('src/lib');
var Utils = require('src/utils');

var api = new EncodingApi(encodingLogin, encodingPassword);
// getProfileFromFile() receives the destination of output as second parameter
var hlsProfile = Utils.getProfileFromFile('profiles/hls.json', 'ftp://usr:passwd@flv.io/hls_output/');

api.addMedia('http://flv.io/video.mp4', hlsProfile, function(res) {
  if (res.errors) {
    throw new Error(res.errors.error);
  } else {
    console.log("done");
  }
});
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-awesome-new-feature`
3. Commit your changes: `git commit -m 'Add some awesome feature'`
4. Push to the branch: `git push origin my-awesome-new-feature`
5. Submit a pull request

## License

This code is under [Apache License](https://github.com/flavioribeiro/video-thumbnail-generator/blob/master/LICENSE).
