#include <opencv2/opencv.hpp>

#include "camera_reader_async_worker.hpp"

CameraReaderAsyncWorker::CameraReaderAsyncWorker(Camera* camera, 
                                                Napi::Function& callback) 
                                                : Napi::AsyncWorker(callback),
                                                camera(camera),
                                                cameraStreamer(nullptr) {
  this->frameProcessing = new FrameProcessingAsyncWorker(100, camera, callback);
  this->frameProcessing->Queue();
}

CameraReaderAsyncWorker::~CameraReaderAsyncWorker() {
  this->frameProcessing->StopProcessing();
  delete this->frameProcessing;
}

void CameraReaderAsyncWorker::AttachStreamer(CameraStreamerAsyncWorker* streamer) {
  if (nullptr == this->cameraStreamer) {
    this->cameraStreamer = streamer;
    this->cameraStreamer->Queue();
  }
}

void CameraReaderAsyncWorker::DetachStreamer() {
  this->cameraStreamer = nullptr;
}

void CameraReaderAsyncWorker::Execute() {  
  while(this->camera->IsOpen()) {  
    Frame* frame = new Frame();

    //Capture Frame From WebCam
    this->camera->ReadFrame(frame);

    //if(message->resize) {
      //cv::Size size = cv::Size(message->width,message->height);
      //cv::resize(tmp,rsz,size);
      //msg->frame = rsz;
      //Update Size
      //preview_width = message->width;
      //preview_height = message->height;
    //} else {
      //msg->frame = tmp;
      //Update Size
      //preview_width = tmp.size().width;
      //preview_height = tmp.size().height;
    //}
    
    // notify frame
    this->frameProcessing->SendFrame(frame->GetFrame());
    if (nullptr != this->cameraStreamer)
      this->cameraStreamer->SendImage(frame->GetImage());

    delete frame;
  }
}

void CameraReaderAsyncWorker::OnOK() {
  
}

void CameraReaderAsyncWorker::OnError(const Napi::Error& e) {

}