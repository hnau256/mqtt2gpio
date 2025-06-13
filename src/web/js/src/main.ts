import { ImmortalLifeScope } from "./utils/lifeScope"
import { displayApp } from "./ui/displayApp"

document.addEventListener("DOMContentLoaded", () => {
    let app = displayApp(
        ImmortalLifeScope,
    );
    let main = document.createElement("main")
    main.classList.add("container")
    main.appendChild(app);
    document.body.appendChild(main);
});

