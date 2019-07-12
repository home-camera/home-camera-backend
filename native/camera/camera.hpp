#ifndef _CAMERA_WRAPPER_H_
#define _CAMERA_WRAPPPER_H_

#include <napi.h>
#include "camera_native.hpp"
#include "../workers/camera_reader_async_worker.hpp"

namespace Native::Camera{
  
  class Camera : public Napi::ObjectWrap<Camera> {
    public:
      static Napi::Object Init(Napi::Env env, Napi::Object exports);
      static Napi::Object NewInstance(Napi::Env env, Napi::Value arg);
      Camera(const Napi::CallbackInfo& info);
      ~Camera();
    private:
      static Napi::FunctionReference constructor;
      void Open(const Napi::CallbackInfo& info);
      void Close(const Napi::CallbackInfo& info);
      Napi::Value GetFps(const Napi::CallbackInfo& info);
      Napi::Value GetWidth(const Napi::CallbackInfo& info);
      Napi::Value GetHeight(const Napi::CallbackInfo& info);
      Napi::Value GetImageCodec(const Napi::CallbackInfo& info);
      Napi::Value GetVideoCodec(const Napi::CallbackInfo& info);
      Napi::Value GetInputSource(const Napi::CallbackInfo& info);

      Napi::Value input;
      CameraNative cameraNative;
      CameraReaderAsyncWorker* readerWorker;
  };

}

#endif /* _CAMERA_WRAPPER_H_ */