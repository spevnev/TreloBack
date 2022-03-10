module.exports = validate => async (req, res, next) => {
	try {
		await validate(req.body);
		next();
	} catch (e) {
		res.status(400).send(e);
	}
};