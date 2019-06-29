#include "camera.hpp"

Camera::Camera() {
  this->capture = new cv::VideoCapture();
  this->width = this->height = this->fps = 0;
  this->imageCodec = ".jpg";
  this->videoCodec = "";
  this->isOpen = false;
}

Camera::~Camera() {
  delete this->capture;
}

int32_t Camera::GetWidth() const {
  return this->width;
}

int32_t Camera::GetHeight() const {
  return this->height;
}

int32_t Camera::GetFps() const {
  return this->fps;
}

std::string Camera::GetImageCodec() const {
  return this->imageCodec;
}

std::string Camera::GetVideoCodec() const {
  return this->videoCodec;
}

cv::VideoCapture* Camera::GetVideoCapture() const {
  return this->capture;
}

void Camera::SetWidth(int32_t width) {
  if (!this->IsOpen())
    this->width = width;
}

void Camera::SetHeight(int32_t height) {
  if (!this->IsOpen())
    this->height = height;
}

void Camera::SetFps(int32_t fps) {
  if (!this->IsOpen())
    this->fps = fps;
}

void Camera::SetImageCodec(std::string imageCodec) {
  if (!this->IsOpen())
    this->imageCodec = imageCodec;
}

void Camera::SetVideoCodec(std::string videoCodec) {
  if (!this->IsOpen())
    this->videoCodec = videoCodec;
}

void Camera::Open(int device) {
  this->capture->open(device);
  this->isOpen = true;
}

void Camera::Open(std::string filename) {
  this->capture->open(filename);
  this->isOpen = true;
}

bool Camera::IsOpen() const {
  return this->isOpen;
}

void Camera::ReadFrame(Frame* frame) {
  if (!this->IsOpen())
    return;
  cv::Mat mat;
  std::vector<uchar> image = std::vector<uchar>();
  this->capture->read(mat);
  frame->SetFrame(mat);
  std::vector<int> compression_parameters(2);
  compression_parameters[0] = cv::IMWRITE_JPEG_QUALITY;
  compression_parameters[1] = 85;
  cv::imencode(this->imageCodec, mat, image, compression_parameters);
  frame->SetImage(image);
}