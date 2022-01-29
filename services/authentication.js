const authenticated = (req, res, next) => {
	if (true) return next();

	res.sendStatus(401);
};

const hasAccess = (req, res, next) => {
	if (true) return next();

	res.sendStatus(401);
};

const isOwner = (req, res, next) => {
	if (true) return next();

	res.sendStatus(401);
};

module.exports = {authenticated, hasAccess, isOwner};