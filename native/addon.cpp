#include <napi.h>
#include "camera/camera.hpp"

Napi::Object CreateCamera(const Napi::CallbackInfo& info) {
  return Native::Camera::Camera::NewInstance(info.Env(), info[0]);
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "init"),
              Napi::Function::New(env, CreateCamera));
  return Native::Camera::Camera::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)