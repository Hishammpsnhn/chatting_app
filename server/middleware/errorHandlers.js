const notfound = (req, res, next) => {
  const error = new Error(`not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};
const errorhandler = (err, req, res, next) => {
  const statusconde = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusconde);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = {errorhandler,notfound};