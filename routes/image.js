var request = require("request");
var imgur = require('imgur');
imgur.setClientId(process.env.IMGUR_CLIENT_ID);
var fs = require('fs');
var multer = require('multer');

var upload_dir = __dirname + '/../public/uploads';
var multer_options = {
    limits: { fileSize: 5 * 1024 * 1024 },//5MB fileSize limit
    dest: upload_dir,
}
var uploadMiddleware = multer(multer_options);

var uploadImage = function(req, res){
    //upload image first saves the file locally, then uploads it to imgur, deletes the local file, and then responds to the request with the imgur link. 
    var saved_img_path = req.files.file.path;
    var filetype = req.files.file.mimetype;
    if (filetype !== 'image/png' && filetype !== 'image/jpg' && filetype !== 'image/jpeg' && filetype !== 'image/gif') {
        res.status(400).send('Please upload a .png, .jpg, or .gif!');
        fs.unlink(saved_img_path);
    } else {
        if (req.files.file.truncated){
            //if upload was stopped for being too big, delete the image.
            res.status(400).send('File too large! Please keep it smaller than 5 MB!');
            fs.unlink(saved_img_path);
        } else {
            console.log('uploading to imgur!');
            console.log('hello');
            imgur.uploadFile(saved_img_path)
                .then(function (imgur_res){
                    res.send(imgur_res.data.link);
                    fs.unlink(saved_img_path);
                })
                .catch(function (err){
                    res.status(400).send(JSON.parse(err));
                    fs.unlink(saved_img_path);
                });
        }
    }
}

module.exports.uploadMiddleware = uploadMiddleware;
module.exports.uploadImage = uploadImage;
