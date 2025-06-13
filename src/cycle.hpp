#ifndef cycle_hpp
#define cycle_hpp

#include <FS.h>
#include <cstdint>
#include "cycle_item.hpp"

#define CYCLE_MAX_ITEMS_COUNT 256

class Cycle {
 private:
  CycleItem items[CYCLE_MAX_ITEMS_COUNT];
  std::size_t size;

 public:
  bool fill(JsonArray& itemsJson);
  bool fill(File& file);
  bool write(Print& target) const;
  String toJson() const;
};

#endif  // cycle_hpp
