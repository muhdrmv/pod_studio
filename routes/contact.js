let express = require('express');
let router = express.Router()
let connection = require('../db/connection');

function which_page_are_we(){
    // this function help us to activate elements of sidebar
    var filename = __filename.split('/');
    filename = filename.pop();
    var main_route = filename.split('.');
    return main_route[0];
}

function check_error(arg){

    let errors = [];
    if( arg.fullname.length < 5 || arg.fullname.length > 20 ) errors.push('Your fullname must be between 5 and 20 characters long')
    if( arg.subject.length < 10 ) errors.push('Your Subject must be greater than 10 characters long')
    if( arg.message.length < 10 ) errors.push('Your message must be greater than 10 characters long')
    console.log(errors);
    return errors;
}   


function check_email(email) {
    if (!validator.validate(email)) {
        return {
            status: false,
            error: "Entered email is invalid."
        }
    }

    let rows = connection.query(`SELECT * FROM users WHERE email = '${email}'`);

    if (rows.length > 0) {
        return {
            status: false,
            error: "This email address is already registered."
        }
    }

    return {
        status: true
    }

}

function send_activation_email(email) {

    // send email
    var transporter = nodemailer.createTransport({
        port: 587,
        host: 'uranus.pws-dns.net',
        auth: {
            user: 'test@cor-text.app',
            pass: 'ia#JUU9)E}G@'
        },
        secure: false
    });
    var mailOptions = {
        from: 'test@cor-text.app',
        to: email,
        subject: 'Activation LINK',
        text: 'Please use a device which can open HTML',
        html: `
            <h1>Please click on the below link to active your account.</h1>
            <a href='http://cor-text.app/auth/active/${result.insertId}/${rand_str}'>click me</a>
        `
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email is sent.');
        }
    });

}

router.get('/', function(req, res, next) {
    let main_route = which_page_are_we();
    res.render('contact', { main_route: main_route });
});

router.post('/', async function(req, res, next) {

    let results = { result: false, msg: [] };
    let errors = await check_error(req.body);

    if( errors.length > 0 ) errors.forEach( err => {results.msg.push(err)}) 
    else results.result = true;

    let d = new Date();

    if(results.result){ 
        console.log('here');
        let new_message = connection.query(`INSERT INTO contact_us( contact_us_fullname, contact_us_email, subject, message, contact_us_date) VALUES ('${req.body.fullname}', '${req.body.email}', '${req.body.subject}', '${req.body.message}', '${d.getTime()}' ) `);
        if ( new_message.affectedRows > 0 ) {results.result = true; console.log('here');}
        else {results.msg.push('Error in inserting'); results.result = false;}
    }
    
    console.log(results);

    res.send(results)
});

module.exports = router