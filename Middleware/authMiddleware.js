const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, "vishnu123");
    req.user = decoded.user;
    //console.log(decoded)
   
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
}


const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
      const currentUser = req.user;

      if (!allowedRoles.includes(currentUser.role)) {
          return res.status(403).json({ message: "Access forbidden for your role." });
      }

      next();
  };
};


module.exports = verifyToken;
