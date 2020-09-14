const auth = (request, _, next) => {
  const authorization = request.get("authorization");
  if (!authorization) {
    throw new Error("You need to be logged to create Survey");
  }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  return next();
};

module.exports = auth;
