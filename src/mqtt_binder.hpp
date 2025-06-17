#ifndef mqtt_binder_hpp
#define mqtt_binder_hpp

#include "settings_repository.hpp"
#include <PubSubClient.h>
#include <WiFi.h>

class MqttBinder {
public:
  MqttBinder();
  void setup(const Settings& settings);
  void loop();

private:
  Settings settings;
  WiFiClient wifiClient;
  PubSubClient pubSubClient;
  uint64_t lastConnection;

  void handleDisconnected();
  void bind();
  void callback(char*, uint8_t*, unsigned int);
};

#endif //mqtt_binder_hpp
