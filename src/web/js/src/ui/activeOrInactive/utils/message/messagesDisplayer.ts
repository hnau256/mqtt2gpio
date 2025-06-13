export interface MessageDisplayer {

    displayMessage(
        args: {
            message: string,
        }
    ): void
}