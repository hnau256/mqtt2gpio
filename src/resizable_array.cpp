#include "resizable_array.hpp"

template <typename T, std::size_t MAX_SIZE>
inline ResizableArray<T, MAX_SIZE>::ResizableArray() : size(0) {}

template <typename T, std::size_t MAX_SIZE>
inline void ResizableArray<T, MAX_SIZE>::append(const T& item) {
  items[size] = item;
  size++;
}

template <typename T, std::size_t MAX_SIZE>
inline std::size_t ResizableArray<T, MAX_SIZE>::getSize() const {
  return size;
}

template <typename T, std::size_t MAX_SIZE>
inline T& ResizableArray<T, MAX_SIZE>::operator[](std::size_t index) {
  return items[index];
}