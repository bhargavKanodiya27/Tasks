const cloudinary = require('cloudinary').v2;
const imageUpload = async (base64url, type) => {
  let uploadedResponse;
  try {
    const filestr = base64url;

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    uploadedResponse = await cloudinary.uploader.upload(filestr, {
      upload_preset: type === 'product' ? 'nakcdjww' : 'kl9hbmgj',
    });
    console.log('This is uploaded response', uploadedResponse);
  } catch (e) {
    console.log('This is error messaage', e);
  }

  return type === 'product'
    ? uploadedResponse.eager[0].secure_url
    : uploadedResponse.secure_url;
};
module.exports = {
  imageUpload,
};
