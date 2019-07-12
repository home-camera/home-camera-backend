#ifndef _CAMERA_NATIVE_H_
#define _CAMERA_NATIVE_H_

#include <map>
#include <iostream>
#include <opencv2/opencv.hpp>
#include "frame.hpp"

namespace Native::Camera {

  class CameraNative {
    public:
      CameraNative();
      ~CameraNative();

      int32_t GetWidth() const;
      int32_t GetHeight() const;
      int32_t GetFps() const;
      std::string GetImageCodec() const;
      std::string GetVideoCodec() const;
      cv::VideoCapture GetVideoCapture() const;
      
      void SetWidth(int32_t width);
      void SetHeight(int32_t height);
      void SetFps(int32_t fps);
      void SetImageCodec(std::string imageCodec);
      void SetVideoCodec(std::string videoCodec);

      void Open(int device);
      void Open(std::string filename);

      bool IsOpen() const;

      void Close();

      void ReadFrame(Frame* frame);
      std::map<std::string, int> codecs = {
        {"divx", cv::VideoWriter::fourcc('D', 'I', 'V', 'X')}
      };
    private:
      int32_t width, height, fps;
      cv::VideoCapture capture;
      std::string imageCodec;
      std::string videoCodec;
      bool isOpen;
  };
}

#endif /* _CAMERA_NATIVE_H_ */