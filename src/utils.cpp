#include "utils.hpp"

#define UINT16_T_BYTES (sizeof(uint16_t))

bool writeUInt16T(Print& print, uint16_t value) {
  size_t written_bytes = print.write((const uint8_t*)&value, UINT16_T_BYTES);
  bool result = written_bytes == UINT16_T_BYTES;
  if (!result) {
    Serial.print("Unable write ");
    Serial.print(value);
  }
  return result;
}

bool readUInt16T(File& file, uint16_t* result) {
  int readCount = file.read((uint8_t*)result, UINT16_T_BYTES);
  if (readCount != UINT16_T_BYTES) {
    Serial.print("Unable read uint16_t from file");
    return false;
  }
  return true;
}