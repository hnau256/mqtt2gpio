#ifndef SETTINGS_H
#define SETTINGS_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

namespace SettingsDefaults {
    const char* const MDNS_NAME = "mqtt2gpio";
    const uint16_t MQTT_PORT = 1883;
    const size_t JSON_CAPACITY = 1024;
}

namespace JsonKeys {
  const char* const MDNS_NAME = "mdns_name";
  const char* const MQTT = "mqtt";
  const char* const ADDRESS = "address";
  const char* const PORT = "port";
  const char* const USER = "user";
  const char* const PASSWORD = "password";
  const char* const CLIENT_ID = "user_id";
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

// Перечисления
enum class MqttDirection {
  SUBSCRIBE,
  PUBLISH
};

enum class MqttType {
  BOOL,
  FLOAT,
  TIC
};

// Класс для MQTT-настроек
class MqttSettings {
public:
  String address;
  uint16_t port;
  String user;
  String password;
  String clientId;

  MqttSettings();
  MqttSettings(const JsonObject& obj);
  void toJson(JsonObject& obj) const;
  bool fromJson(const JsonObject& obj);
};

class Binding {
public:
  MqttType type;
  uint8_t pin;
  String topic;
  MqttDirection direction;

  Binding();
  Binding(const JsonObject& obj);
  void toJson(JsonObject& obj) const;
};

class Settings {
public:
  String mdnsName;
  MqttSettings mqtt;
  std::vector<Binding> bindings;

  Settings(); 
  Settings(const String& jsonString);
  String toJson() const;
};

#endif