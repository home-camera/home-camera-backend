#ifndef _CAMERA_STREAMER_ASYNC_WORKER_H_
#define _CAMERA_STREAMER_ASYNC_WORKER_H_

#include <napi.h>
#include <uv.h>

#include <vector>

class CameraStreamerAsyncWorker {
  public:
    CameraStreamerAsyncWorker(Napi::Function callback);
    ~CameraStreamerAsyncWorker();
    void StartStreaming();
    void StopStreaming();
    void SendImage(std::vector<uchar> image);
    Napi::FunctionReference* GetCallback();
  private:
    Napi::FunctionReference callback;
    uv_async_t async;
    uv_loop_t *loop;
};

#endif /* _CAMERA_STREAMER_ASYNC_WORKER_H_ */