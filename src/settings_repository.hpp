#ifndef SETTINGS_REPOSITORY_H
#define SETTINGS_REPOSITORY_H

#include "settings.hpp"
#include <LittleFS.h>

class SettingsRepository {
public:
  void init();
  const Settings& getSettings() const;
  bool saveSettings(const Settings& newSettings);

private:
  Settings settings;
};

#endif