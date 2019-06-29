#ifndef _FRAME_PROCESSING_ASYNC_WORKER_H_
#define _FRAME_PROCESSING_ASYNC_WORKER_H_

#include <napi.h>
#include <boost/lockfree/spsc_queue.hpp>
#include "../camera/camera.hpp"

class FrameProcessingAsyncWorker : public Napi::AsyncWorker {
  public:
    FrameProcessingAsyncWorker(Camera* camera, Napi::Function& callback);
    ~FrameProcessingAsyncWorker();
    void StopProcessing();
    void SendFrame(cv::Mat frame);
  protected:
    virtual void Execute();
    virtual void OnOK();
    virtual void OnError(const Napi::Error& e);
  private:
    Camera* camera;
    volatile bool running;
    boost::lockfree::spsc_queue<cv::Mat>* framesQueue;
};

#endif /* _FRAME_PROCESSING_ASYNC_WORKER_H_ */