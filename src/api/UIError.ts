interface UIError {
    message: string;
    error: Error;
}


function createUIError(message: string, error?: Error): UIError {
    return {
        message,
        error
    };
}

export {createUIError, UIError};
