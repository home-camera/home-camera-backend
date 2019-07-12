#include <opencv2/opencv.hpp>
#include <opencv2/video/tracking.hpp>
#include <opencv2/core/ocl.hpp>
#include <ctime>
#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#include <vector>

#include <cassert>

#include "frame_processing_async_worker.hpp"

namespace Native::Camera {
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

  FrameProcessingAsyncWorker::FrameProcessingAsyncWorker(Buffer<cv::Mat>& buffer,
                                                    CameraNative& camera,
                                                    Napi::Function& callback) 
                                                  : Napi::AsyncWorker(callback),
                                                  camera(camera),
                                                  running(false),
                                                  buffer_(buffer) {
  }

  FrameProcessingAsyncWorker::~FrameProcessingAsyncWorker() {
  }

  void FrameProcessingAsyncWorker::Execute() {
    cv::Mat frame, gray, frameDelta, thresh, prevFrame;
    std::vector<std::vector<cv::Point>> cnts;
    double thr = 10.;
    int contours = 500;
    cv::VideoWriter writer;
    volatile bool motion = false;

    this->running = true;

    frame = buffer_.remove();
    assert(!frame.empty());

    bool isColor = (frame.type() == CV_8UC3);
    //convert to grayscale and set the first frame
    cv::cvtColor(frame, prevFrame, cv::COLOR_BGR2GRAY);
    cv::GaussianBlur(prevFrame, prevFrame, cv::Size(21, 21), 0);
    
    while(this->running) {
      frame = buffer_.remove();
      assert(!frame.empty());
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
        std::string path = "videos/" + get_file_timestamp() + ".avi";
        if (!writer.isOpened()) {
          writer.open(path, camera.codecs[camera.GetVideoCodec()], camera.GetFps(), frame.size(), isColor);
          if (!writer.isOpened())
            return;
        }
        cv::rectangle(frame, cv::Point2f(0, frame.rows - 40), cv::Point2f(170, frame.rows), cv::Scalar(255, 255, 255), -1);
        cv::putText(frame, get_timestamp(), cv::Point2f(8, frame.rows - 10), cv::FONT_HERSHEY_SIMPLEX, 1, cv::Scalar(0, 0, 0), 4);
        writer.write(frame);
        motion = false;
      }

      prevFrame = gray.clone();
    }
    if (writer.isOpened()) {
      writer.release();
    }
  }

  void FrameProcessingAsyncWorker::StopProcessing() {
    this->running = false;
  }

  void FrameProcessingAsyncWorker::OnOK() {
    
  }

  void FrameProcessingAsyncWorker::OnError(const Napi::Error& e) {

  }
}