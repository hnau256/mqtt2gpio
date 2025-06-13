#ifndef resizable_array_hpp
#define resizable_array_hpp

#include <cstdint>

template <typename T, std::size_t MAX_SIZE>
class ResizableArray {
 private:
  T items[MAX_SIZE];
  std::size_t size;

 public:
  ResizableArray();
  void append(const T& item);
  std::size_t getSize() const;
  T& operator[](std::size_t index);
};

#endif  // resizable_array_hpp
