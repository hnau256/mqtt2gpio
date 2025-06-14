export enum BindingType {
  Bool = "bool",
  Float = "float",
  Tic = "tic",
}

export enum BindingDirection {
  Subscribe = "subscribe",
  Publish = "publish",
}

export interface MqttSettings {
  address: string;
  port: number;
  user: string;
  password: string;
}

export interface Binding {
  type: BindingType;
  pin: number;
  topic: string;
  direction: BindingDirection;
}

export interface Settings {
  mdns_name: string;
  mqtt: MqttSettings;
  bindings: Binding[];
}