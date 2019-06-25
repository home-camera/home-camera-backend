#include <napi.h>
#include <opencv2/opencv.hpp>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return exports;
}

NODE_API_MODULE(camera_addon, InitAll)