#ifndef bool_to_pin
#define bool_to_pin

#include <PubSubClient.h>

#include "binding_plugin.hpp"

class BoolToPin : public BindingPlugin {
public:
  BoolToPin(PubSubClient &client, uint8_t pin, String topic);
  void onConnected() override;
  void onMessage(String topic, String message) override;

private:
  PubSubClient &client;
  uint8_t pin;
  String topic;
};

#endif // bool_to_pin