#ifndef cycles_repository_hpp
#define cycles_repository_hpp

#include <ArduinoJson.h>
#include <WString.h>
#include <functional>
#include "cycle.hpp"
#include "resizable_array.hpp"

class CyclesRepository {
 private:
  bool isInitialized;
  bool fsIsInitialized;
  bool initializeIfNeed();
  String createCycleFileName(const char* cycle_name);

 public:
  CyclesRepository();
  bool listCycles(std::function<void(const String&)> onNextCycleName);
  bool insert(const char* cycle_name, const Cycle& cycle);
  bool remove(const char* cycle_name);
  bool get(const char* cycle_name, Cycle& result);
};

#endif  // cycles_repository_hpp