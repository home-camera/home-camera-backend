#include <napi.h>
#include <opencv2/opencv.hpp>

#include "camera/camera.hpp"
#include "workers/camera_reader_async_worker.hpp"

// TODO: add CameraWrapper (wrapper object for js)
// TODO: concurrent_map<std::string /* input */, Camera*> cameras;
// TODO: concurrent_map<Camera*, CameraReaderAsyncWorker*> readers;
CameraReaderAsyncWorker* worker;
Camera* camera;

// TODO: return CameraWrapper
void Open(const Napi::CallbackInfo& args) {
  Napi::Env env = args.Env();
  Napi::Value input = Napi::Number::New(env, 0);
  Napi::Function cb;

  camera = new Camera();

  if (args.Length() == 2) {
    if (!args[0].IsObject()) {
      Napi::TypeError::New(env, "First argument must be options object").ThrowAsJavaScriptException();
    }
    if (!args[1].IsFunction()) {
      Napi::TypeError::New(env, "Second argument must be frame callback function").ThrowAsJavaScriptException();
    }
    cb = args[1].As<Napi::Function>();
    Napi::Object options = args[0].ToObject();
    if (options.Has("width")) {
      camera->SetWidth(options.Get("width").As<Napi::Number>().Int32Value());
    }
    if (options.Has("height")) {
      camera->SetHeight(options.Get("height").As<Napi::Number>().Int32Value());
    }
    if (options.Has("fps")) {
      camera->SetFps(options.Get("fps").As<Napi::Number>().Int32Value());
    }
    if (options.Has("input")) {
      input = options.Get("input");
    }
  } else {
    if (!args[0].IsFunction()) {
      Napi::TypeError::New(env, "First argument must be frame callback function").ThrowAsJavaScriptException();
    }
    cb = args[0].As<Napi::Function>();
  }

  // open camera
  if (input.IsNumber()) {
    camera->Open(input.As<Napi::Number>().Int32Value());
    // TODO: cameras.put(std::string(input.As<Napi::Number>().Int32Value()), camera);
  } else if (input.IsString()) {
    camera->Open(input.As<Napi::String>());
    // TODO: cameras.put(input.As<Napi::String>(), camera);
  }
  worker = new CameraReaderAsyncWorker(camera, cb);
  //TODO: readers.put(camera, worker);
  worker->Queue();
}

// TODO: CameraWrapper.IsOpen()
Napi::Value IsOpen(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::Boolean::New(env, camera->IsOpen());
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "open"),
              Napi::Function::New(env, Open));
  exports.Set(Napi::String::New(env, "isOpen"),
              Napi::Function::New(env, IsOpen));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)