#include "settings.hpp"

MqttSettings::MqttSettings()
    : address(""), port(SettingsDefaults::MQTT_PORT), user(""), password(""),
      clientId(SettingsDefaults::MQTT_CLIENT_NAME) {}

void MqttSettings::toJson(JsonObject &obj) const {
  obj[JsonKeys::ADDRESS] = address;
  obj[JsonKeys::PORT] = port;
  obj[JsonKeys::USER] = user;
  obj[JsonKeys::PASSWORD] = password;
  obj[JsonKeys::CLIENT_ID] = clientId;
}

bool MqttSettings::fromJson(const JsonObject &obj) {

  bool result = true;

  address = obj[JsonKeys::ADDRESS] | "";
  if (address.isEmpty()) {
    Serial.println("Unable parse MQTT settings: no address defined");
    result = false;
  }

  port = obj[JsonKeys::PORT] | 0;
  if (port < 1) {
    Serial.println("Unable parse MQTT settings: no port defined");
    port = SettingsDefaults::MQTT_PORT;
    result = false;
  }

  clientId = obj[JsonKeys::CLIENT_ID] | "";
  if (clientId.isEmpty()) {
    Serial.println("Unable parse MQTT settings: no client id defined");
    clientId = SettingsDefaults::MQTT_CLIENT_NAME;
    result = false;
  }

  user = obj[JsonKeys::USER] | "";
  password = obj[JsonKeys::PASSWORD] | "";

  return result;
}

Binding::Binding()
    : type(MqttType::BOOL), pin(0), topic(""),
      direction(MqttDirection::SUBSCRIBE) {}

bool Binding::fromJson(const JsonObject &obj) {

  String typeStr = obj[JsonKeys::TYPE] | "";
  if (typeStr.isEmpty()) {
    Serial.println("Unable parse binding: no type defined");
    return false;
  }

  if (typeStr == JsonKeys::TYPE_BOOL)
    type = MqttType::FLOAT;
  else if (typeStr == JsonKeys::TYPE_FLOAT)
    type = MqttType::FLOAT;
  else if (typeStr == JsonKeys::TYPE_TIC)
    type = MqttType::TIC;
  else {
    Serial.println("Unable parse binding: unknown type: " + typeStr);
    return false;
  }

  String directionStr = obj[JsonKeys::DIRECTION] | "";
  if (directionStr.isEmpty()) {
    Serial.println("Unable parse binding: no direction defined");
    return false;
  }

  if (directionStr == JsonKeys::DIR_PUBLISH)
    direction = MqttDirection::PUBLISH;
  else if (directionStr == JsonKeys::DIR_SUBSCRIBE)
    direction = MqttDirection::SUBSCRIBE;
  else {
    Serial.println("Unable parse binding: unknown direction: " + directionStr);
    return false;
  }

  pin = obj[JsonKeys::PIN] | (SettingsDefaults::MAX_PIN + 1);
  if (pin > SettingsDefaults::MAX_PIN) {
    Serial.println("Unable parse binding: pin should be less or equals to " +
                   String(SettingsDefaults::MAX_PIN) + ", got " + pin);
    return false;
  }

  topic = obj[JsonKeys::TOPIC] | "";
  if (topic.isEmpty()) {
    Serial.println("Unable parse binding: no topic defined");
    return false;
  }

  return true;
}

void Binding::toJson(JsonObject &obj) const {
  switch (type) {
  case MqttType::BOOL:
    obj[JsonKeys::TYPE] = JsonKeys::TYPE_BOOL;
    break;
  case MqttType::FLOAT:
    obj[JsonKeys::TYPE] = JsonKeys::TYPE_FLOAT;
    break;
  case MqttType::TIC:
    obj[JsonKeys::TYPE] = JsonKeys::TYPE_TIC;
    break;
  }
  obj[JsonKeys::PIN] = pin;
  obj[JsonKeys::TOPIC] = topic;
  switch (direction) {
  case MqttDirection::SUBSCRIBE:
    obj[JsonKeys::DIRECTION] = JsonKeys::DIR_SUBSCRIBE;
    break;
  case MqttDirection::PUBLISH:
    obj[JsonKeys::DIRECTION] = JsonKeys::DIR_PUBLISH;
    break;
  }
}

Settings::Settings() : mdnsName(SettingsDefaults::MDNS_NAME) {}

bool Settings::fromJson(const String &jsonString) {
  JsonDocument doc;
  deserializeJson(doc, jsonString);

  bool result = true;

  mdnsName = doc[JsonKeys::MDNS_NAME] | "";
  if (mdnsName.isEmpty()) {
    Serial.println("Unable parse settings: no MDNS name defined");
    mdnsName = SettingsDefaults::MDNS_NAME;
    result = false;
  }

  result &= mqtt.fromJson(doc[JsonKeys::MQTT].as<JsonObject>());

  bindings.clear();
  JsonArray bindingsArray = doc[JsonKeys::BINDINGS].as<JsonArray>();
  for (JsonObject bindingObj : bindingsArray) {
    Binding binding;
    bool correctBinding = binding.fromJson(bindingObj);
    if (correctBinding) {
      bindings.push_back(binding);
    } else {
      result = false;
    }
  }

  return result;
}

String Settings::toJson() const {
  JsonDocument doc;
  doc[JsonKeys::MDNS_NAME] = mdnsName;

  JsonObject mqttObj = doc[JsonKeys::MQTT].to<JsonObject>();
  mqtt.toJson(mqttObj);

  JsonArray bindingsArray = doc[JsonKeys::BINDINGS].to<JsonArray>();
  for (const Binding &binding : bindings) {
    JsonObject bindingObj = bindingsArray.add<JsonObject>();
    binding.toJson(bindingObj);
  }

  String jsonString;
  serializeJson(doc, jsonString);
  return jsonString;
}