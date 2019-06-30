#include <opencv2/opencv.hpp>
#include <opencv2/video/tracking.hpp>
#include <opencv2/core/ocl.hpp>
#include <ctime>
#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#include <vector>

#include "frame_processing_async_worker.hpp"

static std::string get_file_timestamp() {
  time_t t = time(0);   // get time now
  struct tm tm = *localtime(&t);
  char datum[128];
  sprintf(datum, "%d-%d-%d", tm.tm_year+1900, tm.tm_mon + 1, tm.tm_mday);
  return std::string(datum);
}

static std::string get_timestamp() {
  time_t t = time(0);   // get time now
  struct tm tm = *localtime(&t);
  char datum[128];
  sprintf(datum, "%d:%d:%d", tm.tm_hour, tm.tm_min, tm.tm_sec);
  return std::string(datum);
}

FrameProcessingAsyncWorker::FrameProcessingAsyncWorker(size_t queueSize,
                                                  Camera* camera,
                                                  Napi::Function& callback) 
                                                : Napi::AsyncWorker(callback),
                                                camera(camera),
                                                running(false) {
  this->framesQueue = new boost::lockfree::spsc_queue<cv::Mat>(queueSize);
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
  cv::VideoWriter* writer = nullptr;
  volatile bool motion = false;

  this->running = true;

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

    for(unsigned int i = 0; i < cnts.size(); i++) {
      if(contourArea(cnts[i]) < contours) {
        continue;
      }
      motion = true;
    }

    if (motion) {
      struct stat buffer;
      std::string path = get_file_timestamp() + ".avi";
      if (stat(path.c_str(), &buffer) != 0) {
        writer = new cv::VideoWriter(path, camera->GetVideoCodec(), camera->GetFps(), frame.size(), true);
      }
      cv::rectangle(frame, cv::Point2f(0, frame.rows - 40), cv::Point2f(170, frame.rows), cv::Scalar(255, 255, 255), -1);
      cv::putText(frame, get_timestamp(), cv::Point2f(8, frame.rows - 10), cv::FONT_HERSHEY_SIMPLEX, 1, cv::Scalar(0, 0, 0), 4);
      writer->write(frame);
      motion = false;
    }

    prevFrame = gray.clone();
  }
  if (nullptr != writer) {
    writer->release();
    delete writer;
  }
}

void FrameProcessingAsyncWorker::StopProcessing() {
  this->running = false;
}

void FrameProcessingAsyncWorker::OnOK() {
  
}

void FrameProcessingAsyncWorker::OnError(const Napi::Error& e) {

}