#ifndef _CAMERA_READER_ASYNC_WORKER_H_
#define _CAMERA_READER_ASYNC_WORKER_H_

#include <napi.h>

#include "../camera/camera_native.hpp"
#include "../utils/buffer.hpp"
#include "frame_processing_async_worker.hpp"

namespace Native::Camera {
  class CameraReaderAsyncWorker : public Napi::AsyncWorker {
    public:
      CameraReaderAsyncWorker(CameraNative& camera, Napi::Function& callback);
      ~CameraReaderAsyncWorker();
      virtual void Queue();
      void Stop();
    protected:
      virtual void Execute();
      virtual void OnOK();
      virtual void OnError(const Napi::Error& e);
    private:
      volatile bool running;
      CameraNative& camera;
      Buffer<cv::Mat> procBuffers;
      FrameProcessingAsyncWorker* frameProcessing;
  };
}

#endif /* _CAMERA_READER_ASYNC_WORKER_H_ */