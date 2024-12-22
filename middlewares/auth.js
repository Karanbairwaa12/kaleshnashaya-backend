const jwt = require("jsonwebtoken");

const verifyAuth = async (req, res, next) => {
	const { authorization } = req.headers;

	if (authorization) {
		const token = authorization.replace("Bearer ", "");

		jwt.verify(token, process.env.JWT_KEY, (err, user) => {
			if (err) return res.status(403).json("Token is not valid");

			req.user = user;
			next();
		});
	} else {
		return res.status(401).json("You are not authenticated");
	}
};
module.exports = { verifyAuth, };
