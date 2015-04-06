var validateInput = {}

var contains_non_whitespace = function(str){
    if (str) {
        return /\S/.test(str);
    } else {
        return false;
    }
}

var is_valid_price = function(val){
    //checks that price is in dollar.cents format like x.xx
    if (!contains_non_whitespace){
        return false;
    } 
    //regex from http://stackoverflow.com/questions/2227370/currency-validation
    var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    //var regex = /^\d+(?:\.\d{0,2})$/;
    return regex.test(val);
}

validateInput.validate_listing = function(req, res, callback){
    //calls callback if listings is validated, otherwise it sends a error code with relevant error messages
    var item_name = req.body.item_name;
    var item_description = req.body.item_description;
    var item_image = req.body.item_image;
    var item_price = req.body.item_price;
    if (!contains_non_whitespace(item_name)) {
        res.status(400).send('Enter a non whitespace item name!');
    } else if (!contains_non_whitespace(item_description)) {
        res.status(400).send('Enter a non whitespace item description!');
    } else if (!is_valid_price(item_price)) {
        res.status(400).send('Enter a valid price! Ex 3 or 2.99');
    } else {
        callback();
    }
};

module.exports = validateInput;
