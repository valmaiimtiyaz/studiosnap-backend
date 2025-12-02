const app = require("./app"); 

app.use((err, req, res, next) => {
  console.error(err.stack); 
  if (res.headersSent) {
    return next(err);
  } 
  res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal Server Error. Check server logs.",
  });
});

module.exports = app;
