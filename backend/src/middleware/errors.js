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
  let status = error.status;
  let code = error.code || "REQUEST_FAILED";
  let message = error.message;
  if (error.code === "LIMIT_FILE_SIZE") {
    status = 413;
    code = "IMAGE_TOO_LARGE";
    message = "La imagen supera 5 MB.";
  } else if (error.code?.startsWith("LIMIT_")) {
    status = 400;
    code = "INVALID_UPLOAD";
    message = "La carga contiene archivos o campos no permitidos.";
  } else if (error.type === "entity.parse.failed") {
    status = 400;
    code = "INVALID_JSON";
    message = "El contenido JSON no es válido.";
  } else if (!status && ["23505", "40001", "40P01"].includes(error.code)) {
    status = 409;
    code = "CONFLICT";
    message = "La operación entra en conflicto con los datos actuales.";
  } else if (!status && ["23503", "22P02"].includes(error.code)) {
    status = 400;
    code = "INVALID_REFERENCE";
    message = "Referencia o formato no válido.";
  }
  if (!status) status = 500;
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
      code: status >= 500 ? "INTERNAL_ERROR" : code,
      message: status >= 500 ? "No se pudo completar la operación." : message,
      ...(error.fields ? { fields: error.fields } : {}),
      requestId: request.requestId,
    },
  });
}
