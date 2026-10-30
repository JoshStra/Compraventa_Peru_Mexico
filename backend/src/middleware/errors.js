export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    Object.assign(this, { status, code, fields });
  }
}
export const fail = (status, code, message, fields) => {
  throw new HttpError(status, code, message, fields);
};
export function handleError(error, request, response, next) {
  if (response.headersSent) return next(error);
  const status =
    error.status ||
    (error.code === "23505" || error.code === "40001" || error.code === "40P01"
      ? 409
      : error.code === "23503" || error.code === "22P02"
        ? 400
        : 500);
  if (status >= 500)
    console.error(
      JSON.stringify({
        event: "request_failed",
        requestId: request.requestId,
        code: error.code || "INTERNAL_ERROR",
      }),
    );
  response.status(status).json({
    error: {
      code: status === 500 ? "INTERNAL_ERROR" : error.code || "REQUEST_FAILED",
      message:
        status === 500
          ? "No se pudo completar la operación."
          : status === 409 && !error.status
            ? "La operación entra en conflicto con los datos actuales."
            : status === 400 && !error.status
              ? "Referencia o formato no válido."
              : error.message,
      ...(error.fields ? { fields: error.fields } : {}),
      requestId: request.requestId,
    },
  });
}
