/**
 * CameraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const cv = require('opencv4nodejs');

module.exports = {
  // GET /api/cameras
  index: async function(req, res) {
    var cameras = await Camera.find({});
    if (!cameras) {
      return res.sendStatus(404);
    }
    return res.status(200).json(cameras);
  },

  // GET /api/cameras/:id
  show: async function(req, res) {
    var camera = await Camera.find({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    return res.status(200).json(camera);
  },

  // POST /api/cameras
  create: async function(req, res) {
    var camera = await Camera.create(req.body)
      .intercept((err) => {
        return res.status(400).json({ error: err.message });
      })
      .fetch();
    if (!camera) {
      return res.sendStatus(400);
    }
    res.status(200).json(camera);
  },

  // PATCH /api/cameras/:id
  update: async function(req, res) {
    var params = req.parameters.permit('width',
                                       'height',
                                       'fps',
                                       'imageCodec',
                                       'videoCodec',
                                       'input').value();
    var camera = await Camera.findOne({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    if (params.width) {
      camera.width = params.width;
    }
    if (params.height) {
      camera.height = params.height;
    }
    if (params.fps) {
      camera.fps = params.fps;
    }
    if (params.imageCodec) {
      camera.imageCodec = params.imageCodec;
    }
    if (params.videoCodec) {
      camera.videoCodec = params.videoCodec;
    }
    if (params.input) {
      camera.input = params.input;
    }
    Camera.update({ id: req.param('id') }, camera)
      .then((updated) => {
        return res.status(200).json(camera);
      })
      .catch((err) => {
        return res.status(400).json({ error: err.message });
      });
  },

  // DELETE /api/cameras/:id
  delete: async function(req, res) {
    Camera.destroy({ uuid: req.param('id') }).
      fetch().
      exec(function (err, camera) {
        if (err) return res.status(400).json({ error: err.message });
        return res.status(200).json(camera);
      })
  },

  // GET /api/cameras/:id/open
  open: async function(req, res) {
    var camera = await Camera.findOne({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    CameraService.open({ camera: camera, motion: { thr: 15, contours: 500 } }, (err, emitter) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      emitter.on('frame', (frame) => {
        VideoRecordingService.record({ camera: camera, frame: frame.copy() }, (err) => {});
      });
      emitter.on('streaming', (frame) => {
        cv.imshow('streaming frame', frame);
      });
      return res.sendStatus(200);
    });
  },

  // GET /api/cameras/:id/close
  close: async function(req, res) {
    var camera = await Camera.findOne({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    CameraService.close(camera, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      cv.destroyAllWindows();
      VideoRecordingService.stopRecord({ camera: camera }, (err) => {});
      return res.sendStatus(200);
    });
  },

  // GET /api/cameras/:id/recording
  startRecording: async function(req, res) {
    var camera = await Camera.findOne({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    CameraService.startRecording(camera, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.sendStatus(200);
    });
  },

  // DELETE /api/cameras/:id/recording
  stopRecording: async function(req, res) {
    var camera = await Camera.findOne({ uuid: req.param('id') });
    if (!camera) {
      return res.sendStatus(404);
    }
    CameraService.stopRecording(camera, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      VideoRecordingService.stopRecord({ camera: camera }, (err) => {});
      return res.sendStatus(200);
    });
  }
};

