#ifndef _BUFFER_H_
#define _BUFFER_H_

#include <deque>
#include <mutex>
#include <condition_variable>

template <class T>
class Buffer {
  public:
    Buffer() {}
    Buffer(size_t size) { size_ = size; }
    void add(T value) {
      while (true) {
        std::unique_lock<std::mutex> locker(mtx);
        cond.wait(locker, [this](){ return buffer_.size() < size_; });
        buffer_.push_back(value);
        locker.unlock();
        cond.notify_all();
        return;
      }
    }
    T remove() {
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
  private:
    std::mutex mtx;
    std::condition_variable cond;
    std::deque<T> buffer_;
    const size_t size_ = 10;
};

#endif /* _BUFFER_H_ */