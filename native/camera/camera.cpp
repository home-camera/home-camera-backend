#include "camera.hpp"

using namespace Native::Camera;

Napi::FunctionReference Camera::constructor;

Napi::Object Camera::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "Camera", {
    InstanceMethod("open", &Camera::Open),
    InstanceMethod("getFps", &Camera::GetFps),
    InstanceMethod("getWidth", &Camera::GetWidth),
    InstanceMethod("getHeight", &Camera::GetHeight),
    InstanceMethod("getImageCodec", &Camera::GetImageCodec),
    InstanceMethod("getVideoCodec", &Camera::GetVideoCodec),
    InstanceMethod("getInputSource", &Camera::GetInputSource),
    InstanceMethod("close", &Camera::Close)
  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("Camera", func);
  return exports;
}

Camera::Camera(const Napi::CallbackInfo& args) : Napi::ObjectWrap<Camera>(args), 
                                                 cameraNative() {
  Napi::Env env = args.Env();
  Napi::HandleScope scope(env);
  
  this->input = Napi::Number::New(env, 0);

  if (!args[0].IsObject()) {
    Napi::TypeError::New(env, "First argument must be options object").ThrowAsJavaScriptException();
  }
  Napi::Object options = args[0].ToObject();
  if (options.Has("width")) {
    this->cameraNative.SetWidth(options.Get("width").As<Napi::Number>().Int32Value());
  }
  if (options.Has("height")) {
    this->cameraNative.SetHeight(options.Get("height").As<Napi::Number>().Int32Value());
  }
  if (options.Has("fps")) {
    this->cameraNative.SetFps(options.Get("fps").As<Napi::Number>().Int32Value());
  }
  if (options.Has("imageCodec")) {
    this->cameraNative.SetImageCodec(options.Get("imageCodec").As<Napi::String>());
  }
  if (options.Has("videoCodec")) {
    this->cameraNative.SetVideoCodec(options.Get("videoCodec").As<Napi::String>());
  }
  if (options.Has("input")) {
    this->input = options.Get("input");
  }
}

Camera::~Camera() {
  delete this->readerWorker;
}

Napi::Object Camera::NewInstance(Napi::Env env, Napi::Value arg) {
  Napi::EscapableHandleScope scope(env);
  Napi::Object obj = constructor.New({ arg });
  return scope.Escape(napi_value(obj)).ToObject();
}

Napi::Value Camera::GetFps(const Napi::CallbackInfo& info) {
  return Napi::Value::From(info.Env(), this->cameraNative.GetFps());
}

Napi::Value Camera::GetWidth(const Napi::CallbackInfo& info) {
  return Napi::Value::From(info.Env(), this->cameraNative.GetWidth());
}

Napi::Value Camera::GetHeight(const Napi::CallbackInfo& info) {
  return Napi::Value::From(info.Env(), this->cameraNative.GetHeight());
}

Napi::Value Camera::GetImageCodec(const Napi::CallbackInfo& info) {
  return Napi::Value::From(info.Env(), this->cameraNative.GetImageCodec());
}

Napi::Value Camera::GetVideoCodec(const Napi::CallbackInfo& info) {
  return Napi::Value::From(info.Env(), this->cameraNative.GetVideoCodec());
}

void Camera::Open(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (!info[0].IsObject()) {
    Napi::TypeError::New(env, "First argument must be open callback function").ThrowAsJavaScriptException();
  }
  if (this->input.IsNumber())
    this->cameraNative.Open(this->input.As<Napi::Number>().Int32Value());
  else if (this->input.IsString())
    this->cameraNative.Open(this->input.As<Napi::String>());
  
  Napi::Function cb = info[0].As<Napi::Function>();
  this->readerWorker = new CameraReaderAsyncWorker(cameraNative, cb);
  this->readerWorker->Queue();
}

void Camera::Close(const Napi::CallbackInfo& info) {
  this->readerWorker->Stop();
}

Napi::Value Camera::GetInputSource(const Napi::CallbackInfo& info) {
  return this->input;
}