#include "camera_streamer_async_worker.hpp"

typedef struct AsyncMessage {
  CameraStreamerAsyncWorker* streamer;
  std::vector<uchar> image;
} AsyncMessage;

void updateAsync(uv_async_t* req, int status) {
  //napi_handle_scope scope;
  AsyncMessage* msg = reinterpret_cast<AsyncMessage*>(req->data);
  //napi_open_handle_scope(msg->streamer->GetCallback()->Env(), &scope);
  Napi::HandleScope scope(msg->streamer->GetCallback()->Env());
  Napi::ArrayBuffer arr = Napi::ArrayBuffer::New(msg->streamer->GetCallback()->Env(), msg->image.size());
  int pos = 0;
  for(uchar c : msg->image) {
    arr.Set(pos++, Napi::Value::From(msg->streamer->GetCallback()->Env(), c));
  }
  msg->streamer->GetCallback()->Call({ msg->streamer->GetCallback()->Env().Global(), arr });
  //napi_close_handle_scope(msg->streamer->GetCallback()->Env(), scope);
  delete msg;
}

CameraStreamerAsyncWorker::CameraStreamerAsyncWorker(Napi::Function callback) {
  this->callback = Napi::Persistent(callback);
  this->async = uv_async_t();
  this->loop = uv_default_loop();
}

CameraStreamerAsyncWorker::~CameraStreamerAsyncWorker() {}

Napi::FunctionReference* CameraStreamerAsyncWorker::GetCallback() {
  return &(this->callback);
}

void CameraStreamerAsyncWorker::StartStreaming() {
  uv_async_init(this->loop, &(this->async), (uv_async_cb) updateAsync);
}

void CameraStreamerAsyncWorker::StopStreaming() {
  uv_loop_close(this->loop);
  uv_close((uv_handle_t*) &(this->async), NULL);
}

void CameraStreamerAsyncWorker::SendImage(std::vector<uchar> image) {
  AsyncMessage* msg = new AsyncMessage();
  msg->streamer = this;
  msg->image = image;
  this->async.data = msg;
  uv_async_send(&(this->async));
}
