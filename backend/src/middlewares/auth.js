const authMiddleware = (req, res, next) => {
  if (req.session?.user?.user_id) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export default authMiddleware;
