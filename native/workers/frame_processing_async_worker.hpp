#ifndef _FRAME_PROCESSING_ASYNC_WORKER_H_
#define _FRAME_PROCESSING_ASYNC_WORKER_H_

#include <napi.h>

#include "../camera/camera_native.hpp"
#include "../utils/buffer.hpp"

namespace Native::Camera {
  class FrameProcessingAsyncWorker : public Napi::AsyncWorker {
    public:
      FrameProcessingAsyncWorker(Buffer<cv::Mat>& buffer, CameraNative& camera, Napi::Function& callback);
      ~FrameProcessingAsyncWorker();
      void StopProcessing();
    protected:
      virtual void Execute();
      virtual void OnOK();
      virtual void OnError(const Napi::Error& e);
    private:
      CameraNative& camera;
      volatile bool running;
      Buffer<cv::Mat>& buffer_;
  };
}

#endif /* _FRAME_PROCESSING_ASYNC_WORKER_H_ */