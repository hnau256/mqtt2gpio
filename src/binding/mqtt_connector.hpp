#ifndef mqtt_connector_hpp
#define mqtt_connector_hpp

#include "../settings.hpp"
#include <PubSubClient.h>
#include <functional>

class MqttConnector {
public:
  MqttConnector(PubSubClient& pubSubClient, std::function<void()> onConnected);
  void setup(const Settings& settings);
  void loop();

private:
  PubSubClient& pubSubClient;
  Settings settings;
  uint64_t lastConnection;
  void handleDisconnected();
  std::function<void()> onConnected;
};

#endif //mqtt_connector_hpp