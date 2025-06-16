#include "settings_repository.hpp"
#include <PubSubClient.h>
#include <WiFi.h>

class MqttBinder {
public:
  MqttBinder(SettingsRepository &settingsRepository);
  void setup();
  void loop();

private:
  SettingsRepository &settingsRepository;
  WiFiClient wifiClient;
  PubSubClient pubSubClient;
  uint64_t lastConnection;

  void handleDisconnected();
  void bind();
  void callback(char*, uint8_t*, unsigned int);
};
