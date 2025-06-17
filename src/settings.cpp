#include "settings.hpp"

MqttSettings::MqttSettings()
    : address(""), port(SettingsDefaults::MQTT_PORT), user(""), password(""),
      clientId(SettingsDefaults::MQTT_CLIENT_NAME), valid(false) {}

void MqttSettings::toJson(JsonObject &obj) const {
  obj[JsonKeys::ADDRESS] = address;
  obj[JsonKeys::PORT] = port;
  obj[JsonKeys::USER] = user;
  obj[JsonKeys::PASSWORD] = password;
  obj[JsonKeys::CLIENT_ID] = clientId;
}

void MqttSettings::fromJson(const JsonObject &obj) {

  valid = true;

  address = obj[JsonKeys::ADDRESS] | "";
  if (address.isEmpty()) {
    Serial.println("Unable parse MQTT settings: no address defined");
    valid = false;
  }

  port = obj[JsonKeys::PORT] | 0;
  if (port < 1) {
    Serial.println("Unable parse MQTT settings: no port defined");
    port = SettingsDefaults::MQTT_PORT;
    valid = false;
  }

  clientId = obj[JsonKeys::CLIENT_ID] | "";
  if (clientId.isEmpty()) {
    Serial.println("Unable parse MQTT settings: no client id defined");
    clientId = SettingsDefaults::MQTT_CLIENT_NAME;
    valid = false;
  }

  user = obj[JsonKeys::USER] | "";
  password = obj[JsonKeys::PASSWORD] | "";
}

Binding::Binding()
    : type(MqttType::BOOL), pin(0), topic(""),
      direction(MqttDirection::SUBSCRIBE) {}

void Binding::fromJson(const JsonObject &obj) {

  valid = true;

  String typeStr = obj[JsonKeys::TYPE] | "";
  if (typeStr.isEmpty()) {
    Serial.println("Unable parse binding: no type defined");
    valid = false;
  }

  if (typeStr == JsonKeys::TYPE_BOOL)
    type = MqttType::BOOL;
  else if (typeStr == JsonKeys::TYPE_FLOAT)
    type = MqttType::FLOAT;
  else if (typeStr == JsonKeys::TYPE_TIC)
    type = MqttType::TIC;
  else {
    Serial.println("Unable parse binding: unknown type: " + typeStr);
    valid = false;
  }

  String directionStr = obj[JsonKeys::DIRECTION] | "";
  if (directionStr.isEmpty()) {
    Serial.println("Unable parse binding: no direction defined");
    valid = false;
  }

  if (directionStr == JsonKeys::DIR_PUBLISH)
    direction = MqttDirection::PUBLISH;
  else if (directionStr == JsonKeys::DIR_SUBSCRIBE)
    direction = MqttDirection::SUBSCRIBE;
  else {
    Serial.println("Unable parse binding: unknown direction: " + directionStr);
    valid = false;
  }

  pin = obj[JsonKeys::PIN] | (SettingsDefaults::MAX_PIN + 1);
  if (pin > SettingsDefaults::MAX_PIN) {
    Serial.println("Unable parse binding: pin should be less or equals to " +
                   String(SettingsDefaults::MAX_PIN) + ", got " + pin);
    valid = false;
  }

  topic = obj[JsonKeys::TOPIC] | "";
  if (topic.isEmpty()) {
    Serial.println("Unable parse binding: no topic defined");
    valid = false;
  }
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

Settings::Settings() : mdnsName(SettingsDefaults::MDNS_NAME), valid(false) {}

void Settings::fromJson(const String &jsonString) {
  JsonDocument doc;
  deserializeJson(doc, jsonString);

  valid = true;

  mdnsName = doc[JsonKeys::MDNS_NAME] | "";
  if (mdnsName.isEmpty()) {
    Serial.println("Unable parse settings: no MDNS name defined");
    mdnsName = SettingsDefaults::MDNS_NAME;
    valid = false;
  }

  // TODO validate type
  mqtt.fromJson(doc[JsonKeys::MQTT].as<JsonObject>());
  if (!mqtt.valid) {
    valid = false;
  }

  bindings.clear();
  // TODO validate type
  JsonArray bindingsArray = doc[JsonKeys::BINDINGS].as<JsonArray>();
  for (JsonObject bindingObj : bindingsArray) {
    Binding binding;
    binding.fromJson(bindingObj);
    bindings.push_back(binding);
    if (!binding.valid) {
      valid = false;
    }
  }
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