var request = require("request");
var imgur = require('imgur-node-api');
var path = require('path');
var fs = require('fs');
var ensureOlinAuthenticatedServer = require('./auth.js').ensureOlinAuthenticatedServer
var ensureVenmoAuthenticatedServer = require('./auth.js').ensureVenmoAuthenticatedServer

var uploadDir = __dirname + '/../public/uploaded/files';

var options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: uploadDir,
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

console.log(process.env.IMGUR_CLIENT_ID);
imgur.setClientID(process.env.IMGUR_CLIENT_ID);

var uploadImage = function(req, res){
    //upload image first saves the file locally, then uploads it to imgur, deletes, the local file, and then responds to the request with the imgur link.
    uploader.post(req, res, function(response) {
        var image_name = response.files[0].name;
        var saved_image_path = path.join(uploadDir, image_name);
        imgur.upload(saved_image_path, function (err, imgur_res) {
            console.log('imgur callback called!')
            if (err) {
                console.log(err);
                res.status(503).send('Imgur api not available!');
                fs.unlink(saved_image_path, function (err) {
                  if (err) throw err;
                });
            } else {
                res.send(imgur_res.data.link);
                fs.unlink(saved_image_path, function (err) {
                  if (err) throw err;
                });
            }
        });
    });
}

module.exports.uploadImage = uploadImage;
