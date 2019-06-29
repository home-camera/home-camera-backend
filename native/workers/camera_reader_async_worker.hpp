#ifndef _CAMERA_READER_ASYNC_WORKER_H_
#define _CAMERA_READER_ASYNC_WORKER_H_

#include <napi.h>
#include "../camera/camera.hpp"
#include "frame_processing_async_worker.hpp"

class CameraReaderAsyncWorker : public Napi::AsyncWorker {
  public:
    CameraReaderAsyncWorker(Camera* camera, Napi::Function& callback);
    ~CameraReaderAsyncWorker();
  protected:
    virtual void Execute();
    virtual void OnOK();
    virtual void OnError(const Napi::Error& e);
  private:
    Camera* camera;
    FrameProcessingAsyncWorker* frameProcessing;
};

#endif /* _CAMERA_READER_ASYNC_WORKER_H_ */