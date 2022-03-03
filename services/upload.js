const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: "trelo",
	api_key: "542497378556888",
	api_secret: "wyP8YLvIesBvWi3IOW2pGbR9q_o",
	secure: true,
});

module.exports = (data, public_id) => new Promise((resolve, reject) => {
	cloudinary.v2.uploader.upload(data, {public_id, resource_type: "auto", quality: 50}, (err, res) => {
		if (err) reject(err);
		resolve(res);
	});
});