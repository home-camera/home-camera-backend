/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // user authentication
  'POST /api/auth/login':   'auth/AuthController.login',
  'POST /api/auth/logout':  'auth/AuthController.logout',
  'GET /api/auth/me':       'auth/AuthController.me',

  // password reset
  'GET /api/password/new': 'auth/PasswordController.create',
  'POST /api/password': 'auth/PasswordController.edit',

  // password change
  'PUT /api/password': 'auth/PasswordController.update',

  // camera
  'GET /api/cameras': 'camera/CameraController.index',
  'GET /api/cameras/:id': 'camera/CameraController.show',
  'POST /api/cameras': 'camera/CameraController.create',
  'PATCH /api/cameras/:id': 'camera/CameraController.update',
  'DELETE /api/cameras/:id': 'camera/CameraController.delete',

  'GET /api/cameras/:id/open': 'camera/CameraController.open',
  'GET /api/cameras/:id/close': 'camera/CameraController.close',

  'GET /api/cameras/:id/recording': 'camera/CameraController.startRecording',
  'DELETE /api/cameras/:id/recording': 'camera/CameraController.stopRecording',
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
