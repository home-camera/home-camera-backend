#include "camera_native.hpp"

namespace Native::Camera {
  CameraNative::CameraNative() : capture() {
    this->width = this->height = this->fps = 0;
    this->imageCodec = ".jpg";
    this->videoCodec = "divx";
    this->isOpen = false;
  }

  CameraNative::~CameraNative() {
  }

  int32_t CameraNative::GetWidth() const {
    return this->width;
  }

  int32_t CameraNative::GetHeight() const {
    return this->height;
  }

  int32_t CameraNative::GetFps() const {
    return this->fps;
  }

  std::string CameraNative::GetImageCodec() const {
    return this->imageCodec;
  }

  std::string CameraNative::GetVideoCodec() const {
    return this->videoCodec;
  }

  cv::VideoCapture CameraNative::GetVideoCapture() const {
    return this->capture;
  }

  void CameraNative::SetWidth(int32_t width) {
    if (!this->IsOpen())
      this->width = width;
  }

  void CameraNative::SetHeight(int32_t height) {
    if (!this->IsOpen())
      this->height = height;
  }

  void CameraNative::SetFps(int32_t fps) {
    if (!this->IsOpen())
      this->fps = fps;
  }

  void CameraNative::SetImageCodec(std::string imageCodec) {
    if (!this->IsOpen())
      this->imageCodec = imageCodec;
  }

  void CameraNative::SetVideoCodec(std::string videoCodec) {
    if (this->IsOpen())
      return;
    if (codecs.find(videoCodec) != codecs.end())
      this->videoCodec = videoCodec;
  }

  void CameraNative::Open(int device) {
    this->capture.open(device);
    this->isOpen = true;
  }

  void CameraNative::Open(std::string filename) {
    this->capture.open(filename);
    this->isOpen = true;
  }

  bool CameraNative::IsOpen() const {
    return this->isOpen;
  }

  void CameraNative::ReadFrame(Frame* frame) {
    if (!this->IsOpen())
      return;
    cv::Mat mat;
    //std::vector<uchar> image = std::vector<uchar>();
    this->capture >> mat;
    frame->SetFrame(mat.clone());
    /*
    std::vector<int> compression_parameters(2);
    compression_parameters[0] = cv::IMWRITE_JPEG_QUALITY;
    compression_parameters[1] = 85;
    cv::imencode(this->imageCodec, mat, image, compression_parameters);
    frame->SetImage(image); */
  }

  void CameraNative::Close() {
    this->capture.release();
  }
}
