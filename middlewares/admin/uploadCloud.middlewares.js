const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});
// End cloudinary


let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream  = cloudinary.uploader.upload_stream((error, result) =>{
            if(result){
                resolve(result);
            }
            else{
                reject(error);
            }
        });

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const uploadToCloudinary = async (buffer) => {
    let result = await streamUpload(buffer);
    return result.url;
}

module.exports.upload = async (req, res, next) => {
    if(req.file){
        const result = await uploadToCloudinary(req.file.buffer);

        req.body[req.file.fieldname] = result;
    }
    next();
};


