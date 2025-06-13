#include "cycle.hpp"
#include "utils.hpp"

bool Cycle::fill(JsonArray& itemsJson) {
  size = 0;
  for (JsonObject itemJson : itemsJson) {
    if (size >= CYCLE_MAX_ITEMS_COUNT) {
      Serial.print("Cycle items count is more than ");
      Serial.println(CYCLE_MAX_ITEMS_COUNT);
      size = 0;
      return false;
    }
    bool itemWasFilled = items[size].fill(itemJson);
    if (!itemWasFilled) {
      size = 0;
      return false;
    }
    size++;
  }
  return true;
}

bool Cycle::fill(File& file) {
  size = 0;
  while (file.available() > 0) {
    if (size >= CYCLE_MAX_ITEMS_COUNT) {
      Serial.print("Cycle items count is more than ");
      Serial.println(CYCLE_MAX_ITEMS_COUNT);
      size = 0;
      return false;
    }
    bool itemWasFilled = items[size].fill(file);
    if (!itemWasFilled) {
      size = 0;
      return false;
    }
    size++;
  }

  return true;
}

bool Cycle::write(Print& target) const {
  for (size_t i = 0; i < size; i++) {
    bool itemWasWritten = items[i].write(target);
    if (!itemWasWritten) {
      return false;
    }
  }
  return true;
}

String Cycle::toJson() const {
  String result("[");
  bool firstItem = true;
  for (size_t i = 0; i < size; i++) {
    if (firstItem) {
      firstItem = false;
    } else {
      result += ",";
    }
    result += items[i].toJson();
  }
  result += "]";
  return result;
}
