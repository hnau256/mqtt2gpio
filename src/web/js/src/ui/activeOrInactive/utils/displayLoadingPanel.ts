import { createArticle, createText, setIsLoading } from "./elements"

export function displayLoadingPanel(
    args: {
        text: string,
    }
): Element {
    let result = createArticle({
        children: [
            createText({
                text: args.text
            })
        ],
    });
    setIsLoading({
        element: result,
        isLoading: true,
    })
    return result
}