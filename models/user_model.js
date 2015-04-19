var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    userId: String,
    olinAppsInfo: Object,
    listings: [{ type: Schema.Types.ObjectId, ref: 'listing' }],
    venmoPayId: String,
    venmoUserName: String
});

module.exports.user = mongoose.model('user',userSchema);