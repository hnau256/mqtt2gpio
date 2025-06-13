#ifndef utils_hpp
#define utils_hpp

#include <FS.h>
#include <Print.h>
#include <cstdint>

bool writeUInt16T(Print& print, uint16_t value);
bool readUInt16T(File& file, uint16_t* result);

#endif  // utils_hpp