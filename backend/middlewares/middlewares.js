const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../service/userService');

exports.isUserLogged = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json('NOT AUTHORIZED');
  }

  try {
    const [bearer, tokenn] = token.split(" ");
    const decodedToken = jwt.verify(tokenn, 'JHJKKJHKijjh89HGFjgb');
    const { username } = decodedToken.data;
    console.log(decodedToken);

    const user = await getUserByUsername(username);

    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json('NOT AUTHORIZED');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
