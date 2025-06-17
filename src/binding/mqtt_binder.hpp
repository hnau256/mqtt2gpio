#ifndef mqtt_binder_hpp
#define mqtt_binder_hpp

#include <memory>
#include "../settings_repository.hpp"
#include "plugins/binding_plugin.hpp"
#include "mqtt_connector.hpp"
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
  MqttConnector connector;

  std::vector<std::unique_ptr<BindingPlugin>> plugins;

  void onConnected();
  void callback(char*, uint8_t*, unsigned int);
  void addPlugin(const Binding &binding);
};

#endif //mqtt_binder_hpp
