import { ButtonLevel, createArticle, createButton, createHeader } from "./elements"

export function displayErrorPanel(
        text: string,
        button?: {
            text: string,
            onClick: () => void
        },
): Element {
    let result = createArticle(
        [
            createHeader(3, text)
        ]
    );
    if (button) {
        result.appendChild(
            createButton(
                button.text,
                button.onClick,
            )
        );
    }
    return result;
}