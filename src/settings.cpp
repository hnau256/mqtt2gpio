#include "settings.hpp"

MqttSettings::MqttSettings() : address(""), port(SettingsDefaults::MQTT_PORT), user(""), password(""), userId("") {}

MqttSettings::MqttSettings(const JsonObject& obj) {
  address = obj[JsonKeys::ADDRESS] | String("");
  port = obj[JsonKeys::PORT] | SettingsDefaults::MQTT_PORT;
  user = obj[JsonKeys::USER] | String("");
  password = obj[JsonKeys::PASSWORD] | String("");
  userId = obj[JsonKeys::USER_ID] | String("");
}

void MqttSettings::toJson(JsonObject& obj) const {
  obj[JsonKeys::ADDRESS] = address;
  obj[JsonKeys::PORT] = port;
  obj[JsonKeys::USER] = user;
  obj[JsonKeys::PASSWORD] = password;
  obj[JsonKeys::USER_ID] = userId;
}

Binding::Binding() : type(MqttType::BOOL), pin(0), topic(""), direction(MqttDirection::SUBSCRIBE) {}

Binding::Binding(const JsonObject& obj) {
  String typeStr = obj[JsonKeys::TYPE] | String(JsonKeys::TYPE_BOOL);
  if (typeStr == JsonKeys::TYPE_FLOAT) type = MqttType::FLOAT;
  else if (typeStr == JsonKeys::TYPE_TIC) type = MqttType::TIC;
  else type = MqttType::BOOL;

  pin = obj[JsonKeys::PIN] | 0;
  topic = obj[JsonKeys::TOPIC] | String("");

  String dirStr = obj[JsonKeys::DIRECTION] | String(JsonKeys::DIR_SUBSCRIBE);
  direction = (dirStr == JsonKeys::DIR_PUBLISH) ? MqttDirection::PUBLISH : MqttDirection::SUBSCRIBE;
}

void Binding::toJson(JsonObject& obj) const {
  switch (type) {
    case MqttType::BOOL: obj[JsonKeys::TYPE] = JsonKeys::TYPE_BOOL; break;
    case MqttType::FLOAT: obj[JsonKeys::TYPE] = JsonKeys::TYPE_FLOAT; break;
    case MqttType::TIC: obj[JsonKeys::TYPE] = JsonKeys::TYPE_TIC; break;
  }
  obj[JsonKeys::PIN] = pin;
  obj[JsonKeys::TOPIC] = topic;
  switch (direction) {
    case MqttDirection::SUBSCRIBE: obj[JsonKeys::DIRECTION] = JsonKeys::DIR_SUBSCRIBE; break;
    case MqttDirection::PUBLISH: obj[JsonKeys::DIRECTION] = JsonKeys::DIR_PUBLISH; break;
  }
}

Settings::Settings() : mdnsName(SettingsDefaults::MDNS_NAME) {}

Settings::Settings(const String& jsonString) : mdnsName(SettingsDefaults::MDNS_NAME) {
  DynamicJsonDocument doc(SettingsDefaults::JSON_CAPACITY);
  deserializeJson(doc, jsonString); // Игнорируем ошибки парсинга
  JsonObject root = doc.as<JsonObject>();

  mdnsName = root[JsonKeys::MDNS_NAME] | String(SettingsDefaults::MDNS_NAME);
  mqtt = MqttSettings(root[JsonKeys::MQTT].as<JsonObject>());

  bindings.clear();
  JsonArray bindingsArray = root[JsonKeys::BINDINGS].as<JsonArray>();
  for (JsonObject bindingObj : bindingsArray) {
    bindings.push_back(Binding(bindingObj));
  }
}

String Settings::toJson() const {
  DynamicJsonDocument doc(SettingsDefaults::JSON_CAPACITY);
  JsonObject root = doc.to<JsonObject>();
  root[JsonKeys::MDNS_NAME] = mdnsName;

  JsonObject mqttObj = root.createNestedObject(JsonKeys::MQTT);
  mqtt.toJson(mqttObj);

  JsonArray bindingsArray = root.createNestedArray(JsonKeys::BINDINGS);
  for (const Binding& binding : bindings) {
    JsonObject bindingObj = bindingsArray.createNestedObject();
    binding.toJson(bindingObj);
  }

  String jsonString;
  serializeJson(doc, jsonString);
  return jsonString;
}