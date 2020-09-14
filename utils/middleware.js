const errorHandler = (errors, req, res, next) => {
  console.log("ERRORS", errors.message);
  if (Array.isArray(errors)) {
    let error = errors.map((err) => err.message);
    res.send(error);
    next(errors);
  }

  return res.status(404).json({ message: errors.message });
};

module.exports = {
  errorHandler,
};
