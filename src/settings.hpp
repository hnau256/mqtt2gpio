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

// Константы для JSON-ключей
namespace JsonKeys {
  const char* const MDNS_NAME = "mdns_name";
  const char* const MQTT = "mqtt";
  const char* const ADDRESS = "address";
  const char* const PORT = "port";
  const char* const USER = "user";
  const char* const PASSWORD = "password";
  const char* const BINDINGS = "bindings";
  const char* const TYPE = "type";
  const char* const PIN = "pin";
  const char* const TOPIC = "topic";
  const char* const DIRECTION = "direction";

  // Значения для type
  const char* const TYPE_BOOL = "bool";
  const char* const TYPE_FLOAT = "float";
  const char* const TYPE_TIC = "tic";

  // Значения direction
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

  MqttSettings(); // Конструктор по умолчанию
  MqttSettings(const JsonObject& obj); // Конструктор из JSON
  void toJson(JsonObject& obj) const;
};

// Класс для привязок (bindings)
class Binding {
public:
  MqttType type;
  uint8_t pin;
  String topic;
  MqttDirection direction;

  Binding(); // Конструктор по умолчанию
  Binding(const JsonObject& obj); // Конструктор из JSON
  void toJson(JsonObject& obj) const;
};

// Класс для общих настроек
class Settings {
public:
  String mdns_name;
  MqttSettings mqtt;
  std::vector<Binding> bindings;

  Settings(); // Конструктор по умолчанию
  Settings(const String& jsonString); // Конструктор из JSON-строки
  String toJson() const;
};

#endif