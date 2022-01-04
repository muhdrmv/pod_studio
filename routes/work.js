let express = require('express');
let router = express.Router()


function which_page_are_we(){
    // this function help us to activate elements of sidebar
    var filename = __filename.split('/');
    filename = filename.pop();
    var main_route = filename.split('.');
    return main_route[0];
}

router.get('/', function(req, res, next) {
    let main_route = which_page_are_we();
    res.render('work', { main_route: main_route });
});

module.exports = router