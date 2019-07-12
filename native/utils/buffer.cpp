#if 0
#include "buffer.hpp"

template <class T>
Buffer<T>::Buffer() {

}

template <class T>
Buffer<T>::Buffer(size_t size) {
  size_ = size;
}

template <class T>
void Buffer<T>::add(T value) {
  while (true) {
    std::unique_lock<std::mutex> locker(mtx);
    cond.wait(locker, [this](){ return buffer_.size() < size_; });
    buffer_.push_back(value);
    locker.unlock();
    cond.notify_all();
    return;
  }
}

template <class T>
T Buffer<T>::remove() {
  while (true) {
    std::unique_lock<std::mutex> locker(mtx);
    cond.wait(locker, [this](){ return buffer_.size() > 0; });
    T back = buffer_.back();
    buffer_.pop_back();
    locker.unlock();
    cond.notify_all();
    return back;
  }
}
#endif