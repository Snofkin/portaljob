import Jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      next("Auth Failed");
    }
    const token = await authHeader?authHeader.split(" ")[1]:null;
    try {
      const payload =  Jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: payload.userId };
      next();
    } catch (error) {
      next("Auth Failed");
    }
  };
  
  export default userAuth;