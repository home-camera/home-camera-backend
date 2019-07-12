#include <opencv2/opencv.hpp>

#include "camera_reader_async_worker.hpp"

namespace Native::Camera {

  CameraReaderAsyncWorker::CameraReaderAsyncWorker(CameraNative& camera, 
                                                  Napi::Function& callback) 
                                                  : Napi::AsyncWorker(callback),
                                                  running(false),
                                                  camera(camera) {
    this->frameProcessing = new FrameProcessingAsyncWorker(procBuffers, camera, callback);
  }

  CameraReaderAsyncWorker::~CameraReaderAsyncWorker() {
    //this->frameProcessing->StopProcessing();
    //delete this->frameProcessing;
  }

  void CameraReaderAsyncWorker::Queue() {
    this->running = true;
    Napi::AsyncWorker::Queue();
    this->frameProcessing->Queue();
  }

  void CameraReaderAsyncWorker::Execute() {  
    while(this->running && this->camera.IsOpen()) {  
      //Frame* frame = new Frame();
      //this->camera.ReadFrame(frame);
      cv::Mat frame;
      this->camera.GetVideoCapture() >> frame;

      if (frame.empty())
        continue;
      
      if (frame.size().height > 0 && frame.size().width > 0) {
        cv::imshow("Preview", frame);
        cv::waitKey(20);
      }
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
      assert(!frame.empty());
      this->procBuffers.add(frame.clone());
      //if (nullptr != this->cameraStreamer)
      //  this->cameraStreamer->SendImage(frame->GetImage());
      //delete frame;
    }
  }

  void CameraReaderAsyncWorker::Stop() {
    this->running = false;
    this->frameProcessing->StopProcessing();
  }

  void CameraReaderAsyncWorker::OnOK() {
    this->camera.Close();
  }

  void CameraReaderAsyncWorker::OnError(const Napi::Error& e) {

  }

}