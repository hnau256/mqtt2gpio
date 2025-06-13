import { createArticle, createText, setIsLoading } from "./elements"

export function displayLoadingPanel(
        text: string,
): Element {
    let result = createArticle(
        [
            createText(text)
        ],
    );
    setIsLoading(result, true)
    return result
}