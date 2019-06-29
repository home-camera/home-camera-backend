#ifndef _FRAME_H_
#define _FRAME_H_

#include <opencv2/opencv.hpp>
#include <vector>

class Frame {
  public:
    Frame();
    ~Frame();

    cv::Mat GetFrame() const;
    std::vector<uchar> GetImage() const;

    void SetFrame(cv::Mat frame);
    void SetImage(std::vector<uchar> image);
  private:
    cv::Mat frame;
    std::vector<uchar> image;
};

#endif /* _FRAME_H_ */