#ifndef cycle_item_hpp
#define cycle_item_hpp

#include <ArduinoJson.h>
#include <cstdint>
#include <FS.h>

class CycleItem {
 private:
  uint16_t duration_minutes;
  uint16_t target;

 public:
  CycleItem();
  bool fill(const JsonObject& json);
  bool fill(File& file);
  uint16_t getDurationMinutes() const;
  uint16_t getTarget() const;
  bool write(Print& print) const;
  String toJson() const;
};

#endif  // cycle_item_hpp