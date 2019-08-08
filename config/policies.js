/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': [ 'isAuthenticated' ],
  'auth/AuthController': {
    'login': true
  },
  'auth/PasswordController': {
    'create': true,
    'edit': true
  },
  'camera/CameraController': {
    'index': true,
    'show': true,
    'create': true,
    'update': true,
    'delete': true,
    'open': true,
    'close': true,
    'startRecording': true,
    'stopRecording': true,
  }
};
