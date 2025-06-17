#ifndef binding_plugin_hpp
#define binding_plugin_hpp

#include <Arduino.h>

class BindingPlugin {
public:
  virtual void onConnected() {};
  virtual void loop() {};
  virtual void onMessage(String topic, String message) {};
};

#endif // binding_plugin_hpp