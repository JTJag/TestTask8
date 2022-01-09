module.exports = (req, res, next) => {
  switch (req.method) {
    case "GET":
      res.status(404).redirect("/404.html");
      break;
    default:
      res.status(404).json({
        status: "error",
        errors: [
          {
            error: "PAGE_NOT_FOUND",
            msg: "Страница не найдена",
          },
        ],
      });
      break;
  }
};
