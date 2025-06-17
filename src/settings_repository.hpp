#ifndef settings_repository_hpp
#define settings_repository_hpp

#include "settings.hpp"

class SettingsRepository {
public:
  void setup();

  const Settings &getSettings() const;

  bool updateSettings(const Settings &settings);

private:
  Settings settings;
};

#endif // settings_repository_hpp