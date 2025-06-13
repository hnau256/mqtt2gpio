export function displayActive(
    args: {
        switchToInactive: () => void,
    }
): Element {
    let result = document.createElement("button");
    result.textContent = "Switch to inactive";
    result.onclick = args.switchToInactive;
    return result;
}