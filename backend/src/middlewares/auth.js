const authMiddleware = (adminAccess) => {
  return (req, res, next) => {
    if (req.session?.user?.user_id) {
      req.user = req.session.user;
      // Verify role
      if (adminAccess && req.user.role !== "ADMIN") {
        return res.status(403).json({
          error: "Forbidden",
        });
      }

      next();
    } else {
      res.status(401).json({
        error: "Unauthorized",
      });
    }
  };
};

export default authMiddleware;
