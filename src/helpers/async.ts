export const asyncTry = <T>(promise: Promise<T>) =>
  promise.then((data) => [null, data] as [Error, T]).catch((error) => [error] as [Error])
