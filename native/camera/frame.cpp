#include "frame.hpp"

Frame::Frame() {

}

Frame::~Frame() {

}

cv::Mat Frame::GetFrame() const {
  return this->frame;
}

std::vector<uchar> Frame::GetImage() const {
  return this->image;
}

void Frame::SetFrame(cv::Mat frame) {
  this->frame = frame;
}

void Frame::SetImage(std::vector<uchar> image) {
  this->image = image;
}