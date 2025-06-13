import { ButtonLevel, createArticle, createButton, createHeader } from "./elements"

export function displayErrorPanel(
    args: {
        text: string,
        button?: {
            text: string,
            onClick: () => void
        },
    }
): Element {
    let result = createArticle({
        children: [
            createHeader({
                level: 3,
                text: args.text
            })
        ]
    });
    if (args.button) {
        result.appendChild(
            createButton({
                text: args.button.text,
                onClick: args.button.onClick,
            })
        );
    }
    return result;
}