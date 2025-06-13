#include "cycle_item.hpp"
#include "utils.hpp"

CycleItem::CycleItem() : duration_minutes(0), target(0) {}

#define CYCLE_ITEM_JSON_FIELD_DURATION_MINUTES "duration_minutes"
#define CYCLE_ITEM_JSON_FIELD_TARGET "target"

bool CycleItem::fill(const JsonObject& json) {
  if (!json.containsKey(CYCLE_ITEM_JSON_FIELD_DURATION_MINUTES)) {
    Serial.print("Json has no \"");
    Serial.print(CYCLE_ITEM_JSON_FIELD_DURATION_MINUTES);
    Serial.println("\" field");
    return false;
  }
  if (!json.containsKey(CYCLE_ITEM_JSON_FIELD_TARGET)) {
    Serial.print("Json has no \"");
    Serial.print(CYCLE_ITEM_JSON_FIELD_TARGET);
    Serial.println("\" field");
    return false;
  }
  duration_minutes = json[CYCLE_ITEM_JSON_FIELD_DURATION_MINUTES];
  target = json[CYCLE_ITEM_JSON_FIELD_TARGET];
  return true;
}

uint16_t CycleItem::getDurationMinutes() const {
  return duration_minutes;
}

bool CycleItem::fill(File& file) {
  return readUInt16T(file, &duration_minutes) && readUInt16T(file, &target);
}

uint16_t CycleItem::getTarget() const {
  return target;
}

bool CycleItem::write(Print& print) const {
  return writeUInt16T(print, duration_minutes) && writeUInt16T(print, target);
}

String CycleItem::toJson() const {
  String result("{\"");
  result += CYCLE_ITEM_JSON_FIELD_DURATION_MINUTES;
  result += "\":";
  result += duration_minutes;
  result += ",\"";
  result += CYCLE_ITEM_JSON_FIELD_TARGET;
  result += "\":";
  result += target;
  result += "}";
  return result;
}
