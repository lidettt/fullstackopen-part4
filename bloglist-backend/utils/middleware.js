const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method : ", request.method);
  logger.info("Path : ", request.path);
  logger.info("Body : ", request.body);
  logger.info("---");
  next();
};
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "Cast Error") {
    response.status(400).send({ error: "malformatted id " });
  } else if (error.name === "Validation Error") {
    response.status(400).send({ error: error.message });
  }
  next(error);
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
