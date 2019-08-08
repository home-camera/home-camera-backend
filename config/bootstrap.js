/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

const cv = require('opencv4nodejs');
const chokidar = require('chokidar');

module.exports.bootstrap = async function(done) {

  sails.params = require('strong-params');

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  const watcher = chokidar.watch('videos', { ignoreInitial: true, awaitWriteFinish: true });
  watcher.on('add', async path => {
    const paths = path.split('/').slice(0, -1).join('/');
    var dir = null;
    UploadService.mkdir({ dirpath: paths, recursive: true }, (err, folder) => {
      if (err) {
        console.log(err);
      }
      UploadService.upload({ filepath: path, filename: path.split('/').pop(), storage: folder }, (err) => {
        if (err)
          console.log(err);
      });
    });
  });

  setTimeout(async () => {
    //async.forever(
      //async (next) => {
        var cameras = await Camera.find({ });
        if (!cameras[0]) {
          return;
        }
        CameraService.open({ camera: cameras[0], motion: { thr: 15, contours: 500 } }, (err, emitter) => {
          if (err) {
            return;
          }
          emitter.on('frame', (frame) => {
            VideoRecordingService.record({ camera: cameras[0], frame: frame.copy() }, (err) => {});
          });
        });
          /*setTimeout(async () => {
            CameraService.close(cameras[0], (err) => {
              VideoRecordingService.stopRecord({}, (err) => {
                next();
              });
            });
          }, 2000);
        });
      }, (err) => {}); */
  }, 2000);
  
  

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
