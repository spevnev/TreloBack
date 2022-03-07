module.exports = validate => (req, res, next) => {
	validate(req.body)
		.then(() => next())
		.catch(e => res.status(400).send(e));
};