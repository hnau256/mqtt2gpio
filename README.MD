# mqtt2gpio

Firmware for ESP32 that enables integration of devices into MQTT-based smart home systems without programming. Configuration is done via a web interface, allowing binding of MQTT topics to ESP32 pins (input/output) and setting up connection parameters. Ideal for controlling relays, buttons, and other devices with boolean states (LOW/HIGH, true/false).

## Features
- Bind MQTT topics to ESP32 pins through a web interface.
- Support for boolean values: LOW/HIGH on pins, true/false in topics.
- Configure MQTT broker (address, port, login, password, client_id).
- Automatic Wi-Fi setup using WiFiManager.
- Access the web interface via mDNS (mqtt2gpio.local).
- Support for data direction: subscription (input) or publication (output).

## Requirements
- ESP32 microcontroller (any model with Wi-Fi support).
- [PlatformIO](https://platformio.org/) installed for building and flashing.
- Access to an MQTT broker (e.g., Mosquitto).
- Wi-Fi network for device connectivity.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hnau256/mqtt2gpio.git
   ```

2. **Install PlatformIO**:
   Ensure PlatformIO is installed in your development environment (see [instructions](https://platformio.org/install)).

3. **Flash the device**:
   In the root directory of the repository, run:
   ```bash
   pio run -t upload
   ```

4. **Connect to Wi-Fi**:
   - On first boot, the ESP32 creates an access point named `mqtt2gpio_ap`.
   - Connect to this access point from any device (phone, laptop).
   - Select your home Wi-Fi network and enter the password.

5. **Configure the device**:
   - After connecting to Wi-Fi, open a browser and navigate to `mqtt2gpio.local`.
   - In the web interface, configure:
     - MQTT broker settings (address, port, login, password, client_id).
     - Bindings: select pin, data type (currently only boolean), topic, and direction (subscription/publication).
   - Save the settings. The device will reboot and connect to the MQTT broker.

## Usage
- After configuration, the device automatically connects to the MQTT broker.
- Pins set for subscription respond to messages in specified topics (true → HIGH, false → LOW).
- Pins set for publication send their state (HIGH → true, LOW → false) to specified topics.

## Limitations
- Currently supports only boolean values (true/false for topics, LOW/HIGH for pins).
- Other data types (float, tic) are under development.