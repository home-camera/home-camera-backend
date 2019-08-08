const cv = require('opencv4nodejs');
const emitter = require('events').EventEmitter;

module.exports = class CameraReader {
  constructor(camera) {
    this.camera = camera;
    this.running = false;
    this.motion = false;
    this.recording = false;
    this.streaming = false;
    this.capture = new cv.VideoCapture(0);
    this.emitter = new emitter();
  }
};

