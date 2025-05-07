const wrapAsync = (func) => {
  return async (req, res, next) => {
    await func(req, res, next).catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message || 'Internal Server Error' });
    });
  }
};

export default wrapAsync;
  