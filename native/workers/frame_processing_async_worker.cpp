#include <opencv2/opencv.hpp>
#include <opencv2/video/tracking.hpp>
#include <opencv2/core/ocl.hpp>

#include <vector>

#include "frame_processing_async_worker.hpp"

FrameProcessingAsyncWorker::FrameProcessingAsyncWorker(Camera* camera,
                                                  Napi::Function& callback) 
                                                : Napi::AsyncWorker(callback),
                                                camera(camera),
                                                running(true) {
  this->framesQueue = new boost::lockfree::spsc_queue<cv::Mat>(100);
}

FrameProcessingAsyncWorker::~FrameProcessingAsyncWorker() {
  delete this->framesQueue;
}

void FrameProcessingAsyncWorker::SendFrame(cv::Mat frame) {
  while (!this->framesQueue->push(frame))
    ;
}

void FrameProcessingAsyncWorker::Execute() {
  cv::Mat frame, gray, frameDelta, thresh, prevFrame;
  std::vector<std::vector<cv::Point>> cnts;
  double thr = 10.;
  int contours = 500;

  while (!this->framesQueue->pop(frame))
    ;

  //convert to grayscale and set the first frame
  cv::cvtColor(frame, prevFrame, cv::COLOR_BGR2GRAY);
  cv::GaussianBlur(prevFrame, prevFrame, cv::Size(21, 21), 0);
  
  while(this->running) {
    while (!this->framesQueue->pop(frame))
      ;

    //convert to grayscale
    cv::cvtColor(frame, gray, cv::COLOR_BGR2GRAY);
    cv::GaussianBlur(gray, gray, cv::Size(21, 21), 0);

    //compute difference between first frame and current frame
    cv::absdiff(prevFrame, gray, frameDelta);
    cv::threshold(frameDelta, thresh, thr, 255, cv::THRESH_BINARY);
        
    cv::dilate(thresh, thresh, cv::Mat(), cv::Point(-1,-1), 2);
    cv::findContours(thresh, cnts, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

    std::vector<cv::Rect> boundRect(cnts.size());
    std::vector<std::vector<cv::Point>> contours_poly(cnts.size());

    for(unsigned int i = 0; i < cnts.size(); i++) {
      if(contourArea(cnts[i]) < contours) {
        continue;
      }
      approxPolyDP(cnts[i], contours_poly[i], 3, true);
      boundRect[i] = cv::boundingRect(contours_poly[i]);
      cv::rectangle(frame, boundRect[i].tl(), boundRect[i].br(), cv::Scalar(0,255,0), 2, 8, 0);
      cv::putText(frame, "Motion Detected", cv::Point(10, 20), cv::FONT_HERSHEY_SIMPLEX, 0.75, cv::Scalar(255,255,255),2);
    }
    
    //imshow("Difference Frame", frameDelta);

    if (frame.size().height > 0 && frame.size().width > 0) {
      imshow("Camera Frame", frame);
      imshow("Threshold Frame", thresh);
      cv::waitKey(20);
      //std::cout << "Frame" << std::endl;
    }
    prevFrame = gray.clone();
  }
}

void FrameProcessingAsyncWorker::StopProcessing() {
  this->running = false;
}

void FrameProcessingAsyncWorker::OnOK() {
  
}

void FrameProcessingAsyncWorker::OnError(const Napi::Error& e) {

}