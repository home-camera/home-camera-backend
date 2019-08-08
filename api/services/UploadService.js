const mega = require('megajs');
const fs = require('fs');

const storage = new mega.Storage({ email: process.env.MEGA_EMAIL,
                                   password: process.env.MEGA_PASSWORD,
                                   autoload: true }, (err) => {
                                     if (err)
                                      console.log(err);
                                   });


const mkdirRecursive = (options, folder, done) => {
  var paths = options.dirpath;
  var dir = storage;
  var parent = storage.root;
                                  
  if (folder) {
    dir = folder;
    if (folder.children)
      parent = folder;
  }
                                  
  if (!paths || !paths.length) {
    return done(null, dir);
  }
                                  
  paths = paths.split('/');
  var dirpath = paths.shift();

  var tmp = parent.children.find(elem => elem.name === dirpath);
                                  
  if (tmp) {
    return mkdirRecursive({ dirpath: paths.join('/') }, tmp, done);
  } else {
    dir.mkdir(dirpath, (err, file) => {
      if (err) {
        return done(err, null);
      }
      return mkdirRecursive({ dirpath: paths.join('/') }, file, done);
    });
  }
};

module.exports = {
  upload: (options, done) => {
    if (!options.storage) {
      return done(new Error('upload folder not specified'));
    }
    fs.createReadStream(options.filepath).pipe(options.storage.upload(options.filename));
    //options.storage.upload(options.filename, fs.readFileSync(options.filepath), (err, file) => {});
    
    return done(null);
  },

  mkdir: (options, done) => {
    if (options.recursive) {
      return mkdirRecursive(options, null, done);
    }
    else {
      storage.mkdir(options.dirpath, (err, file) => {
        if (err) {
          return done(err, null);
        }
        return done(null, file);
      });
    }
  }
};