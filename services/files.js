const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.IMG_NAME,
	api_key: process.env.IMG_KEY,
	api_secret: process.env.IMG_SECRET,
	secure: true,
});

const upload = (data, public_id) => new Promise((resolve, reject) => {
	cloudinary.v2.uploader.upload(`data:image/png;base64,${data}`, {public_id, resource_type: "auto"}, (err, res) => {
		if (err) reject(err);
		resolve(res);
	});
});

const get = public_id => cloudinary.image(public_id + ".png");

module.exports = {upload, get};