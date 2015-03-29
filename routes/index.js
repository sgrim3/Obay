var path = require('path');

function home (req, res) {
	res.sendFile(path.join(__dirname, '../', 'index.html'));
}

module.exports.home = home;