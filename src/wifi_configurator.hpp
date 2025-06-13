#ifndef wifi_configurator_hpp
#define wifi_configurator_hpp

class WifiConfigurator{
private:
    bool connected;
public:
    WifiConfigurator();
    void connect();
    bool isConnected();
};

#endif //wifi_configurator_hpp


