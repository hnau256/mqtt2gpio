#ifndef pin_to_bool
#define pin_to_bool

#include <PubSubClient.h>

#include "binding_plugin.hpp"

class PinToBool : public BindingPlugin {
public:
  PinToBool(PubSubClient &client, uint8_t pin, String topic);
  void loop() override;
  void onConnected() override;

private:
  PubSubClient &client;
  uint8_t pin;
  String topic;
  uint8_t lastPinState;

  void sendPinState(uint8_t currentPinState);
};

#endif // pin_to_bool