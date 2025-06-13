import os

def inject_source(
        filename: str,
):
    hpp_key = filename.replace(".", "_")
    with open(filename, 'r', encoding='utf-8') as source:
        source = f"""#ifndef {hpp_key}_hpp
        #define {hpp_key}_hpp

        #include <pgmspace.h>

        const char {hpp_key}[] PROGMEM = R"rawliteral(
        {source.read()}
        )rawliteral";

        #endif //{hpp_key}_hpp
        """
        with open(hpp_key + ".hpp", 'w', encoding='utf-8') as header_file:
            header_file.write(source)

if __name__ == "__main__":
    print("QWERTY!!!!")
    inject_source("index.html")
    inject_source("not_found.html")
