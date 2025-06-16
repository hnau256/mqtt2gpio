#ifndef SETTINGS_H
#define SETTINGS_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

namespace SettingsDefaults {
    const char* const MDNS_NAME = "mqtt2gpio";
    const uint16_t MQTT_PORT = 1883;
    const char* const MQTT_CLIENT_NAME = "mqtt2gpio";
    const size_t JSON_CAPACITY = 1024;
    const uint8_t MAX_PIN = 39;
}

namespace JsonKeys {
  const char* const MDNS_NAME = "mdns_name";
  const char* const MQTT = "mqtt";
  const char* const ADDRESS = "address";
  const char* const PORT = "port";
  const char* const USER = "user";
  const char* const PASSWORD = "password";
  const char* const CLIENT_ID = "client_id";
  const char* const BINDINGS = "bindings";
  const char* const TYPE = "type";
  const char* const PIN = "pin";
  const char* const TOPIC = "topic";
  const char* const DIRECTION = "direction";

  const char* const TYPE_BOOL = "bool";
  const char* const TYPE_FLOAT = "float";
  const char* const TYPE_TIC = "tic";

  const char* const DIR_SUBSCRIBE = "subscribe";
  const char* const DIR_PUBLISH = "publish";
}

enum class MqttDirection {
  SUBSCRIBE,
  PUBLISH
};

enum class MqttType {
  BOOL,
  FLOAT,
  TIC
};

class MqttSettings {
public:
  String address;
  uint16_t port;
  String user;
  String password;
  String clientId;

  MqttSettings();
  bool fromJson(const JsonObject& obj);
  void toJson(JsonObject& obj) const;
};

class Binding {
public:
  MqttType type;
  uint8_t pin;
  String topic;
  MqttDirection direction;

  Binding();
  bool fromJson(const JsonObject& obj);
  void toJson(JsonObject& obj) const;
};

class Settings {
public:
  String mdnsName;
  MqttSettings mqtt;
  std::vector<Binding> bindings;

  Settings(); 
  bool fromJson(const String& jsonString);
  String toJson() const;
};

#endif