#include "cycles_repository.hpp"
#include <LittleFS.h>

CyclesRepository::CyclesRepository()
    : isInitialized(false), fsIsInitialized(false) {}

bool CyclesRepository::listCycles(
    std::function<void(const String&)> onNextCycleName) {
  if (!initializeIfNeed()) {
    return false;
  }
  Dir dir = LittleFS.openDir("/");
  while (dir.next()) {
    String fileName = dir.fileName();
    onNextCycleName(fileName);
  }
  return true;
}

bool CyclesRepository::insert(const char* cycle_name, const Cycle& cycle) {
  if (!initializeIfNeed()) {
    return false;
  }
  String filename = createCycleFileName(cycle_name);
  File file = LittleFS.open(filename, "w");
  if (!file) {
    Serial.print("Unable open file \"");
    Serial.print(filename);
    Serial.println("\" to write cycle");
    return false;
  }
  bool cycleWasWritten = cycle.write(file);
  file.close();
  return cycleWasWritten;
}

bool CyclesRepository::remove(const char* cycle_name) {
  String filename = createCycleFileName(cycle_name);
  return LittleFS.remove(filename);
}

bool CyclesRepository::get(const char* cycle_name, Cycle& result) {
  String filename = createCycleFileName(cycle_name);
  File file = LittleFS.open(filename, "r");
  if (!file) {
    Serial.print("Unable open file \"");
    Serial.print(filename);
    Serial.println("\" to read cycle");
    return false;
  }
  bool filled = result.fill(file);
  file.close();
  return filled;
}

bool CyclesRepository::initializeIfNeed() {
  if (!isInitialized) {
    fsIsInitialized = LittleFS.begin();
    if (!fsIsInitialized) {
      Serial.println("Filed to initialize file system");
    }
    isInitialized = true;
  }
  return fsIsInitialized;
}

String CyclesRepository::createCycleFileName(const char* cycle_name) {
  return String("/") + cycle_name;
}
