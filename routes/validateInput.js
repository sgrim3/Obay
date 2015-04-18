var validateInput = {}

var contains_non_whitespace = function(str){
    if (str) {
        return /\S/.test(str);
    } else {
        return false;
    }
}

var is_valid_price = function(val){
    // Checks that price is in dollar.cents format like x.xx
    if (!contains_non_whitespace){
        return false;
    } 
    // Regex from http://stackoverflow.com/questions/2227370/currency-validation
    var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    // var regex = /^\d+(?:\.\d{0,2})$/;
    return regex.test(val);
}

validateInput.validate_listing = function(req, res, callback){
    /*Calls callback if listings is validated, otherwise it sends 
    an error code with relevant error messages.*/
    var listing_name = req.body.listing_name;
    var listing_description = req.body.listing_description;
    var listing_image = req.body.listing_image;
    var listing_price = req.body.listing_price;
    if (!contains_non_whitespace(listing_name)) {
        res.status(400).send('Enter a non whitespace listing name!');
    } else if (!contains_non_whitespace(listing_description)) {
        res.status(400).send('Enter a non whitespace listing description!');
    } else if (!is_valid_price(listing_price)) {
        res.status(400).send('Enter a valid price! Ex 3 or 2.99');
    } else {
        callback();
    }
};

module.exports = validateInput;