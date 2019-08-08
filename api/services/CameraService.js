const cv = require('opencv4nodejs');
const moment = require('moment');

const CameraReader = require('../models/CameraReader.js');

var readers = {};

module.exports = {
  open: (opts, done) => {
    var reader = readers[opts.camera.input];
    if (!reader) {
      try {
        reader = readers[opts.camera.input] = new CameraReader(opts.camera);
      } catch (er) {
        return done(new Error('failed to open camera'), null);
      }
    }
    reader.running = true;
    
    const delay = 10;
    
    var frame = reader.capture.read();
    var gray, frameDelta, thresh;
    var thr = opts.motion.thr | 25;
    var contours = opts.motion.contours | 500;
    var prevFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
    prevFrame = prevFrame.gaussianBlur(new cv.Size(21, 21), 0);

    async.forever(
      (next) => {
        if (!reader.running) {
          return;
        }
        frame = reader.capture.read();
        // loop back to start on end of stream reached
        if (frame.empty) {
          reader.capture.reset();
          frame = reader.capture.read();
        }

        gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
        gray = gray.gaussianBlur(new cv.Size(21, 21), 0);

        //compute difference between first frame and current frame
        frameDelta = prevFrame.absdiff(gray);
        thresh = frameDelta.threshold(thr, 255, cv.THRESH_BINARY);
              
        thresh = thresh.dilate(new cv.Mat(), new cv.Point2(-1,-1), 2);
        var cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.RETR_TREE);

        reader.motion = false;
        for (contour in cnts) {
          if (contour.area < contours) {
            continue;
          }
          reader.motion = true;
          break;
        }

        if (reader.recording || reader.motion) {
          var motionFrame = frame.copy();
          motionFrame.drawRectangle(new cv.Point2(0, frame.rows - 40), new cv.Point2(240, frame.rows), new cv.Vec3(0, 0, 0), -1);
          motionFrame.putText(moment().format('D/M/YYYY H:m:s'), new cv.Point2(8, frame.rows - 10), cv.FONT_HERSHEY_SIMPLEX, 0.6, new cv.Vec3(255, 255, 255), 1);
          reader.motion = false;
          reader.emitter.emit('frame', motionFrame);
        }

        if (reader.streaming) {
          reader.emitter.emit('streaming', frame);
        }
        
        prevFrame = gray.copy();

        cv.waitKey(delay);
        if (reader.running) {
          next();
        }
      },
      (err) => {
        console.error(err);
      }
    );
    return done(null, reader.emitter);
  },
  close: (camera, done) => {
    var reader = readers[camera.input];
    if (!reader || !reader.running) {
      return done(new Error('camera not opened'));
    }
    
    reader.capture.release();
    reader.running = false;
    return done(null);
  },
  startRecording: (camera, done) => {
    var reader = readers[camera.input];
    if (!reader || !reader.running) {
      return done(new Error('camera not opened'));
    }
    reader.recording = true;
    return done(null);
  },
  stopRecording: (camera, done) => {
    var reader = readers[camera.input];
    if (!reader || !reader.running) {
      return done(new Error('camera not opened'));
    }
    reader.recording = false;
    return done(null);
  }
};