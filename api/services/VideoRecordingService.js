const cv = require('opencv4nodejs');
const moment = require('moment');
var fs = require('fs');

var writer;

var getVideoName = (camera) => {
  var timestamps = moment().format('YYYY-M-D_H-m-s').split('_');
  return `videos/${timestamps[0]}/${camera.name}#${timestamps[1]}.avi`
};

module.exports = {
  record: (opts, done) => {
    // TODO: motion writer & recording writer
    if (!writer) {
      var filePaths = getVideoName(opts.camera).split('#');
      var dir = filePaths[0];
      fs.access(dir, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            fs.mkdirSync(dir, { recursive: true });
          } else {
            return done(new Error('impossible to open output videos directory'));
          }
        }
        writer = new cv.VideoWriter(`${filePaths[0]}/${filePaths[1]}`, cv.VideoWriter.fourcc(opts.camera.videoCodec.toUpperCase()), opts.camera.fps, new cv.Size(opts.camera.width, opts.camera.height), true);
        writer.write(opts.frame);
      });
    } else {
      writer.write(opts.frame);
    }
    
    return done(null);
  },
  stopRecord: async (opts, done) => {
    if (!writer) {
      return done(null);
    }
    writer.release();
    writer = null;
    return done(null);
  }
};