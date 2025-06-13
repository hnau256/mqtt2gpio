#ifndef SETTINGS_REPOSITORY_H
#define SETTINGS_REPOSITORY_H

#include "settings.hpp"
#include <LittleFS.h>

class SettingsRepository {
public:
  void init();
  const Settings& getSettings() const;
  bool saveSettings(const String& jsonString);

private:
  Settings settings;
};

#endif