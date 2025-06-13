import { ImmortalLifeScope } from "./utils/lifeScope"
import { displayActiveOrInactive } from "./ui/activeOrInactive/displayActiveOrInactive"
import { Repository } from "./repository/repository"
import { FetchRepository } from "./repository/fetchRepository"
import { MockRepository } from "./repository/mockRepository"
import { isDebug } from "./utils/is_debug"
import { SwitchRepository } from "./repository/switchRepository"
import { displayApp } from "./ui/displayApp"

document.addEventListener("DOMContentLoaded", () => {
    let repository: SwitchRepository = new SwitchRepository();
    let app = displayApp({
        lifeScope: ImmortalLifeScope,
        repository: repository,
        repositoryTypeSwitcher: repository,
    });
    let main = document.createElement("main")
    main.classList.add("container")
    main.appendChild(app);
    document.body.appendChild(main);
});

