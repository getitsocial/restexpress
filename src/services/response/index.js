export const errorHandler = (res, code, message) => {
    res.status(code).send(res.__(message))
}