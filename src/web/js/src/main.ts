import { ImmortalLifeScope } from "./utils/lifeScope"
import { displayApp } from "./ui/displayApp"
import { Repository } from "./data/repository";

document.addEventListener("DOMContentLoaded", () => {
    let repository = new Repository()
    let app = displayApp(
        ImmortalLifeScope,
        repository,
    );
    let main = document.createElement("main")
    main.classList.add("container")
    main.appendChild(app);
    document.body.appendChild(main);
});

