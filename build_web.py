import os
import subprocess

is_debug = False

def read_file(name: str) -> str:
    file = open(name, 'r', encoding='utf-8')
    result = file.read()
    file.close()
    return result

def write_file(name: str,content: str):
    file = open(name, 'w', encoding='utf-8')
    file.write(content)
    file.close()

def build_index_html_content(
        web_dir: str,
) -> str:
    generated_dir = web_dir + "generated/"
    os.makedirs(generated_dir, exist_ok=True)
    index_html_file = generated_dir + "index.html"
    src_dir = web_dir + "src/"
    js_dir = web_dir + "js/"
    style_css_file = src_dir + "style.css"
    index_template_html_file = src_dir + "index_template.html"

    def build_is_debug_ts_file(
            js_dir: str,
    ):
        is_debug_ts_file = js_dir + "src/utils/is_debug.ts"
        is_debug_ts_value = "true" if is_debug else "false"
        is_debug_ts_content = f"//This file is autogenerated\nexport let isDebug = {is_debug_ts_value}"
        write_file(is_debug_ts_file, is_debug_ts_content)
        
    build_is_debug_ts_file(
        js_dir = js_dir,
    )
    
    def build_main_js_file(
            js_dir: str,
    ) -> str:
        generated_dir = js_dir + "generated/"
        os.makedirs(generated_dir, exist_ok=True)
        main_js_file_name = "main.js"
        main_js_file = generated_dir + main_js_file_name

        subprocess.run(
            args=["npx", "webpack"],
            cwd=js_dir,
            check=True,
        )

        subprocess.run(
            args=[
                'terser', 
                main_js_file_name, 
                "-o", main_js_file_name, 
                "--compress", "--mangle",  "--rename",  "--toplevel"
            ],
            cwd=generated_dir,
            check=True,
        )

        return main_js_file
    
    main_js_file = build_main_js_file(
        js_dir = js_dir
    )

    injects = {
        "main.js": main_js_file,
        "style.css": style_css_file,
    }

    index_html_content = read_file(index_template_html_file)
    for key, filename in injects.items():
        content = read_file(filename)
        index_html_content = index_html_content.replace(f"<inject>{key}</inject>", content)

    write_file(index_html_file, index_html_content)
    return index_html_content

def fill_index_html_hpp(
        generated_dir: str,
        index_html_content: str,
):
    os.makedirs(generated_dir, exist_ok=True)
    hpp_key = "index_html"
    hpp_file = generated_dir + "/index_html.hpp"

    hpp_file_content = f"""#ifndef {hpp_key}_hpp
#define {hpp_key}_hpp
#include <pgmspace.h>

const char {hpp_key}[] PROGMEM = R"rawLiteral({index_html_content})rawLiteral";

#endif //{hpp_key}_hpp"""

    write_file(hpp_file, hpp_file_content)


src_dir = "src/"
index_html_content = build_index_html_content(
    web_dir=src_dir + "web/"
)
fill_index_html_hpp(
    generated_dir=src_dir + "generated/",
    index_html_content = index_html_content,
)