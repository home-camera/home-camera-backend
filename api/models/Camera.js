/**
 * Camera.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const uuidv4 = require('uuid/v4');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    uuid: {
      type: 'string'
    },
    name: {
      type: 'string',
      required: true
    },    
    width: {
      type: 'number',
      defaultsTo: 640
    },
    height: {
      type: 'number',
      defaultsTo: 480
    },
    fps: {
      type: 'number',
      defaultsTo: 30
    },
    imageCodec: {
      type: 'string',
      defaultsTo: 'jpeg',
      isIn: ['jpeg']
    },
    videoCodec: {
      type: 'string',
      defaultsTo: 'divx',
      isIn: ['divx']
    },
    input: {
      type: 'string',
      allowNull: false,
      required: true,
      unique: true
    },

    

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  customToJSON: function() {
    return _.omit(this, [ 'id',
                          'createdAt',
                          'updatedAt',
                          'input' ]);
  },
  beforeCreate: function (camera, next) {
    if (!isNaN(camera.input)) {
      camera.input = `v4l2src device=/dev/video${camera.input} \
      ! video/x-raw, framerate=${camera.fps}/1, \
      width=(int)${camera.width}, height=(int)${camera.height} \
      ! videoconvert ! appsink`;
    }
    camera.uuid = uuidv4();
    return next();
  },
  beforeUpdate: function (camera, next) {
    if (!isNaN(camera.input)) {
      camera.input = `v4l2src device=/dev/video${camera.input} \
      ! video/x-raw, framerate=${camera.fps}/1, \
      width=(int)${camera.width}, height=(int)${camera.height} \
      ! videoconvert ! appsink`;
    }
    return next();
  },  
};

