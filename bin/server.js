var config = require('./config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var url = require('url');
var multer = require('multer');
var fs = require('fs');
//var jwt = require('jsonwebtoken');
//var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');

//var index = require('./routes/index');
//var users = require('./routes/users');

function supportCrossOriginScript(req, res, next) {
    res.status(200);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
}

var app = express();
//initialize config variables
//var jwtsecret = config.app.jwtsecret;
var viewpath = config.app.views; // setting webui tree location.
var securedpath = config.app.securedpath;
console.log('--------------------->' + securedpath);
// view engine setup
//app.engine('.html', require('ejs').renderFile);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.app.views)));

//app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
/*
 app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });
 */
/*
 // error handler
 app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};
 
 // render the error page
 res.status(err.status || 500);
 res.render('error');
 });
 */

app.get('/', function (req, res) {
    //res.sendFile(__dirname + "/index.html");
    //res.send('Index page');
    res.sendStatus(200);
});

app.get('/file/:name', function (req, res, next) {

    var options = {
        root: __dirname + '/' + config.app.views + '/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

});


//var connection = mysql.createConnection({
//    host: config.db.host,
//    user: config.db.user,
//    password: config.db.password,
//    database: config.db.database,
//    multipleStatements: true
//});
//
//function DBConnectionTry(req, res, next) {
//    connection.connect(function (error) {
//        if (error) {
////            connection.release();
//            console.log("Failed! Connection with Database spicnspan without pool failed");
//            DBConnectionTry();
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan without pool succeeded");
//        }
//    });
//}
//DBConnectionTry();

//var connection = mysql.createConnection({
//    host: config.db.host,
//    user: config.db.user,
//    password: config.db.password,
//    database: config.db.database,
//    multipleStatements: true
//});
//
//function DBConnectionTry(req, res, next) {
//    connection.connect(function (error) {
//        if (error) {
////            connection.release();
//            console.log("Failed! Connection with Database spicnspan without pool failed");
////            DBConnectionTry();
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan without pool succeeded");
//        }
//    });
//}
//DBConnectionTry();


var pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
    connectionLimit: 250,
    queueLimit: 0,
    debug: true
});
function DBPoolConnectionTry2(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log("Failed! Connection with Database spicnspan via connection pool failed");

        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
        }
    });
}
function DBPoolConnectionTry(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
            DBPoolConnectionTry2();
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
        }
    });
}
DBPoolConnectionTry();



//BEGIN - rest resource end points definition ******************************************************************
/*****************firstname***************/
/*
 app.get('/firstnamex', function (req, res) {
 res.header("Access-Control-Allow-Origin", "*");
 pool.query("SELECT * from employee", function (err, rows) {
 if (err){
 console.log("Problem with MySQL" + err);
 }
 else{
 res.end(JSON.stringify(rows));
 }
 });
 });
 
 app.get('/lastnamex', function (req, res) {
 res.header("Access-Control-Allow-Origin", "*");
 var user_query = 'SELECT EmployeeKey, LastName from employee';
 
 pool.getConnection(function(err, connectionx) {
 if (err) {
 connectionx.release();
 res.json({ "code": 100, "status": "Error in establishing database connection" });
 return;
 }
 
 connectionx.query(user_query, function(err, rows, fields, next) {
 if (err) next(err);
 //if (err) console.log(err.message);    return;
 
 if (rows.length == 0) {
 console.log("No device token found for user: " + 16182);
 res.json({ "code": 100, "status": "No data returned from database" });
 //callback(null, null);
 } else {
 res.end(JSON.stringify(rows));
 }
 }
 )});
 });
 */
//END - rest resource end points definition ********************************************************************

/*************START MIGRATE CODE**********************************************************/
var user_return = '';
var pass_return = '';
var employeekey_return = '';
var isSupervisor = '';
var organization = '';
var organizationID = '';
app.options('/authenticate', supportCrossOriginScript);

app.post('/authenticate', supportCrossOriginScript, function (req, res) {

    //var userid = url.parse(req.url, true).query['uname'];
    var userid = req.body.uname;
    // console.log("inside server username= " + userid);
    //var password = url.parse(req.url, true).query['pwd'];
    var password = req.body.pwd;
    var tenantId = req.body.tid;
    // console.log("inside server password= " + password);
    var profile = {};
//     var encr_pass = md5(pwd);
//      console.log("inside server password= " + encr_pass);

    //var id_return = '';
    //pool.query("SELECT * from login where username='" + u_name + "' and password='" + pwdd + "' ", [u_name, pwdd], function (err, employees)
//   DBConnectionTry();
    DBPoolConnectionTry();
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @u_name=?;set @pwdd=?; set @tenantId=?; call usp_userLogin(@u_name,@pwdd,@tenantId)", [userid, password, tenantId], function (err, employees)
            {
                if (err) {
                    console.log("INSIDE errr() condition in /authenticate " + JSON.stringify(err));
                }
                console.log("entire response  " + JSON.stringify(employees));
//        console.log("userid "+userid+" password "+password+" tenantid"+tenantid);
//        console.log("DEMANDED VALUES GOT " + JSON.stringify(employees[2][0]));
//        console.log("Inside server " + JSON.stringify(employees[2][0]));
                if (!employees[3][0]) {// if returns a void json like '[]'
// 
                    res.status(401).send('Wrong user or password');
                    // console.log('Wrong user or password');
                    return;
                } else {
                    console.log('Employee : ' + employees[3][0]["UserName"]);

                    user_return = employees[3][0]["UserId"];
                    organization = employees[3][0]["OrganizationName"];
//            pass_return = employees[2][0]["Password"];
                    username_return = employees[3][0]["UserName"];
                    role_return = employees[3][0]["UserRole"];
//            id_return = employees[2][0]["Idlogin"];
                    employeekey_return = employees[3][0]["EmployeeKey"];
                    isSupervisor = employees[3][0]["IsSupervisor"];
            organizationID = employees[3][0]["OrganizationID"];


                    // console.log('Employee key again : ' + employeekey_return);
                    // console.log('Employee name again : ' + user_return);
                    // console.log('Employee role again : ' + role_return);
                    // console.log('Employee username again : ' + username_return);
                    // console.log('IsSupervisor: ' + isSupervisor);
//            profile={
//                
//            }
//             var token = jwt.sign(user_return,pass_return,secret, {expiresInMinutes: 60 * 5});

//        res.json({token: token});
//        console.log(token);
                    profile = {
                        user: user_return,
                        username: username_return,
                        role: role_return,
                        employeekey: employeekey_return,
//            password: pass_return,
                        IsSupervisor: isSupervisor,
                        Organization: organization,
                        OrganizationID: organizationID
                    };
                }
                // We are sending the profile inside the token
//                var jwttoken = jwt.sign(profile, jwtsecret, {expiresIn: '4h'});
////                var jwttoken = jwt.sign(profile, jwtsecret, {expiresIn: '60000'});
//                res.cookie('refresh-token', jwttoken, 'httpOnly', 'secure')   //, 'secure','httpOnly')  '1h' //use for https
//                        .json({token: jwttoken});
//                console.log("jwttoken" + jwttoken);
            });
        }
        connection.release();
    });
});

// app.all('/*', function (req, res, next) {
// // CORS headers
//     response.addHeader("Access-Control-Allow-Origin", "*");
//     res.addHeader("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// // Set custom headers for CORS
//     res.header('Access-Control-Allow-Headers', 'Authorization,Content-type,Accept,X-Access-Token,X-Key');

//     if (req.method === 'OPTIONS') {
//         res.status(200).end();
//     } else {
//         next();
//     }
// });
// We are going to protect /api routes and hookup with jwtCheck


//method to verify jwt token. all secured path will pass thru here
function jwtCheck(req, res, next) {
    var token = '';
    var accesstoken = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['x-auth-token'] || req.headers['authorization'];
    var refreshtoken = req.cookies['refresh-token'];
    //var refreshtoken = req.headers['cookie']; //also an option, but have to extract specific cookie from all cookies. comes in name:value pairs.
//    console.log('headers<=>' + accesstoken); //req.headers['cookie']);
//    console.log('for token verification -- cookies<=>' + refreshtoken); //req.cookies['access-token']);
    //jwttoken = '';
    if (refreshtoken) {
        token = refreshtoken;
//        console.log("got valid refresh token "+token);
    } else {
        token = accesstoken;
//        console.log("got access token as "+token);
    }
    console.log("Verifying received token " + token);
    jwt.verify(token, jwtsecret, function (err, decoded) {
        if (err) {
            console.log(err);
            return res.json({success: false, message: 'Failed to authenticate token.'});
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
//            console.log('decoded------->' + JSON.stringify(decoded));
//            console.log('iat:' + new Date(1482535287));
//            console.log('exat:' + new Date(1482553287));
            //return res.json({ success: true, message: 'Authenticated successfully.' });    
            next();
        }
    });
}

//app.use(securedpath, jwtCheck);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use('/', express.static(__dirname + '/'));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'invalid token.');
    }
//  else
//      callRestricted();
});
// *********************code for form uploads-web starts **********************
//var multerUploadPath_photo = './webui/pho1';// use ../webui/uploads for cloud.
var locationinTable = 'pho1/';
//if (config.db.host === 'us-cdbr-azure-west-b.cleardb.com') {
//    var locationinTable = 'pho1/';
//} else { 
//    var locationinTable = 'pho1/';
//}

//var multerUploadPath = './webui/uploads';// use ../webui/uploads for cloud.
var multerUploadPath = '';
var storage = multer.diskStorage({
    // use ./ inlocal and ../ in azure
    destination: function (req, file, callback) {
        if (url.parse(req.url, true).query['formtypeId']) {
            multerUploadPath = '../webui/uploads';
        } else if (url.parse(req.url, true).query['Workorderkey']) {
            multerUploadPath = '../webui/pho1';
        }
        callback(null, multerUploadPath);
    },
    filename: function (req, file, callback) {
        if (url.parse(req.url, true).query['formtypeId']) {
            var formtypeId = url.parse(req.url, true).query['formtypeId'];
            var formDesc = url.parse(req.url, true).query['formDesc'];
            var empkey = url.parse(req.url, true).query['empkey'];
             var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//            var datetimestamp = Date.now();
//            var filename = datetimestamp + '.' + file.originalname;
            var filename = file.originalname;
//            var emp = '100';
            console.log(" SSSSSSSSSSSSSSSSSS fid fdesc fname are  " + formtypeId + " " + formDesc + " " + filename + " " + multerUploadPath);
            callback(null, file.originalname);

            pool.getConnection(function (err, connection) {
                if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @formtypeId=?;set @empkey=?;set @fileName=?;set @formDesc=?; set @OrganizationID=?; call usp_uploadFormFile(@formtypeId,@empkey,@fileName,@formDesc,@OrganizationID)', [formtypeId, empkey, filename, formDesc,OrganizationID], function (err)
            {
                if (err)
                    console.log("my error" + err);
            });
        }
                connection.release();
            });
        }
        else if (url.parse(req.url, true).query['Workorderkey']) {
            console.log("VVVVVVVVVVVVVVVV inside storage_WOPhoto XXXXXXXXXXXXXXXXXXXXXXXXX" + multerUploadPath);
//            var datetimestamp = Date.now();
//            var filename = datetimestamp + '.' + file.originalname;
            var filename = file.originalname;
            var wdkey = url.parse(req.url, true).query['Workorderkey'];
            var employeekey = url.parse(req.url, true).query['EmployeeKey'];
//            var newPath = "" + locationinTable;
//            newPath = newPath + filename;
            var newPath = filename;
            callback(null, filename);
            console.log("pho " + filename + " wdkey " + wdkey + " employeekey " + employeekey);
            console.log("path " + newPath);
            pool.getConnection(function (err, connection) {
                if (err) {

                    console.log("Failed! Connection with Database spicnspan via connection pool failed");
                }
                else {
                    console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                    connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey)", [wdkey, newPath, employeekey], function (err)
                    {
                        if (err)
                            console.log("my error" + err);
                    });
                }
                connection.release();
            });

        }
    }


});


var upload = multer({storage: storage}).single('file');
//  UPLOADING FORM FORM MANAGER req holds formid, description and file
// IMPORTANT THE API NAME '/upload' is important , dont change.
app.options('/upload', supportCrossOriginScript);
app.post(securedpath + '/upload', function (req, res) {


    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    })
});

// *********************code for form uploads-web ends **********************




// *********************code for photo uploads-web starts **********************



app.options('/upload_wo_photo', supportCrossOriginScript);
app.post(securedpath + '/upload_wo_photo', function (req, res) {

    console.log("really inside upload_wo_photo XXXXXXXXXXXXXXXXXXXXXXXXX");
    upload_WOphoto(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
var upload_WOphoto = multer({storage: storage_WOPhoto}).single('file');

// var multerUploadPath_photo = '../webui/pho1';// use ../webui/uploads for cloud.
//var locationinTable = 'webui/pho1/';
var storage_WOPhoto = multer.diskStorage({
    // use ./ inlocal and ../ in azure
    destination: function (req, file, callback) {
        callback(null, '../webui/pho1');
    },
    filename: function (req, file, callback) {
        console.log("TRYING DB INSERTION");
//        var datetimestamp = Date.now();
        var filename = file.originalname;

        var wdkey = url.parse(req.url, true).query['Workorderkey'];
        var employeekey = url.parse(req.url, true).query['EmployeeKey'];
//        var newPath = "" + locationinTable;
//        newPath = newPath + filename;
        var newPath = filename;
        console.log("pho" + filename + " wdkey " + wdkey + " employeekey " + employeekey);
        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            }
            else {
                console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey)", [wdkey, newPath, employeekey], function (err, rows)
                {
                    if (err)
                        console.log("my error" + err);
                });
            }
            connection.release();
        });
        callback(null, file.originalname);
    }


});
// *********************code for photo uploads-web ends **********************









app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post(securedpath + '/photo', function (req, res, file) {
//     var datetimestamp = Date.now();
    var fname = file.fieldname;

    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file");
        }
        res.end();
    });
});


//dropdown firstname 

app.get(securedpath + '/firstname', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getEmployee()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/fi', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getformupload()', function (err, rows)
            {
                if (err)
                    console.log("error is" + err);
                else
                    res.end(JSON.stringify(rows[0]));
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/fac', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getFacility()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    //console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

//equipment

app.get(securedpath + '/equ', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getEquipment()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    // console.log("JSON.stringify(rows)");
                    // console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
//floortype name


//ZoneName

app.get(securedpath + '/zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getZone()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    // console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

//RoomType

app.get(securedpath + '/room', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getRoom()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    // console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

//RoomId


app.get(securedpath + '/roomid', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getRoom()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    // console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});



//ShiftType


app.get(securedpath + '/empList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getEmployee()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                    //  console.log("INSIDE EMPLOYEE FETCH");
                    //  console.log(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});



//viewworkorder_Filter




//dropdown departmentname

app.get(securedpath + '/department', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_getDepartment(@empkey,@OrganizationID)",[empkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            res.end(JSON.stringify(rows[2]));
             //console.log("department" +rows)
        }
    });
    }
        connection.release();
    });
});




app.get(securedpath + '/getroomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getRoomType()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    //  console.log("RoomType......" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/roomtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];

    // console.log("Fac key for rooom" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?; call usp_getRoomTypeByFacilty(@fkey)", [fkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});//




//

app.get(securedpath + '/roomtypeByFacility_Zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var zon = url.parse(req.url, true).query['zonekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
    // console.log("Fac key for roomtypene" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zon=?;set @OrganizationID=?;call usp_getRoomTypeByFacilty_Zone(@fkey,@zon,@OrganizationID)", [fkey, zon,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});//


app.get(securedpath + '/allemployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getAllEmployee()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allequipmenttype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getAllEquipmentType()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    //   console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/equipByEquiptype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var etype = url.parse(req.url, true).query['eqtype'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("eq type key for eqtype" + etype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @etype=?;set @OrganizationID=?;call usp_getEquipmentByType(@etype,@OrganizationID)", [etype,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    //  console.log("equipByEquiptype...." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
//inspection views and necessary dropdowns are here
app.options('/addNewTemplates_Question', supportCrossOriginScript);
app.post(securedpath + '/addNewTemplates_Question', supportCrossOriginScript, function (req, res) {
    var question = url.parse(req.url, true).query['question'];
    // console.log("question" + question);
    var templateId = url.parse(req.url, true).query['TemplateID'];
    // console.log("TemplateID" + templateId);
    var ScoringTypeKey = url.parse(req.url, true).query['ScoringTypeKey'];
    // console.log("scoringkey" + ScoringTypeKey);
    var frequency = url.parse(req.url, true).query['frequency'];
    // console.log("frequency" + frequency);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateId=?;set @ScoringTypeKey=?;set @frequency=?;set @question=?; call tm_addNewTemplates_Question(@templateId,@ScoringTypeKey,@question,@frequency)', [templateId, ScoringTypeKey, question, frequency], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                res.end();
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getShiftInCharge', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var shift = url.parse(req.url, true).query['shifttype'];
    var zone = url.parse(req.url, true).query['zone'];
    var startDate = url.parse(req.url, true).query['startDate'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("for shift in charge values are " + shift + " " + zone+ " "+startDate);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shift=?;set @zone=?;set @startDate=?; set @OrganizationID=?;call usp_getShiftInCharge(@shift,@zone,@startDate,@OrganizationID)', [shift, zone, startDate,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //   console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/allInventorytype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getInventorytypes()", function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/scanforWorkorder_emp', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var ondate = url.parse(req.url, true).query['ondate'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("room barcode and  empkey is " + barcode + " " + empkey);//set @employeekey =?;call tm_workorderdetail(@employeekey)         
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @barcode =?;set @empkey =?;set @date =?; set@OrganizationID=?;call usp_workorderGetByScannedBarcode(@barcode,@empkey,@date,@OrganizationID)", [barcode, empkey, ondate,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            //   console.log("Printing rows");
            // console.log("ROWS" + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[4]));
        }
           });
        }
        connection.release();
    });

});








app.get(securedpath + '/getUniqueFloorName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getUniqueFloorName()', function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getUniqueZoneName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getUniqueZoneName()', function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getUniqueRoomTypeName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getUniqueRoomType()', function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    //  console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getUniqueRoomName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getUniqueRoomName()', function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    //  console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getEquipmentTypeName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('SELECT e.EquipmentTypeKey, e.EquipmentType FROM equipmenttype e group by e.EquipmentType', function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("getEquipmentTypeName"+JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });

});



//app.get('/getInspectionorderBY_inspectionorderDate', function (req, res) {
//    var inspectionorderDate = url.parse(req.url, true).query['inspectionorderDate'];
//
//    pool.query('set @inspectionorderDate=?;call tm_getInspectionorderBY_inspectionorderDate(@inspectionorderDate)', [inspectionorderDate], function (err, rows)
//    {
//        if (err)
//        {
//            console.log("Problem with MySQL" + err);
//        }
//        else
//        {
//            console.log("getInspectionorderBY_inspectionorderDate " + JSON.stringify(rows[1]));
//            res.end(JSON.stringify(rows[1]));
//
//        }
//    });
//});


app.get(securedpath + '/getAllEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllEquipmentName()', function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getFloorZoneByRTypeRoom', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['facility'];
    var roomtype = url.parse(req.url, true).query['roomtype'];
    var roomkey = url.parse(req.url, true).query['roomkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?;set @roomtype=?;set @roomkey=?; set@OrganizationID=?; call tm_getFloorZoneByRTypeRoom(@facility,@roomtype,@roomkey,@OrganizationID)', [facility, roomtype, roomkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("editEmp_scheduling " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));


                }
            });
        }
        connection.release();
    });


});
app.options('/workorder_creation', supportCrossOriginScript);

app.post(securedpath + '/workorder_creation', supportCrossOriginScript, function (request, response) {
    var workordertypekey = url.parse(request.url, true).query['workordertypekey'];
    // console.log("inside server wot= " + workordertypekey);
    var equipmentkey = url.parse(request.url, true).query['equipmenttypekey'];
    // console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = url.parse(request.url, true).query['roomkeys'];
    // console.log("inside server roomkey= " + roomkeys);
    var employeekey = url.parse(request.url, true).query['employeekey'];
    // console.log("inside server empkey= " + employeekey);
    var priority = url.parse(request.url, true).query['priority'];
    // console.log("inside server priority= " + priority);
    var isrecurring = url.parse(request.url, true).query['isrecurring'];
    // console.log("inside server isrecurring= " + isrecurring);
    var fromdate = url.parse(request.url, true).query['fromdate'];
    // console.log("inside server fromdate= " + fromdate);
    var todate = url.parse(request.url, true).query['todate'];
    // console.log("inside server todate= " + todate);
    var intervaltype = url.parse(request.url, true).query['intervaltype'];
    // console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = url.parse(request.url, true).query['repeatinterval'];
    // console.log("inside server repeatinterval= " + repeatinterval);
    var occurenceinstance = url.parse(request.url, true).query['occurenceinstance'];
    // console.log("inside server occurenceinstance= " + occurenceinstance);
    var occurenceday = url.parse(request.url, true).query['occurenceday'];
    // console.log("inside server occurenceday= " + occurenceday);
    var occurenceat = url.parse(request.url, true).query['occurenceat'];
    // console.log("inside server occurenceat= " + occurenceat);
    var note = url.parse(request.url, true).query['note'];
    var isbar = url.parse(request.url, true).query['isbar'];
    var isphoto = url.parse(request.url, true).query['isphoto'];
    // console.log("3 VAlues are tot=16 " + note + " " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workordertypekey=?;set @equipmentkey=?;set @roomkey=?; set @empoyeekey=?; set @priority=?;set @isrecurring=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occurenceinstance=?;set @occurenceday=?;set @occurenceat=?; set @note=?;set @isbar=?;set @isphoto=?;call tm_createworkorder(@workordertypekey,@equipmentkey,@roomkey,@empoyeekey,@priority,@isrecurring,@fromdate,@todate,@intervaltype,@repeatinterval,@occurenceinstance,@occurenceday,@occurenceat,@note,@isbar,@isphoto) ', [workordertypekey, equipmentkey, roomkeys, employeekey, priority, isrecurring, fromdate, todate, intervaltype, repeatinterval, occurenceinstance, occurenceday, occurenceat, note, isbar, isphoto], function (err, res)
            {
                if (err) {
                    console.log(err);
                }
                // console.log(JSON.stringify(res));
            });
        }
        connection.release();
    });

    response.end("sucess");

});






























//Jeffy code Starts

// app.post('/authenticate', function (req, res) {

//     var userid = url.parse(req.url, true).query['uname'];
//     console.log("inside server username= " + userid);
//     var password = url.parse(req.url, true).query['pwd'];
//     console.log("inside server password= " + password);
//     var profile = {};
// //     var encr_pass = md5(pwd);
// //      console.log("inside server password= " + encr_pass);

//     //var id_return = '';
//     //pool.query("SELECT * from login where username='" + u_name + "' and password='" + pwdd + "' ", [u_name, pwdd], function (err, employees)
//     pool.query("set @u_name=?;set @pwdd=?;call usp_userLogin(@u_name,@pwdd)", [userid, password], function (err, employees)
//     {
//         if (err) {
//             console.log(err);
//         }
//         console.log("DEMANDED VALUES GOT " + JSON.stringify(employees[2][0]));
// //        console.log("Inside server " + JSON.stringify(employees[2][0]));
//         if (!employees[2][0]) {// if returns a void json like '[]'
// // 
//             res.status(401).send('Wrong user or password');
//             console.log('Wrong user or password');
//             return;
//         } else {
// //            console.log('Employee : ' + employees[2][0]["UserName"]);

//             user_return = employees[2][0]["UserId"];
// //            pass_return = employees[2][0]["Password"];
//             username_return = employees[2][0]["UserName"];
//             role_return = employees[2][0]["UserRole"];
// //            id_return = employees[2][0]["Idlogin"];
//             employeekey_return = employees[2][0]["EmployeeKey"];
//             isSupervisor = employees[2][0]["IsSupervisor"];

//             console.log('Employee key again : ' + employeekey_return);
//             console.log('Employee name again : ' + user_return);
//             console.log('Employee role again : ' + role_return);
//             console.log('Employee username again : ' + username_return);
//             console.log('IsSupervisor: ' + isSupervisor);
// //            profile={
// //                
// //            }
// //             var token = jwt.sign(user_return,pass_return,secret, {expiresInMinutes: 60 * 5});

// //        res.json({token: token});
// //        console.log(token);
//             profile = {
//                 user: user_return,
//                 username: username_return,
//                 role: role_return,
//                 employeekey: employeekey_return,
// //            password: pass_return,
//                 IsSupervisor: isSupervisor

//             };
//         }
//         // We are sending the profile inside the token
//         var token = jwt.sign(profile,secret, {expiresInMinutes: 60 * 5});

//         res.json({token: token});
//     });
// });

app.get(securedpath + '/empSearchTable', function (req, res) {// not using now 
    res.header("Access-Control-Allow-Origin", "*");
    var domainkey = "allemployees";
//    connection.query("SELECT * from employee e where e.IsDeleted =0;", function (err, rows) {
    var empkey = url.parse(req.url, true).query['empkey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;call usp_domainValuesGet(@domainkey,@empkey)", [domainkey, empkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });

});

app.options('/removeEmployee', supportCrossOriginScript);
app.post(securedpath + '/removeEmployee', supportCrossOriginScript, function (req, res) {

    var employeeKey = url.parse(req.url, true).query['empKey'];
    var metaupdatedby = url.parse(req.url, true).query['updatedBy'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeeKey=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_employeesRem(@employeeKey,@metaupdatedby,@OrganizationID)', [employeeKey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("removeEmployee " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/meetingTraining', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    // console.log("inside server");
    var empKey = url.parse(req.url, true).query['empKey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empKey=?;set @OrganizationID=?; call usp_actionTypesGet(@empKey,@OrganizationID)",[empKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log(JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });

});


app.options('/sharedStatusButton', supportCrossOriginScript);
app.post(securedpath + '/sharedStatusButton', supportCrossOriginScript, function (req, res) {

    var employeeKey = url.parse(req.url, true).query['employeekey'];
    var data = url.parse(req.url, true).query['data'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("--------------------" + "data" + data + "employye key      " + employeeKey);
    var swich_value;
    if (data == 'true') {
        swich_value = 1;
    } else if (data == 'false') {
        swich_value = 0;
    }
    console.log("-----------AFTER---------" + "data" + swich_value + "employye key      " + employeeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeeKey=?; set @data=?;set @OrganizationID=?; call usp_sharedStatusButton(@employeeKey,@data,@OrganizationID)', [employeeKey, swich_value,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("removeEmployee " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});
app.get(securedpath + '/selectShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside server");
//    connection.query("SELECT * from shifttype;", function (err, rows) {
    var domainkey = "shifttypes";
    var empkey = 100;// shift types are not org boounded
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.


                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });

});


app.get(securedpath + '/allfacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var domainkey = "facilities";
    var empkey = url.parse(req.url, true).query['empkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log("I GOT FACILITIES AS " + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });

//    res.end();
});

app.get(securedpath + '/viewScheduleNameList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var domainkey = "facilities";
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var managerkey = url.parse(req.url, true).query['managerkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @pageno=?;set @itemsPerPage=?;set @managerkey=?;set @OrganizationID=?;call usp_viewScheduleNameList(@pageno,@itemsPerPage,@managerkey,@OrganizationID)", [pageno, itemsPerPage, managerkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log("I GOT FACILITIES AS " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });

//    res.end();
});


app.get(securedpath + '/scoringtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

//    connection.query('SELECT * from scoringtype', function (err, rows)
    var domainkey = "scoretypes";
    var empkey = 100;
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) //IMPORTANT : (err,rows) this order matters.
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    res.end(JSON.stringify(rows[3]));
//            console.log(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/selectJobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside selectJobtitle");
    var domainkey = "jobtitles";
    var empkey = url.parse(req.url, true).query['empkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside selectJobtitle");
            // console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
    });
     }
        connection.release();
    });
});
app.get(securedpath + '/addNewJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID']; 
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?; set @OrganizationID=?;call usp_addNewJobTitle(@empkey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
            // console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/deleteJobTitleSelected', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobTitlekey = url.parse(req.url, true).query['JobTitleKey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobTitlekey=?;set @OrganizationID=?; call usp_deleteJobTitleSelected(@jobTitlekey,@OrganizationID)', [jobTitlekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
//app.post(securedpath + '/deleteJobTitleSelected', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    var jobTitlekey = url.parse(req.url, true).query['JobTitleKey'];
////   var jobTitlekey = req.body.JobTitleKey;
//    console.log("FOR DELETION JOB TITLE KEY IS " + jobTitlekey);
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query('set @jobTitlekey=?; call usp_deleteJobTitleSelected(@jobTitlekey)', [jobTitlekey], function (err, rows) {
//        if (err) {
//            console.log("Problem with MySQL" + err);
//        }
//        else {
//            console.log("deleteForm  is  " + JSON.stringify(rows));
//
//            res.end(JSON.stringify(rows));
//        }
//        res.end();
//    });
//    }
//        connection.release();
//    });
//});
app.post(securedpath + '/deleteDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var DepartmentKey = url.parse(req.url, true).query['DepartmentKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   var DepartmentKey = req.body.DepartmentKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @OrganizationID=?;  call usp_deleteDepartment(@DepartmentKey,@OrganizationID)', [DepartmentKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteForm  is  " + JSON.stringify(rows[1]));

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/deleteWorkOrderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderTypeKey = url.parse(req.url, true).query['WorkorderTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   var DepartmentKey = req.body.DepartmentKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @OrganizationID=?;  call usp_deleteWorkOrderType(@WorkorderTypeKey,@OrganizationID)', [WorkorderTypeKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteForm  is  " + JSON.stringify(rows[1]));

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/deleteWorkorderstatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderStatusKey = url.parse(req.url, true).query['WorkorderStatusKey'];
//   var DepartmentKey = req.body.DepartmentKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatusKey=?;  call usp_deleteWorkorderstatus(@WorkorderStatusKey)', [WorkorderStatusKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkorderstatus  is  " + JSON.stringify(rows[1]));

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/getWorkorderstatusbyId', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var StatusKey = url.parse(req.url, true).query['StatusKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   var DepartmentKey = req.body.DepartmentKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @StatusKey=?; set @OrganizationID=?; call usp_getWorkorderstatusbyId(@StatusKey,@OrganizationID)', [StatusKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getWorkorderstatusbyId  is  " + JSON.stringify(rows[1]));

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewDepartmentpage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @pageno=?;set @itemsPerPage=?;set @empkey=?;set @OrganizationID=?; call usp_viewDepartmentpage(@pageno,@itemsPerPage,@empkey,@OrganizationID)", [pageno, itemsPerPage, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
                    // console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//  
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_viewDepartment(@empkey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
                    // console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewWorkorderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @pageno=?;set @itemsPerPage=?; set @employeekey=?;set @OrganizationID=?; call usp_viewWorkorderType(@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [pageno,itemsPerPage,employeekey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
            // console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});
app.post(securedpath + '/addJobTitleNew', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//var jobtittle = url.parse(req.url, true).query['jobtittle'];
//var jobdesciption = url.parse(req.url, true).query['jobdesciption'];
    var JobTitle = req.body.JobTitle;
    var JobTitleDescription = req.body.JobTitleDescription;
    console.log(JobTitle + "" + JobTitleDescription);
    var empkey = req.body.empkey;
     var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @JobTitle=?;set @JobTitleDescription=?; set @empkey=?;set @OrganizationID=?;call usp_addJobTitleNew(@JobTitle,@JobTitleDescription,@empkey,@OrganizationID)", [JobTitle, JobTitleDescription,empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
            // console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/addNewWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//var jobtittle = url.parse(req.url, true).query['jobtittle'];
//var jobdesciption = url.parse(req.url, true).query['jobdesciption'];
//    var WorkorderTypeKey = req.body.WorkorderTypeKey;
    var WorkorderTypeName = req.body.WorkorderTypeName;
    var Repeatable = req.body.Repeatable;
    var Frequency = req.body.Frequency;
    var WorkorderTime = req.body.WorkorderTime;
    var RoomTypeKey = req.body.RoomTypeKey;
    var empkey = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;
    if (Repeatable == true) {
        Repeatable = 'Y';
    } else {
        Repeatable = 'N';
    }
    console.log("addnewworkordertype--------------------" + WorkorderTypeName + "" + Repeatable + "" + Frequency + "" + WorkorderTime + "" + RoomTypeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @WorkorderTypeName=?;set @Repeatable=?; set @Frequency=?; set @WorkorderTime=?; set @RoomTypeKey=?; set @empkey=?;set @OrganizationID=?; call usp_addNewWorkordertype(@WorkorderTypeName,@Repeatable,@Frequency,@WorkorderTime,@RoomTypeKey,@empkey,@OrganizationID)", [WorkorderTypeName, Repeatable, Frequency, WorkorderTime, RoomTypeKey,empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
            // console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[7]));
        }
          });
        } 
        connection.release();
    });
});
app.post(securedpath + '/addNewDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    console.log("inside addNewJobTitle");
//    var domainkey = "jobtitles";
//    var empkey = 100;
//var jobtittle = url.parse(req.url, true).query['jobtittle'];
//var jobdesciption = url.parse(req.url, true).query['jobdesciption'];
    var DepartmentName = req.body.DepartmentName;
    var empkey = req.body.empkey;
   var OrganizationID = req.body.OrganizationID;
//    var jobdesciption = req.body.jobdesciption;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @DepartmentName=?; set @empkey=?;set @OrganizationID=?;call usp_addNewDepartment(@DepartmentName,@empkey,@OrganizationID)", [DepartmentName, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log("inside addNewJobTitle");
                    // console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editviewJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var JobTitleKey = url.parse(req.url, true).query['JobTitleKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   var JobTitleKey = req.body.JobTitleKey;
    console.log("FOR VIEW EDIT JOB TITLE KEY IS " + JobTitleKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @JobTitleKey=?;set @OrganizationID=?;call usp_editviewJobTitle(@JobTitleKey,@OrganizationID)', [JobTitleKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("editviewJobTitle  is  " + JSON.stringify(rows[1]));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editviewWorkOrderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderTypeKey = url.parse(req.url, true).query['WorkorderTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   var JobTitleKey = req.body.JobTitleKey;
    console.log("FOR VIEW EDIT JOB TITLE KEY IS " + WorkorderTypeKey+"  OrganizationID  ="+OrganizationID);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @OrganizationID=?;call usp_editviewWorkOrderType(@WorkorderTypeKey,@OrganizationID)', [WorkorderTypeKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("editviewJobTitle  is  " + JSON.stringify(rows[2]));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editviewDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var DepartmentKey = url.parse(req.url, true).query['DepartmentKey'];
//  var DepartmentKey = req.body.DepartmentKey;
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @OrganizationID=?;call usp_editviewDepartment(@DepartmentKey,@OrganizationID)', [DepartmentKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteForm  is  " + JSON.stringify(rows[2]));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/updateSelectedJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var employeeCalendar_Id = url.parse(req.url, true).query['employeeCalendar_Id'];
//    var jobtittlekey = url.parse(req.url, true).query['jobtittlekey'];
    var jobtittlekey = url.parse(req.url, true).query['JobTitleKey'];
    var jobtittle = url.parse(req.url, true).query['JobTitle'];
    var jobdescription = url.parse(req.url, true).query['JobTitleDescription'];
    var empkey = url.parse(req.url, true).query['empkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var jobtittlekey = req.body.JobTitleKey;
//    var jobtittle = req.body.JobTitle;
//    var jobdescription = req.body.JobTitleDescription;
    console.log(" INSIDE UPDATING JOBTITLE " + jobtittlekey + " " + jobtittle + " " + jobdescription);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtittlekey=?;set @jobtittle=?;set @jobdescription=?; set @empkey=?;set @OrganizationID=?; call usp_updateSelectedJobTitle(@jobtittlekey,@jobtittle,@jobdescription,@empkey,@OrganizationID)', [jobtittlekey, jobtittle, jobdescription,empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {

            // console.log("editEmp_scheduling " + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[5]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/editSelectedWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var employeeCalendar_Id = url.parse(req.url, true).query['employeeCalendar_Id'];
//    var jobtittlekey = url.parse(req.url, true).query['jobtittlekey'];
    var WorkorderTypeKey = url.parse(req.url, true).query['WorkorderTypeKey'];
    var WorkorderTypeName = url.parse(req.url, true).query['WorkorderTypeName'];
    var RoomTypeKey = url.parse(req.url, true).query['RoomTypeKey'];
    var Frequency = url.parse(req.url, true).query['Frequency'];
    var Repeatable = url.parse(req.url, true).query['Repeatable'];
    var WorkorderTime = url.parse(req.url, true).query['WorkorderTime'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var jobtittlekey = req.body.JobTitleKey;
//    var jobtittle = req.body.JobTitle;
//    var jobdescription = req.body.JobTitleDescription;
    console.log(" INSIDE UPDATING JOBTITLE " + WorkorderTypeKey + " " + WorkorderTypeName + " " + RoomTypeKey + " " + Frequency + " " + Repeatable + " " + WorkorderTime);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @WorkorderTypeName=?;set @RoomTypeKey=?;set @Frequency=?;set @Repeatable=?;set @WorkorderTime=?; set @OrganizationID=?;call usp_editSelectedWorkordertype(@WorkorderTypeKey,@WorkorderTypeName,@RoomTypeKey,@Frequency,@Repeatable,@WorkorderTime,@OrganizationID)', [WorkorderTypeKey, WorkorderTypeName, RoomTypeKey, Frequency, Repeatable, WorkorderTime,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editEmp_scheduling " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[7]));


                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/editSelectedDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var employeeCalendar_Id = url.parse(req.url, true).query['employeeCalendar_Id'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var DepartmentKey = url.parse(req.url, true).query['DepartmentKey'];
    var DepartmentName = url.parse(req.url, true).query['DepartmentName'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

//    var DepartmentKey = req.body.DepartmentKey;
//    var departmentName = req.body.DepartmentName;
//    var jobdescription = req.body.jobdescription;
    console.log(" INSIDE UPDATING Department " + DepartmentKey + " " + DepartmentName);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @DepartmentName=?; set @empkey=?;set @OrganizationID=?; call usp_editSelectedDepartment(@DepartmentKey,@DepartmentName,@empkey,@OrganizationID)', [DepartmentKey, DepartmentName, empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editEmp_scheduling " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/empDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['SearchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("skey is " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_employeesByIdGet(@empkey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//              console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getallEquipments', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("skey is " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey=?;set @OrganizationID=?; call usp_getallEquipment(@employeekey,@OrganizationID)", [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//              console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.post(securedpath + '/barcodeReportByEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    console.log("What is inside body " + JSON.stringify(req.body));
    var EquipmentTypeKey = newWOObj.EquipmentTypeKey;
    var EquipmentKey = newWOObj.EquipmentKey;
    var employeekey = newWOObj.employeekey;
    var OrganizationID = newWOObj.OrganizationID;
     console.log("skey is " + EquipmentTypeKey+"  "+EquipmentKey+"  "+employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @EquipmentTypeKey=?;set @EquipmentKey=?; set @employeekey=?; set @OrganizationID=?;call usp_barcodeReportByEquipment(@EquipmentTypeKey,@EquipmentKey,@employeekey,@OrganizationID)", [EquipmentTypeKey, EquipmentKey, employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
              console.log(JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/supervisorname', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_auditorsDetails(@managerID,@OrganizationID)", [managerID,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/getEmployeeStatus', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_getEmployeeStatus(@managerID,@OrganizationID)", [managerID,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/update_employee_info', supportCrossOriginScript);
app.post(securedpath + '/update_employee_info', supportCrossOriginScript, function (req, response) {
    // console.log("inside update");
//    console.log("empAddition"+empSchedule.FirstName);


    var employeekey = req.body.EmployeeKey;
    var metaupdatedby = req.body.managerKey;
    // console.log("metaupdatedby" + metaupdatedby);
    var employeenumber = req.body.EmployeeNumber;
    var firstname = req.body.FirstName;
    var middlename = req.body.MiddleName;
    var lastname = req.body.LastName;
    var jobtitlekey = req.body.JobTitleKey;
    var managerkey = req.body.managerKey;
    var addressline1 = req.body.AddressLine1;
    var addressline2 = req.body.AddressLine2;
    var city = req.body.City;
    var state = req.body.State;
    var zipcode = req.body.ZipCode;
    var country = req.body.Country;
    var primaryphone = req.body.PrimaryPhone;
    var alternatephone = req.body.AlternatePhone;
    var birthdate = req.body.birthDate;
    var hiredate = req.body.hireDate;
    var isSupervisor = req.body.IsSupervisor;
    var SupervisorKey = req.body.SupervisorKey;
    var departmentkey = req.body.DepartmentKey;
    var email = req.body.EmailID;
    var lastevaluationdate = null;
    var nextevaluationdate = null;
    var isrelieved = 0;
    var ishkii = 0;
    var isactive = 1;
    var OrganizationID = req.body.OrganizationID;
    var gender = req.body.Gender;
    var shirtSize = req.body.ShirtSize;
    var pantSize = req.body.PantSize;
    var UserRoleTypeKey = req.body.UserRoleTypeKey;
    var EmployeeStatusKey1 = req.body.EmployeeStatusKey1;
    var Remark = req.body.Remark;
    console.log("-----------------isSupervisor----------------" + isSupervisor + "  " + firstname + "  " + employeenumber + "birthdate" + birthdate + "hiredate" + hiredate);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @issupervisor=?;set @SupervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?; set @UserRoleTypeKey=?;set @EmployeeStatusKey1=?;set @Remark=?; call usp_employeesUpd(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@issupervisor,@SupervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize,@UserRoleTypeKey,@EmployeeStatusKey1,@Remark)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, isSupervisor, SupervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize, UserRoleTypeKey, EmployeeStatusKey1, Remark], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("update_employee_info"+JSON.stringify(rows[25]));
                    response.end(JSON.stringify(rows[34]));
                }
            });
        }
        connection.release();
    });
});
app.options('/defaultEvent_shift', supportCrossOriginScript);
app.post(securedpath + '/defaultEvent_shift', supportCrossOriginScript, function (req, res) {
    var actiontypeKey = url.parse(req.url, true).query['actionKey'];
    var eventhost = url.parse(req.url, true).query['eventhost'];
    var venue = url.parse(req.url, true).query['venue'];
    var meetingDate = url.parse(req.url, true).query['mdate'];
    var starttime = url.parse(req.url, true).query['stime'];
    var endtime = url.parse(req.url, true).query['etime'];
    var empType = url.parse(req.url, true).query['shiftTypes'];
    var count = url.parse(req.url, true).query['count'];
    // console.log("actionKey " + actiontypeKey + "eventhost " + eventhost + "venue " + venue + "meetingDate " + meetingDate + "stime..." + starttime + "..etime..." + endtime + "shiftTypes..." + empType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actiontypeKey=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @empType=?;call usp_eventAdd(@actiontypeKey,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@empType);', [actiontypeKey, venue, meetingDate, eventhost, endtime, starttime, count, empType], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });

});
app.options('/defaultEvent_employee', supportCrossOriginScript);
app.post(securedpath + '/defaultEvent_employee', supportCrossOriginScript, function (req, res) {

    var actiontypeKey = url.parse(req.url, true).query['actiontypeKey'];
    // console.log("actionType Key obtained " + actiontypeKey);
    var venue = url.parse(req.url, true).query['venue'];
    var meetingDate = url.parse(req.url, true).query['mdate'];
    var eventhost = url.parse(req.url, true).query['eventhost'];
    var endtime = url.parse(req.url, true).query['etime'];
    var starttime = url.parse(req.url, true).query['stime'];
    var count = url.parse(req.url, true).query['count'];
    var empType = url.parse(req.url, true).query['selectedEmployee'];
    // console.log("meetingName.. " + actiontypeKey + "venue.." + venue + "meetingDate.. " + meetingDate + "startTime.. " + starttime + "endTime.." + endtime + "selectedEmployee.. " + empType + "eventhost.." + eventhost + "count.." + count);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actiontypeKey=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @empType=?;call usp_eventAdd(@actiontypeKey,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@empType);', [actiontypeKey, venue, meetingDate, eventhost, endtime, starttime, count, empType], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });

});

app.get(securedpath + '/selectFacility_zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_facilityZoneGet(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("getEquipment "+JSON.stringify(rows[0]));
            res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/selectFacility_room', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;call usp_facilityRoomGet(@empkey)', [empkey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("getEquipment "+JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.options('/newEvent_employee', supportCrossOriginScript);
app.post(securedpath + '/newEvent_employee', supportCrossOriginScript, function (req, res) {
    // console.log("inside newEvent_employee");
    var eventType = url.parse(req.url, true).query['eventType'];
    var eventName = url.parse(req.url, true).query['eventName'];
    var eventDescription = url.parse(req.url, true).query['eventDescription'];
    var venue = url.parse(req.url, true).query['venue'];
    var meetingDate = url.parse(req.url, true).query['mdate'];
    var eventhost = url.parse(req.url, true).query['eventhost'];
    var endtime = url.parse(req.url, true).query['etime'];
    var starttime = url.parse(req.url, true).query['stime'];
    var count = url.parse(req.url, true).query['count'];
    var selectedEmployee = url.parse(req.url, true).query['selectedEmployee'];
    var metaupdatedby = employeekey_return;
    // console.log("eventType.. " + eventType + "eventName..." + eventName + "eventDescription..." + eventDescription + "venue.." + venue + "meetingDate.. " + meetingDate + "startTime.. " + starttime + "endTime.." + endtime + "selectedEmployee.. " + selectedEmployee + "eventhost.." + eventhost + "count.." + count);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @eventType=?;set @eventName=?;set @eventDescription=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @selectedEmployee=?; set @metaupdatedby=?; call usp_newEventAdd(@eventType,@eventName,@eventDescription,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@selectedEmployee,@metaupdatedby);', [eventType, eventName, eventDescription, venue, meetingDate, eventhost, endtime, starttime, count, selectedEmployee, metaupdatedby], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});


app.get(securedpath + '/empKey_byJobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobTitle = url.parse(req.url, true).query['jobTitle'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("inside ...jobTitle..." + jobTitle);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobTitle=?;set @empkey=?;set @OrganizationID=?;call usp_employeeKeyByJobtitle(@jobTitle,@empkey,@OrganizationID)', [jobTitle, empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing rows");
            // console.log("ROWS" + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});
app.options('/addEmpScheduling', supportCrossOriginScript);
app.post(securedpath + '/addEmpScheduling', supportCrossOriginScript, function (req, res) {
    var shiftkey = url.parse(req.url, true).query['shiftkey'];
    var zone = url.parse(req.url, true).query['zone'];
    var shiftTypeKey = url.parse(req.url, true).query['shifttype'];
    var start_date = url.parse(req.url, true).query['startdate'];
    var end_date = url.parse(req.url, true).query['enddate'];
    var employeeKeyList = url.parse(req.url, true).query['employeekeylist'];
    var updatedBy = url.parse(req.url, true).query['updatedby'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log(zone + ".." + shiftTypeKey + ".." + employeeKeyList + "...." + shiftkey + ".." + start_date + "..." + end_date + "...updatedBy" + updatedBy);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?; set @zone=?; set @shiftTypeKey=?; set @start_date=?; set @end_date=?; set @employeeKeyList=?; set @updatedBy=?;set @OrganizationID=?; call usp_addEmployeeScheduling(@shiftkey,@zone,@shiftTypeKey,@start_date,@end_date,@employeeKeyList,@updatedBy,@OrganizationID)', [shiftkey, zone, shiftTypeKey, start_date, end_date, employeeKeyList, updatedBy,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("addScheduling_employee " + JSON.stringify(rows));
            res.end(JSON.stringify(rows[8]));
        }
    });
    }
        connection.release();
    });
});
app.options('/addScheduling_Supervisor', supportCrossOriginScript);
app.post(securedpath + '/addScheduling_Supervisor', supportCrossOriginScript, function (req, res) {
    var zone = req.body.zoneKey;
    var start_date = req.body.StartDate;
    var end_date = req.body.EndDate;
    var shiftTypeKey = req.body.shiftTypeKey;
    var supervisor = req.body.supervisorKey;
    var metaupdatedby = req.body.employeekey;
      var OrganizationID = req.body.OrganizationID;
    // console.log("inside addSchedulingBy_shift " + start_date + " " + end_date + " " + shiftTypeKey + " " + supervisor + "  " + zone);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_addSchedulingSupervisor(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@metaupdatedby,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    res.end("success");

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editEmp_scheduling', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var employeeCalendar_Id = url.parse(req.url, true).query['employeeCalendar_Id'];
    var shift_Key = url.parse(req.url, true).query['shift_Key'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shift_Key=?; call usp_employeeSchedulingEdit(@shift_Key)', [shift_Key], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editEmp_scheduling " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editSupervisor_scheduling', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shift_Key = url.parse(req.url, true).query['shift_Key'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shift_Key=?; call usp_supervisorSchedulingEdit(@shift_Key)', [shift_Key], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editSupervisor_scheduling " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});
app.options('/addTemplatequestion', supportCrossOriginScript);
app.post(securedpath + '/addTemplatequestion', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var question = newobject.question;
    // console.log("question" + question);
    var templatename = newobject.templatename;
    // console.log("TemplateID" + templatename);
    var ScoringTypeKey = newobject.scoringTypeKey;
    // console.log("scoringkey" + ScoringTypeKey);
//    var frequency =newobject.frequency;
    var metaupdatedby = newobject.employeekey;
     var OrganizationID =newobject.OrganizationID;
    // console.log("frequency" + frequency);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templatename=?;set @ScoringTypeKey=?;set @question=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_templateAdd(@templatename,@ScoringTypeKey,@question,@metaupdatedby,@OrganizationID)', [templatename, ScoringTypeKey,question, metaupdatedby,OrganizationID], function (err, rows)
    {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewInspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var to_date = url.parse(req.url, true).query['inspectionDate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("date  is " + to_date);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsPerPage=?; set @date=?; set @employeekey=?; set @OrganizationID=?; call usp_getInspectionByDate(@pageno,@itemsPerPage,@date,@employeekey,@OrganizationID)', [pageno, itemsPerPage, to_date, employeekey, OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("viewInspection" + JSON.stringify(rows[5]));
            res.end(JSON.stringify(rows[5]));

                }
            });
        }
        connection.release();
    });

});
app.get(securedpath + '/viewAllInspectionByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var search_DT = url.parse(req.url, true).query['search_DT'];
    var search_DT2 = url.parse(req.url, true).query['search_DT2'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var filter = url.parse(req.url, true).query['filter']; 
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @search_DT=?;set @search_DT2=?; set @empkey=?; set @OrganizationID=?;  call usp_viewAllInspectionByDates(@search_DT,@search_DT2,@empkey,@OrganizationID)', [search_DT, search_DT2, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("gettodaysMeeting "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getAllTemplates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var scoringTypeKey = url.parse(req.url, true).query['scoringTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("getAllTemplates.....scoringTypeKey...." + scoringTypeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scoringTypeKey=?; set@OrganizationID=?;call usp_allTemplatesGet(@scoringTypeKey,@OrganizationID)', [scoringTypeKey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

            res.end(JSON.stringify(rows[2]));
//            console.log("getAllTemplates obtained " + JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/floorByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for floo" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getFloorByFacility(@fkey,@OrganizationID)", [fkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/zoneByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for zone" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getZoneByFacility(@fkey,@OrganizationID)", [fkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/roomtypeByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("roomtypeByFacility " + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getRoomtypeByFacility(@fkey,@OrganizationID)", [fkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for rooom" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getRoomByFacility(@fkey,@OrganizationID)", [fkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/zoneByFacility_Floor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----keys for zone----" + fkey + " " + flkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @flkey=?; set @fkey=?;set @OrganizationID=?;  call usp_floorZoneById(@flkey,@fkey,@OrganizationID)', [flkey, fkey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});


//app.get('/roomtypeByFacility_Floor', function (req, res) {
//    var fkey = url.parse(req.url, true).query['fkey'];
//    var flkey = url.parse(req.url, true).query['floorkey'];
//    console.log("Fac key for roomtypene" + fkey);
//    pool.query("select distinct rt.RoomtypeKey,rt.RoomType from roomtype rt inner join room r on rt.RoomtypeKey= r.RoomtypeKey where r.IsDeleted = 0 and r.FacilityKey=? and r.FloorKey=?", [fkey, flkey], function (err, rows) {
//        if (err) {
//            console.log("Problem with MySQL" + err);
//        }
//        else {
//              console.log(JSON.stringify(rows));
//            res.end(JSON.stringify(rows));
//        }
//    });
//});

app.get(securedpath + '/roomtypeByFacility_Floor_zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
    var zon = url.parse(req.url, true).query['zonekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for roomtypene" + fkey + " usp_getRoomtypeByFacility_Floor_zone called");
//    pool.query("set @fkey=?;set @flkey=?;set @zon=?;call usp_getRoomtypeByFacility_Floor_zone(@fkey,@flkey,@zon)", [fkey, flkey, zon], function (err, rows) {
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @flkey=?;set @zon=?;set @OrganizationID=?; call usp_getRoomTypeByFacility_Floor_zone(@fkey,@flkey,@zon,@OrganizationID) ", [fkey, flkey, zon,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
//            console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_Floor_zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
    var zon = url.parse(req.url, true).query['zonekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for rooom" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @flkey=?;set @zon=?; set @OrganizationID=?;call usp_getRoomByFacility_Floor_zone(@fkey,@flkey,@zon,@OrganizationID) ", [fkey, flkey, zon,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    //  console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_Zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var zone = url.parse(req.url, true).query['zonekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for rooom" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zone=?; set @OrganizationID=?;call usp_getRoomByFacility_Zone(@fkey,@zone,@OrganizationID)", [fkey, zone,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_Floor_Zone_RoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var floor = url.parse(req.url, true).query['floorkey'];
    var zone = url.parse(req.url, true).query['zonekey'];
    var roomtype = url.parse(req.url, true).query['roomtype'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("roomtype " + roomtype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @floor=?;set @zone=?;set @roomtype=?;set @OrganizationID=?; call usp_getRoomByFacility_Floor_Zone_RoomType(@fkey,@floor,@zone,@roomtype,@OrganizationID)", [fkey, floor, zone, roomtype,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            //  console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_Floor_RoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var floor = url.parse(req.url, true).query['floorkey'];
    var roomtype = url.parse(req.url, true).query['roomtype'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("roomtype " + roomtype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @floor=?; set @roomtype=?; set @OrganizationID=?;call usp_getRoomByFacility_Floor_RoomType(@fkey,@floor,@roomtype,@OrganizationID)", [fkey, floor, roomtype,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            //  console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
        });
        }   
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_Zone_RoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var zone = url.parse(req.url, true).query['zonekey'];
    var roomtype = url.parse(req.url, true).query['roomtype'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("roomtype " + roomtype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zone=?; set @roomtype=?; set @OrganizationID=?;call usp_getRoomByFacility_Zone_RoomType(@fkey,@zone,@roomtype,@OrganizationID)", [fkey, zone, roomtype,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

            //console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
          });
        } 
        connection.release();
    });
});

app.get(securedpath + '/roomByFacility_RoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var roomtype = url.parse(req.url, true).query['roomtype'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("roomtype " + roomtype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?; set @roomtype=?;set @OrganizationID=?; call usp_getRoomByFacility_RoomType(@fkey,@roomtype,@OrganizationID)", [fkey, roomtype,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            //  console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
           });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomIdsByFac_Rtype', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var rt = url.parse(req.url, true).query['rtype'];
    // console.log("for rooms 1values are " + fac + " " + rt);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?;set @rt=?; call usp_getRoomIdsByFac_Rtype(@fac,@rt)', [fac, rt], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //  console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getRoomIdsByFac_Floor_Rtype', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var floor = url.parse(req.url, true).query['floor'];
    var rt = url.parse(req.url, true).query['rtype'];
    // console.log("for rooms 1values are " + fac + " " + rt);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?; set @floor=?; set @rt=?; call usp_getRoomIdsByFac_Floor_Rtype(@fac,@floor,@rt)', [fac, floor, rt], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //   console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomIdsByFac_Zone_Rtype', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var zone = url.parse(req.url, true).query['zone'];
    var rt = url.parse(req.url, true).query['rtype'];
    // console.log("for rooms 1values are " + fac + " " + rt);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?; set @zone=?; set @rt=?; call usp_getRoomIdsByFac_Zone_Rtype(@fac,@zone,@rt)', [fac, zone, rt], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //  console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFloor_zonekeyByFac_Rkey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['facility'];
    var roomkey = url.parse(req.url, true).query['roomkey'];
    // console.log("facility  is " + facility + "rtype is " + roomkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?; set @roomkey=?; call usp_getFloor_zonekeyByFac_Rkey(@facility,@roomkey)', [facility, roomkey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getZonekeyByFac_floor_Rkey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['facility'];
    var roomkey = url.parse(req.url, true).query['roomkey'];
    var floorkey = url.parse(req.url, true).query['floorkey'];
    // console.log("facility  is " + facility + "rtype is " + roomkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?;set roomkey=?;set @floorkey=?; call usp_getZonekeyByFac_floor_Rkey(@facility,@roomkey,@floorkey)', [facility, roomkey, floorkey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFloorkeyByFac_zone_Rkey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['facility'];
    var roomkey = url.parse(req.url, true).query['roomkey'];
    var zonekey = url.parse(req.url, true).query['zonekey'];
    // console.log("facility  is " + facility + "rtype is " + roomkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?; set @roomkey=?; set @zonekey=?; call usp_getFloorkeyByFac_zone_Rkey(@facility,@roomkey,@zonekey)', [facility, roomkey, zonekey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});

//app.get('/roomByFacility_Floor', function (req, res) {
//    var fkey = url.parse(req.url, true).query['fkey'];
//    var floor = url.parse(req.url, true).query['floorkey'];
//   
//   
//    pool.query("select r.RoomId,r.RoomKey from room r where r.IsDeleted = 0 and r.FacilityKey=? and r.FloorKey=?", [fkey, floor], function (err, rows) {
//        if (err) {
//            console.log("Problem with MySQL" + err);
//        }
//        else {
//              console.log(JSON.stringify(rows));
//            res.end(JSON.stringify(rows));
//        }
//    });
//});

app.get(securedpath + '/selectMorningShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getMorningShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("selectMorningShift " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/selectEveningShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getEveningShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("selectEveningShift " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/selectNightShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getNightShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("selectNightShift " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/MorningShift_supervisor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getSupervisorMorningShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("MorningShift_supervisor " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/EveningShift_supervisor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getSupervisorEveningShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("EveningShift_supervisor " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/NightShift_supervisor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getSupervisorNightShift(@t_date)', [t_date], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("NightShift_supervisor " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});
app.options('/updateSupervisorSchedule', supportCrossOriginScript);
app.post(securedpath + '/updateSupervisorSchedule', supportCrossOriginScript, function (req, res) {
    var shiftKey = req.body.ShiftKey;
    var shifttypes = req.body.ShiftTypeKey;
    var shiftInCharge = req.body.shift_In_Charge;
    var zoneKey = req.body.ZoneKey;
    var startTime = req.body.ShiftStartDatetime;
    var endTime = req.body.ShiftEndDatetime;
      var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftKey=?;set @shifttypes=?;set @shiftInCharge=?; set @zoneKey=?; set @startTime=?; set @endTime=?;set @OrganizationID=?;call usp_updateSupervisorSchedule(@shiftKey,@shifttypes,@shiftInCharge,@zoneKey,@startTime,@endTime,@OrganizationID)', [shiftKey, shifttypes, shiftInCharge, zoneKey, startTime, endTime,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("updateSupervisorSchedule " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allFormtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var domainkey = "formtype";
    var empkey = url.parse(req.url, true).query['empkey'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("allFormtype " + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});

//photo view starts
//app.get(securedpath + '/view_uploads', function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    fs.readdir('./webui/uploads/', function (err, files) {// for cloud server ../webui/uploads/
//        if (err)
//            return next(err);
//   updateFormDetails     res.send(files);
//    });
//});

//photo view starts
app.get(securedpath + '/view_uploads', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("--------view_uploads-----------" + " " + pageno + " " + itemsPerPage);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?;set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_getUploadsView(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage,empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("getfacilityById " + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/uploadsByFormType', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var formtype = url.parse(req.url, true).query['formType'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID  = url.parse(req.url, true).query['OrganizationID']; 
    
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @formtype=?; set @empkey=?; set @OrganizationID=?; call usp_getUploadsView_sorted(@formtype,@empkey,@OrganizationID)', [formtype,empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("getfacilityById " + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewimage/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
//    var wdk = url.parse(req.url, true).query['wd'];
    var img = url.parse(req.url, true).query['img'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    fs.readdir('uploads/img', function (err, files) {
        if (err)
            return next(err);
        res.send(files);
    });
});
//photo view ends

app.get(securedpath + '/getfacilityById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['facKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?;set @OrganizationID=?;call usp_facilityByIdGet(@facility,@OrganizationID)', [facility,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("getfacilityById " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/getFloorById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var facility = url.parse(req.url, true).query['facKey'];
    var floor = url.parse(req.url, true).query['floorKey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floorKey=?; set@OrganizationID=?; call usp_floorByIdGet(@floorKey,@OrganizationID)', [floor,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("getFloorById " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/getScheduleById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var facility = url.parse(req.url, true).query['facKey'];
    var bkey = url.parse(req.url, true).query['bkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bkey=?;set @OrganizationID=?;call usp_getScheduleById(@bkey,@OrganizationID)', [bkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

//            console.log("getScheduleById " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

//deleting facility
app.options('/deleteFacility', supportCrossOriginScript);
app.get(securedpath + '/deleteFacility', supportCrossOriginScript, function (req, res) {
    var facility_key = url.parse(req.url, true).query['facility_key'];
    // console.log("fac_key " + facility_key);
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @metaupdatedby=?; set @OrganizationID=?;call usp_facilityRemove(@facility_key,@metaupdatedby,@OrganizationID)', [facility_key, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});

//add facility
app.options('/addfacility', supportCrossOriginScript);
app.get(securedpath + '/addfacility', supportCrossOriginScript, function (req, res) {
     res.header("Access-Control-Allow-Origin", "*");
   var facility = url.parse(req.url, true).query['fac'];
   // console.log("facility" + facility);
   var userId = url.parse(req.url, true).query['employeekey'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


  // var facility = req.body.fac;  var userId = req.body.employeekey;  var OrganizationID = req.body.OrganizationID;

    var facilityKey = -99;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @userId=?;set @quest=?;set @facilityKey=?;set @OrganizationID=?; call usp_facilityAdd(@userId,@quest,@facilityKey,@OrganizationID)', [userId, facility, facilityKey,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//            console.log("ROWS" + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
// app.options('/updateFacility', supportCrossOriginScript);
app.get(securedpath + '/updateFacility', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
      var facility_key = url.parse(req.url, true).query['facility_key'];
    var facility_name = url.parse(req.url, true).query['facility_name'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @facility_name=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_facilitiesUpdate(@facility_key,@facility_name,@metaupdatedby,@OrganizationID)', [facility_key, facility_name, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllfacility_floor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?;set @OrganizationID=?;call usp_facilityFloorGet(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("getAllfacility_floor" + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});

//deleting floor
app.options('/deleteFloor', supportCrossOriginScript);
app.post(securedpath + '/deleteFloor', supportCrossOriginScript, function (req, res) {
    var floor_key = url.parse(req.url, true).query['floor_key'];
    var facility_key = url.parse(req.url, true).query['facility_key'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("facility_key,floor_key " + facility_key + " " + floor_key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floor_key=?;set @facility_key=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_floorRemove(@floor_key,@facility_key,@metaupdatedby,@OrganizationID)', [floor_key, facility_key, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});

app.options('/deleteBatchName', supportCrossOriginScript);
app.post(securedpath + '/deleteBatchName', supportCrossOriginScript, function (req, res) {
    var batchKey = url.parse(req.url, true).query['batchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var facility_key = url.parse(req.url, true).query['facility_key'];
//    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    // console.log("facility_key,floor_key " + facility_key + " " + floor_key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @batchKey=?;set @OrganizationID=?; call usp_deleteBatchName(@batchKey,@OrganizationID)', [batchKey,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});


//add new floor
app.options('/addnewfloor', supportCrossOriginScript);
app.post(securedpath + '/addnewfloor', supportCrossOriginScript, function (req, res) {

    var facilityKey = req.body.FacilityKey;
    var floorName = req.body.FloorName;
    var floorDescription = req.body.FloorDescription;
    var floorKey = -99;
    var userId = req.body.employeekey;
     var OrganizationID = req.body.OrganizationID;
    // console.log("facility" + facilityKey, floorKey, floorDescription);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?;set @metaupdatedby=?;set @floor=?;set @floorName=?;set @floordesc=?; set@OrganizationID=?; call usp_floorAdd(@facility,@metaupdatedby,@floor,@floorName,@floordesc,@OrganizationID)', [facilityKey, userId, floorKey, floorName, floorDescription,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//               console.log("addnewfloor ROWS" + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.options('/addnewbatchName', supportCrossOriginScript);
app.post(securedpath + '/addnewbatchName', supportCrossOriginScript, function (req, res) {

    var bname = req.body.BatchSchduleName;
    var bdesp = req.body.ScheduleDescription;
    var empkey = req.body.EmployeeKey;
    var managerKey = req.body.employeekey;
     var OrganizationID = req.body.OrganizationID;
//    var namekey = req.body.BatchScheduleNameKey;
    // console.log("facility" + facilityKey, floorKey, floorDescription);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bname=?;set @bdesp=?;set @empkey=?; set @managerKey=?; set @OrganizationID=?;call usp_addnewbatchName(@bname,@bdesp,@empkey,@managerKey,@OrganizationID)', [bname, bdesp, empkey,managerKey,OrganizationID], function (err, rows)
    {
        if (err) {
            console.log("Problem with MySQL" + err);
        } else
        {
//               console.log("addnewfloor ROWS" + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.options('/addnewWorkorderStatus', supportCrossOriginScript);
app.post(securedpath + '/addnewWorkorderStatus', supportCrossOriginScript, function (req, res) {

//    var facilityKey = req.body.FacilityKey;
    var WorkorderStatus = req.body.WorkorderStatus;
    var WorkorderStatusDescription = req.body.WorkorderStatusDescription;
//    var floorKey = -99;
    var employeekey = req.body.employeekey;
    // console.log("facility" + facilityKey, floorKey, floorDescription);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?;set @WorkorderStatusDescription=?;set @employeekey=?; call usp_addnewWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@employeekey)', [WorkorderStatus, WorkorderStatusDescription, employeekey], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//               console.log("addnewWorkorderStatus ROWS" + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateFloor', supportCrossOriginScript);
app.post(securedpath + '/updateFloor', supportCrossOriginScript, function (req, res) {
    var facilityKey = req.body.FacilityKey;
    var floorName = req.body.FloorName;
    var floorDescription = req.body.FloorDescription;
    var floorKey = req.body.FloorKey;
    var userId = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log("facility" + facilityKey, floorKey, floorDescription, floorName);

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @floor_key=?; set @floor_name=?; set @floorDescription=?;set @userId=?; set@OrganizationID=?; call usp_floorUpdate(@facility_key,@floor_key,@floor_name,@floorDescription,@userId,@OrganizationID)', [facilityKey, floorKey, floorName, floorDescription, userId,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});
app.options('/updateScheduleName', supportCrossOriginScript);
app.post(securedpath + '/updateScheduleName', supportCrossOriginScript, function (req, res) {
    var bname = req.body.BatchSchduleName;
    var bdesp = req.body.ScheduleDescription;
    var empkey = req.body.EmployeeKey;
    var bkey = req.body.bskey;
    var managerkey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log("facility" + facilityKey, floorKey, floorDescription, floorName);

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bname=?; set @bdesp=?; set @empkey=?; set @bkey=?; set @managerkey=?;set @OrganizationID=?; call usp_updateScheduleName(@bname,@bdesp,@empkey,@bkey,@managerkey,@OrganizationID)', [bname, bdesp, empkey,bkey,managerkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});

app.options('/updateWorkorderStatus', supportCrossOriginScript);
app.post(securedpath + '/updateWorkorderStatus', supportCrossOriginScript, function (req, res) {
    var WorkorderStatus = req.body.WorkorderStatus;
    var WorkorderStatusDescription = req.body.WorkorderStatusDescription;
    var WorkorderStatusKey = req.body.WorkorderStatusKey;
//    var floorKey = req.body.FloorKey;
    var userId = req.body.employeekey;
    // console.log("facility" + facilityKey, floorKey, floorDescription, floorName);

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?; set @WorkorderStatusDescription=?; set @WorkorderStatusKey=?; set @userId=?;call usp_updateWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@WorkorderStatusKey,@userId)', [WorkorderStatus, WorkorderStatusDescription, WorkorderStatusKey, userId], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllfacility_floor_zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?; call usp_facilityFloorZoneGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("getAllfacility_floor_zone"+JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getZoneById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var zone_key = url.parse(req.url, true).query['zoneKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("zone key" + zone_key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone_key=?; set@OrganizationID=?; call usp_zoneById(@zone_key,@OrganizationID)', [zone_key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[1][0]));
                    res.end(JSON.stringify(rows[2][0]));

                }
            });
        }
        connection.release();
    });
});
app.options('/addInspectionOrder', supportCrossOriginScript);
app.post(securedpath + '/addInspectionOrder', supportCrossOriginScript, function (req, res) {
    var templateid = req.body.templateID;
    var employeekey = req.body.supervisorKey;
    var inspectiondate = req.body.inspectiondate;
    var timer = req.body.inspectiontime;
//    var roomkeylist = req.body.roomKey;
    var metaupdatedby = req.body.metaUpdatedBy;
    var workorderKeys = req.body.workorderkeylist;
    console.log("workorderKeys" + workorderKeys + "template..." + templateid + "employee..." + employeekey + "inspectiondate...." + inspectiondate + "metaupdatedby.." + metaupdatedby);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;set @employeekey=?;set @inspectiondate=?;set @timer=?;set @metaupdatedby=?; set @workorderKeys=?; call usp_inspectionorderAdd(@templateid,@employeekey,@inspectiondate,@timer,@metaupdatedby,@workorderKeys)', [templateid, employeekey, inspectiondate, timer, metaupdatedby, workorderKeys], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log(JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));

                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;call usp_floorGet(@empkey)', [empkey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(" " + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
//add zone
app.options('/addnewzone', supportCrossOriginScript);
app.post(securedpath + '/addnewzone', supportCrossOriginScript, function (req, res) {

    var facility = req.body.FacilityKey;
    var floor = req.body.FloorKey;
    var zone = req.body.ZoneName;
    var metaupdatedby = req.body.employeekey;
     var OrganizationID = req.body.OrganizationID;
    // console.log(facility, floor, zone);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @quest=?;set @zone=?; set @floor=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_zoneAdd(@quest,@zone,@floor,@metaupdatedby,@OrganizationID)', [facility, zone, floor, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//               console.log("ROWS addnewzone" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateZone', supportCrossOriginScript);
app.post(securedpath + '/updateZone', supportCrossOriginScript, function (req, res) {
    var facility_key = req.body.FacilityKey;
    var floor_key = req.body.FloorKey;
    var facility_name = req.body.FacilityName;
    var floor_name = req.body.FloorName;
    var zone_key = req.body.ZoneKey;
    var zone_name = req.body.ZoneName;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log(facility_key, floor_key, facility_name, floor_name, zone_key, zone_name);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @floor_key=?;set @zone_key=?; set @zone_name=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_zoneUpdate(@facility_key,@floor_key,@zone_key,@zone_name,@metaupdatedby,@OrganizationID)', [facility_key, floor_key, zone_key, zone_name, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//             console.log(JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[6]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFacilityFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility_key = url.parse(req.url, true).query['key'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("facility_key" + facility_key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set@OrganizationID=?; call usp_facilityFloorById(@facility_key,@OrganizationID)', [facility_key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("usp_facilityFloorId "+JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFloorZone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var floor_key = url.parse(req.url, true).query['fl_key'];
    var facility_key = url.parse(req.url, true).query['f_key'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("floor_key" + floor_key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floor_key=?; set @facility_key=?; set @OrganizationID=?;call usp_floorZoneById(@floor_key,@facility_key,@OrganizationID)', [floor_key, facility_key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("usp_floorZoneById "+JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});
app.options('/deleteZoneById', supportCrossOriginScript);
app.get(securedpath + '/deleteZoneById', supportCrossOriginScript, function (req, res) {
    var zoneKey = url.parse(req.url, true).query['zoneKey'];
    var floorkey = url.parse(req.url, true).query['floorkey'];
    var facility = url.parse(req.url, true).query['facility'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zoneKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_zoneRemove(@zoneKey,@metaupdatedby,@OrganizationID)', [zoneKey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("usp_zoneRemove "+JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/domainValuesGet', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var domainkey = url.parse(req.url, true).query['key'];
    var empkey = url.parse(req.url, true).query['empkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?; call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("domainkey "+JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});
app.options('/deleteFloorTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteFloorTypeById', supportCrossOriginScript, function (req, res) {
    var floortypekey = url.parse(req.url, true).query['floortypekey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floortypekey=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeRemove(@floortypekey,@metaupdatedby,@OrganizationID)', [floortypekey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("floortypekey "+JSON.stringify(rows));
                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFloorTypeById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var floortypekey = url.parse(req.url, true).query['floortypeKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floortypekey=?; set @OrganizationID=?; call usp_floorTypeById(@floortypekey,@OrganizationID)', [floortypekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("floortypekey "+JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});
app.options('/updateFloorType', supportCrossOriginScript);
app.post(securedpath + '/updateFloorType', supportCrossOriginScript, function (req, res) {
    var floortypekey = req.body.FloorTypeKey;
    var floortypename = req.body.FloorTypeName;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floortypekey=?; set @floortypename=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeUpdate(@floortypekey,@floortypename,@metaupdatedby,@OrganizationID)', [floortypekey, floortypename, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("floortypekey "+JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });

});
app.options('/addnewfloortype', supportCrossOriginScript);
app.post(securedpath + '/addnewfloortype', supportCrossOriginScript, function (req, res) {
    var floortypename = req.body.FloorTypeName;
    var metaupdatedby = req.body.employeekey;
     var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floortypename=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeAdd(@floortypename,@metaupdatedby,@OrganizationID)', [floortypename, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("floortypename "+JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

//------------- commented by Rajeesh on 7/7/2017 Duplicate url /getShiftInCharge
//app.get(securedpath + '/getShiftInCharge', function (req, res)
//{
//    res.header("Access-Control-Allow-Origin", "*");
//    var shiftkey = url.parse(req.url, true).query['shiftkey'];
////    var shift = url.parse(req.url, true).query['shifttype'];
////    var zone = url.parse(req.url, true).query['zone'];
////    var startDate = url.parse(req.url, true).query['startDate'];
//  
//    // console.log("for shift in charge values are " + shift + " " + zone+ " "+startDate);
//    pool.query('select s.ShiftInChargeKey as EmployeeKey from shift s where s.ShiftKey=?', [shiftkey], function (err, rows)
//    {
//        if (err)
//        {
//            console.log(err);
//        }
//        else
//        {
//            //   console.log(JSON.stringify(rows));
//            res.end(JSON.stringify(rows));
//        }
//    });
//});

app.get(securedpath + '/getShiftkey', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var shift = url.parse(req.url, true).query['shifttype'];
    var zone = url.parse(req.url, true).query['zone'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var endDate = url.parse(req.url, true).query['endDate'];
    // console.log("for shift in charge values are " + shift + " " + zone+ " "+startDate);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @shift =?;set @zone =?;set @startDate =?;set @endDate =?;call usp_getShiftkey(@shift,@zone,@startDate,@endDate)", [shift, zone, startDate, endDate], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    //   console.log("Printing rows");
                    // console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.options('/checkassignedShiftDetails', supportCrossOriginScript);
app.post(securedpath + '/checkassignedShiftDetails', supportCrossOriginScript, function (req, res) {
    var zone = req.body.zoneKey;
    var start_date = req.body.StartDate;
    var end_date = req.body.EndDate;
    var shiftTypeKey = req.body.shiftTypeKey;
    var supervisor = req.body.supervisorKey;
    var metaupdatedby = req.body.employeekey;
     var OrganizationID = req.body.OrganizationID;
    // console.log("inside addSchedulingBy_shift " + start_date + " " + end_date + " " + shiftTypeKey + " " + supervisor + "  " + zone);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?;set @OrganizationID=?; call usp_checkassignedShiftDetails(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editEmp_scheduling " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));

                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllRooms', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?;call usp_RoomsGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllRooms " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteRoomById', supportCrossOriginScript);
app.post(securedpath + '/deleteRoomById', supportCrossOriginScript, function (req, res) {
//   var facilitykey = url.parse(req.url,true).query['facility'];
//   var floorkey = url.parse(req.url,true).query['floorkey'];
//   var zonekey = url.parse(req.url,true).query['zoneKey'];
//   var floortypekey = url.parse(req.url,true).query['floortype'];
//   var roomtypekey = url.parse(req.url,true).query['roomtype'];
    var room = url.parse(req.url, true).query['roomkey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @room=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_roomRemove(@room,@metaupdatedby,@OrganizationID)', [room, metaupdatedby,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("deleteRoomById.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getRoomById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var RoomKey = url.parse(req.url, true).query['roomKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @RoomKey=?;set @OrganizationID=?;call usp_RoomById(@RoomKey,@OrganizationID)', [RoomKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("usp_RoomById.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getUserEmail', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = url.parse(req.url, true).query['username'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?;set @empkey=?;set @OrganizationID=?;call usp_getUserEmail(@username,@empkey,@OrganizationID)', [username,empkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("usp_RoomById.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllRoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("getAllRoomType "+domainkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_roomTypeGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("domainkey "+JSON.stringify(rows));
                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});

app.options('/updateRoom', supportCrossOriginScript);
app.post(securedpath + '/updateRoom', supportCrossOriginScript, function (req, res) {
    var facilitykey = req.body.FacilityKey;
    var floorkey = req.body.FloorKey;
    var floortypekey = req.body.FloorTypeKey;
    var zonekey = req.body.ZoneKey;
    var roomtypekey = req.body.RoomTypeKey;
    var roomkey = req.body.RoomKey;
    var area = req.body.area;
    var roomname = req.body.RoomName;
    var Barcode = req.body.Barcode;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log("updateroom");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @floorkey=?; set @floortypekey=?; set @zonekey=?; set @roomtypekey=?; set @roomkey=?; set @area=?; set @roomname=?; set @metaupdatedby=?; set @Barcode=?; set @OrganizationID=?; call usp_roomUpdate(@facilitykey,@floorkey,@floortypekey,@zonekey,@roomtypekey,@roomkey,@area,@roomname,@metaupdatedby,@Barcode,@OrganizationID)', [facilitykey, floorkey, floortypekey, zonekey, roomtypekey, roomkey, area, roomname, metaupdatedby, Barcode, OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/addnewRoom', supportCrossOriginScript);
app.post(securedpath + '/addnewRoom', supportCrossOriginScript, function (req, res) {
    var facilitykey = req.body.FacilityKey;
    var floorkey = req.body.FloorKey;
    var floortypekey = req.body.FloorTypeKey;
    var zonekey = req.body.ZoneKey;
    var roomtypekey = req.body.RoomTypeKey;
    var roomkey = -99;
    var area = req.body.Area;
    var roomname = req.body.RoomName;
    var metaupdatedby = req.body.employeekey;
    var Barcode = req.body.Barcode;
    var OrganizationID = req.body.OrganizationID;
    // console.log("addnewRoom");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @floorkey=?; set @floortypekey=?; set @zonekey=?; set @roomtypekey=?; set @roomkey=?; set @area=?; set @roomname=?; set @metaupdatedby=?; set @Barcode=?; set @OrganizationID=?; call usp_roomAdd(@facilitykey,@floorkey,@floortypekey,@zonekey,@roomtypekey,@roomkey,@area,@roomname,@metaupdatedby,@Barcode,@OrganizationID)', [facilitykey, floorkey, floortypekey, zonekey, roomtypekey, roomkey, area, roomname, metaupdatedby, Barcode, OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomTypeById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomtypekey = url.parse(req.url, true).query['roomTypeKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomtypekey=?; set@OrganizationID=?; call usp_roomtypeById(@roomtypekey,@OrganizationID)', [roomtypekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateRoomType', supportCrossOriginScript);
app.post(securedpath + '/updateRoomType', supportCrossOriginScript, function (req, res) {
    var roomtypekey = req.body.RoomTypeKey;
    var roomtype = req.body.RoomTypeName;
    var metaupdatedby = req.body.employeekey;
    var metric = req.body.metric;
    var MetricType = req.body.MetricType;
    var MetricTypeValue = req.body.TypeValue;
     var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomtypekey=?; set @roomtype=?; set @metaupdatedby=?; set @metric=?; set @MetricType=?; set @MetricTypeValue=?; set@OrganizationID=?; call usp_roomtypeUpdate(@roomtypekey,@roomtype,@metaupdatedby,@metric,@MetricType,@MetricTypeValue,@OrganizationID)', [roomtypekey, roomtype, metaupdatedby, metric, MetricType, MetricTypeValue,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/addnewRoomtype', supportCrossOriginScript);
app.post(securedpath + '/addnewRoomtype', supportCrossOriginScript, function (req, res) {
    var roomtype = req.body.RoomTypeName;
    var metaupdatedby = req.body.employeekey;
    var metric = req.body.metric;
    var MetricType = req.body.MetricType;
    var MetricTypeValue = req.body.TypeValue;
    var OrganizationID = req.body.OrganizationID;
    // console.log("addnewRoomtype"+roomtype+".."+metaupdatedby);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomtype=?; set @metaupdatedby=?; set @metric=?; set @MetricType=?; set @MetricTypeValue=?;set @OrganizationID=?; call usp_roomtypeAdd(@roomtype,@metaupdatedby,@metric,@MetricType,@MetricTypeValue,@OrganizationID)', [roomtype, metaupdatedby, metric, MetricType, MetricTypeValue,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteRoomTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteRoomTypeById', supportCrossOriginScript, function (req, res) {
    var roomTypeKey = url.parse(req.url, true).query['roomTypeKey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_roomtypeRemove(@roomTypeKey,@metaupdatedby,@OrganizationID)', [roomTypeKey, metaupdatedby,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFacilityZoneById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facility = url.parse(req.url, true).query['key'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?; call usp_facilityZoneById(@fac)', [facility], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEquipmentTypeEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?;set @empkey=?;set @OrganizationID=?; call usp_equipmentTypeEquipmentGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage,empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log(".." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEquipmentKeyById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var equipmentKey = url.parse(req.url, true).query['equipmentKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentKey=?;set @OrganizationID=?; call usp_equipmentKeyByIdGet(@equipmentKey,@OrganizationID)', [equipmentKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteEquipmentById', supportCrossOriginScript);
app.post(securedpath + '/deleteEquipmentById', supportCrossOriginScript, function (req, res) {
    var equipmentKey = url.parse(req.url, true).query['EquipmentKey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentKey=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_equipmentRemove(@equipmentKey,@metaupdatedby,@OrganizationID)', [equipmentKey, metaupdatedby,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateEquipment', supportCrossOriginScript);
app.post(securedpath + '/updateEquipment', supportCrossOriginScript, function (req, res) {
    var Equipment_Key = req.body.EquipmentKey;
    var EquipmentType_Key = req.body.EquipmentTypeKey;
    var Equipment_Type = req.body.EquipmentType;
    var Equipment_Name = req.body.EquipmentName;
    var EquipmentDescription = req.body.EquipmentDescription;
    var metaupdatedby = req.body.employeekey;
    var eqbarcode = req.body.EquipmentBarcode;
    var OrganizationID = req.body.OrganizationID; 
    var FacilityKey = req.body.FacilityKey;
    var FloorKey = req.body.FloorKey;
    var barcodeINT = req.body.BarcodeINT;
    // console.log("inside updateEquipment " + Equipment_Key + " " + EquipmentType_Key + " " + Equipment_Type + " " + Equipment_Name);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Equipment_Key=?;set @EquipmentType_Key=?;set @Equipment_Type=?;set @Equipment_Name=?; set @EquipmentDescription=?; set @metaupdatedby=?;set @eqbarcode=?;set @facilityKey=?;set @floorKey=?;set @OrganizationID=?; set @barcodeINT=?; call usp_equipmentUpdate(@Equipment_Key,@EquipmentType_Key,@Equipment_Type,@Equipment_Name,@EquipmentDescription,@metaupdatedby,@eqbarcode,@facilityKey,@floorKey,@OrganizationID,@barcodeINT)', [Equipment_Key, EquipmentType_Key, Equipment_Type, Equipment_Name, EquipmentDescription, metaupdatedby, eqbarcode,FacilityKey,FloorKey,OrganizationID,barcodeINT], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    res.end("success");

                }
            });
        }
        connection.release();
    });
});

app.options('/addnewEquipment', supportCrossOriginScript);
app.post(securedpath + '/addnewEquipment', supportCrossOriginScript, function (req, res) {
    var equipmentType_key = req.body.EquipmentTypeKey;
    var Equipment = req.body.EquipmentName;
    var Equipmentdesc = req.body.EquipmentDescription;
    var metaupdatedby = req.body.employeekey;
    var eqbarcode = req.body.EquipmentBarcode;
    var OrganizationID = req.body.OrganizationID;
    var FacilityKey = req.body.FacilityKey;
    var FloorKey = req.body.FloorKey;
    var barcodeINT = req.body.BarcodeINT;
    console.log("----------addnewEquipment---------" + eqbarcode);
//    ;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentType_key=?;set @Equipment=?; set @Equipmentdesc=?; set @metaupdatedby=?;set @eqbarcode=?;set @facilityKey=?;set @floorKey=?;set @OrganizationID=?; set @barcodeINT=?; call usp_equipmentAdd(@equipmentType_key,@Equipment,@Equipmentdesc,@metaupdatedby,@eqbarcode,@facilityKey,@floorKey,@OrganizationID,@barcodeINT)', [equipmentType_key, Equipment, Equipmentdesc, metaupdatedby, eqbarcode,FacilityKey,FloorKey,OrganizationID,barcodeINT], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
                    //  console.log("ROWS" + JSON.stringify(rows[3][0]));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getEquipmentTypeKeyById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var equipmentTypeKey = url.parse(req.url, true).query['equipmentTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentTypeKey=?; set@OrganizationID=?; call usp_equipmentTypeKeyById(@equipmentTypeKey,@OrganizationID)', [equipmentTypeKey,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//              console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateEquipmentType', supportCrossOriginScript);
app.post(securedpath + '/updateEquipmentType', supportCrossOriginScript, function (req, res) {
    var EquipmentType = req.body.EquipmentType;
    var EquipmentTypeDescription = req.body.EquipmentTypeDescription;
    var EquipmentTypeKey = req.body.EquipmentTypeKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EquipmentType=?; set @EquipmentTypeDescription=?; set @EquipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeUpdate(@EquipmentType,@EquipmentTypeDescription,@EquipmentTypeKey,@metaupdatedby,@OrganizationID)', [EquipmentType, EquipmentTypeDescription, EquipmentTypeKey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//              console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.options('/addnewEquipmentType', supportCrossOriginScript);
app.post(securedpath + '/addnewEquipmentType', supportCrossOriginScript, function (req, res) {
    var EquipmentType = req.body.EquipmentType;
    var EquipmentTypeDescription = req.body.EquipmentTypeDescription;
    var EquipmentTypeKey = -99;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EquipmentType=?; set @EquipmentTypeDescription=?; set @EquipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeAdd(@EquipmentType,@EquipmentTypeDescription,@EquipmentTypeKey,@metaupdatedby,@OrganizationID)', [EquipmentType, EquipmentTypeDescription, EquipmentTypeKey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//              console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteEquipmentTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteEquipmentTypeById', supportCrossOriginScript, function (req, res) {
    var equipmentTypeKey = url.parse(req.url, true).query['equipmentTypeKey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeRemove(@equipmentTypeKey,@metaupdatedby,@OrganizationID)', [equipmentTypeKey, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//              console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.options('/addMeetingTraining', supportCrossOriginScript);
app.post(securedpath + '/addMeetingTraining', supportCrossOriginScript, function (req, res) {
    // console.log(req.body);
    var actionKey = req.body.actionKey;
    var eventhost = req.body.eventhost;
    var venue = req.body.venue;
    var MeetingNotes = req.body.MeetingNotes;
    var meetingDate = req.body.meetingDate;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var employeeKeyList = req.body.empKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log("addMeetingByAction " + actionKey + " ..." + eventhost + "..." + venue + " ..." + meetingDate + " ..." + startTime + " ..." + endTime + " .." + employeeKeyList);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actionKey=?; set @eventhost=?; set @venue=?;set @MeetingNotes=?; set @meetingDate=?; set @startTime=?; set @endTime=?; set @employeeKeyList=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_addEventByActionKey(@actionKey,@eventhost,@venue,@MeetingNotes,@meetingDate,@startTime,@endTime,@employeeKeyList,@metaupdatedby,@OrganizationID)', [actionKey, eventhost, venue, MeetingNotes, meetingDate, startTime, endTime, employeeKeyList, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/addMeetinTraingByNewEvent', supportCrossOriginScript);
app.post(securedpath + '/addMeetinTraingByNewEvent', supportCrossOriginScript, function (request, res) {
//    var eventhost = request.body.eventhost;
//    var venue = request.body.venue;
    var eventType = request.body.eventType;//
//    var MeetingNotes = request.body.MeetingNotes;
    var eventDescription = request.body.eventDescription;//
    var eventName = request.body.eventName;//
    var EmployeeKey = request.body.EmployeeKey;
         var OrganizationID = request.body.OrganizationID;
//    var meetingDate = request.body.meetingDate;
//    var startTime = request.body.startTime;
//    var endTime = request.body.endTime;
//    var employeeKeyList = request.body.empKey;
    // console.log(eventName + "," + eventDescription + "," + eventType + "," + venue);
    // console.log("addMeetingByAction_empKey ..." + eventhost + " ..." + meetingDate + " ..." + startTime + " ..." + endTime + " .." + employeeKeyList);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @eventType=?; set @eventName=?; set @eventDescription=?; set @EmployeeKey=?;set @OrganizationID=?; call usp_addEventOnly(@eventType,@eventName,@eventDescription,@EmployeeKey,@OrganizationID)', [eventType, eventName, eventDescription,EmployeeKey,OrganizationID], function (err, rows)
    {
        if (err) {
            console.log("Problem with MySQL" + err);
        } else
        {
//            console.log("ROWS" + JSON.stringify(rows));
                    console.log("ROWS" + JSON.stringify(rows[4]));
//                console.log("ROWS" + JSON.stringify(rows[3][0]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getEmployeeKeybyShiftTypeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shiftTypeKey = url.parse(req.url, true).query['shifttypekey'];
    var date1 = url.parse(req.url, true).query['date'];
    // console.log("inside ...shiftTypeKey..." + shiftTypeKey + "date1..." + date1);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftTypeKey=?;set @date1=?;call usp_getEmpKeysByShiftKey(@shiftTypeKey,@date1)', [shiftTypeKey, date1], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    //   console.log("Printing rows");
                    //   console.log("ROWS" + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getTemplateQuestions', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templateId = url.parse(req.url, true).query['templateId'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateId=?; set@OrganizationID=?;call usp_getTemplateQuestions(@templateId,@OrganizationID)', [templateId,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getInspectionorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionorder_Key = url.parse(req.url, true).query['InspectionorderKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("InspectionorderKey  is " + inspectionorder_Key);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @InspectionorderKey=?;set@OrganizationID=?; call usp_getInspectionorderByKey(@InspectionorderKey,@OrganizationID)', [inspectionorder_Key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getSupervisorInspectionView', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var to_date = url.parse(req.url, true).query['to_date'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("date  is " + to_date+"employeekey.."+employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @username=?; set@OrganizationID=?; call usp_getSupervisorInspectionView(@date,@username,@OrganizationID)', [to_date, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});
app.options('/uploadPhoto_Workorder', supportCrossOriginScript);
app.post(securedpath + '/uploadPhoto_Workorder', supportCrossOriginScript, function (req, res, file) {
    var fname = file;
    console.log("uploadPhoto_Workorder ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
    uploadPhoto(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file");
        }
        res.end();
    });

});
var Photostorage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("inside Photostorage");

        callback(null, '../webui/pho1');
        // use ./ inlocal and ../ in azure
    },
    filename: function (req, file, callback) {
        var fname = file.originalname;
        callback(null, fname);
        // console.log("success");
    }
});
var uploadPhoto = multer({storage: Photostorage}).single('userPhoto');



// var multer_middleare = multer({ dest: './pho1',
//     onFileUploadComplete: function (file) {
//         // after file is uploaded, upload it to remote server
//         var filename = file.name;

//         request({
//             method: 'PUT',
//             preambleCRLF: true,
//             postambleCRLF: true,
//             uri: 'ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot',
//             auth: {
//                 'user': 'trooworkapi\$trooworkapi',
//                 'pass': 'Zpe5XXJ8prnaCadHQwXoaRaYSMzcGjnNWlbfCqfTyvbWDtmxZhhGuGn2BETr',
//                 'sendImmediately': true
//             },
//             multipart: [
//                 { body: fs.createReadStream('./pho1/' + filename) }
//             ]
//         },
//         function (error, response, body) {
//             if (error) {
//                 return console.error('upload failed:', error);
//             }
//             console.log('Upload successful!  Server responded with:', body);
//         });
//     }
//     }).single('userPhoto');

//     app.post('/uploadfileworkorderphoto', function (req, res){
//         console.log("inside uploadfileworkorderphoto");
//            multer_middleare(req, res, function (err) {
//         if (err) {
//             return res.end("Error uploading file");
//         }
//         res.end();
//     });

// //    res.end("uploaded");
// });
// app.options('/uploadPhoto_Workorder', supportCrossOriginScript);
// app.post('/uploadPhoto_Workorder',supportCrossOriginScript, function (req, res, file) {
//     var fname = file;
//     // console.log("uploadPhoto_Workorder ");
//     uploadPhoto(req, res, function (err) {
//         if (err) {
//             return res.end("Error uploading file");
//         }
//         res.end();
//     });

// });
// var Photostorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         // var uploadUrl = 'http://troowork2.azurewebsites.net/pho1';
//         // callback(null, uploadUrl);
//          callback(null, 'ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/pho1');
//     },
//     filename: function (req, file, callback) {
//         var fname = file.originalname ;
//         callback(null, fname);
//         // console.log("success");
//     }
// });
// var uploadPhoto = multer({storage: Photostorage}).single('userPhoto');


//Barcode scan to complete workorder starts

app.get(securedpath + '/barcodeRoom_check', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
    var WorkorderKey = url.parse(req.url, true).query['wkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Barcode scan check: barcode and WD=" + barcode + " " + WorkorderKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @barcode =?;set @workdetail =?; set @OrganizationID =?;call usp_WorkorderStatusCheckByBarcode(@barcode,@workdetail,@OrganizationID)", [barcode, WorkorderKey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    // console.log(JSON.stringify(rows[2][0].res));
                    res.end(JSON.stringify(rows[3][0].res));
                }


            });
        }
        connection.release();
    });
});
app.get(securedpath + '/barcodeRoom', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
//    var employeekey = url.parse(req.url, true).query['empkey'];
    var workorderkey = url.parse(req.url, true).query['wkey'];
    var updatetype = url.parse(req.url, true).query['updatetype'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("barcodeRoom scan : WD=" + workorderkey + "..." + barcode + "..." + employeekey + "..." + updatetype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?;set @barcode=?; set @empkey=?; set @updatetype=?; set @OrganizationID=?;call usp_WorkorderStatusUpdateByBarcode(@workdetail,@barcode,@empkey,@updatetype,@OrganizationID)", [workorderkey, barcode, employeekey, updatetype,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //  console.log("Printing rows....  " + JSON.stringify(rows[2][0]));
//              console.log("ROWS " + JSON.stringify(rows[4][0]));
                    res.end(JSON.stringify(rows[5][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getScheduleDescription', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var key = url.parse(req.url, true).query['key'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['empkey'];
//    var workorderkey = url.parse(req.url, true).query['wkey'];
//    var updatetype = url.parse(req.url, true).query['updatetype'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    // console.log("barcodeRoom scan : WD=" + workorderkey + "..." + barcode + "..." + employeekey + "..." + updatetype);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @key =?; set @OrganizationID =?; call usp_getScheduleDescription(@key,@OrganizationID)", [key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    //  console.log("Printing rows....  " + JSON.stringify(rows[2][0]));
//              console.log("ROWS " + JSON.stringify(rows[4][0]));
                    res.end(JSON.stringify(rows[1][0]));
                }
            });
        }
        connection.release();
    });
});

//Barcode scan to complete workorder ends
app.options('/completionTime', supportCrossOriginScript);
app.post(securedpath + '/completionTime', supportCrossOriginScript, function (req, res)
{
//    var barcode = url.parse(req.url, true).query['barcode'];
//    var workorderKey = req.body.WorkorderKey;
//    var timetaken = req.body.Timetaken;
//    var metaupdatedby = req.body.EmployeeKey;
    // console.log("Completed time : WD=" + workorderKey + "time..." + timetaken);

    var Workorderkey = req.body.Workorderkey;
     var Timetaken = req.body.Timetaken;
      var EmployeeKey = req.body.EmployeeKey;
      var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @Workorderkey=?; set  @Timetaken=?; set @EmployeeKey=?;set @OrganizationID=?; call usp_workCompletionTime(@Workorderkey,@Timetaken,@EmployeeKey,@OrganizationID)", [Workorderkey,Timetaken,EmployeeKey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            //  console.log("Printing rows....  " + JSON.stringify(rows[2][0]));
            //   console.log("ROWS " + JSON.stringify(rows.res));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/workCompleted', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var work_det_key = url.parse(req.url, true).query['wkey'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("work completed=" + work_det_key + "..." + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?; set @employeekey=?; set @OrganizationID=?;call usp_WorkorderStatusUpdate(@workdetail,@employeekey,@OrganizationID)", [work_det_key, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
//            console.log("workCompleted " + JSON.stringify(rows[2][0]));
                    res.end(JSON.stringify(rows[3][0]));
                }
            });
        }
        connection.release();
    });
});
//Photo upload starts
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}


app.get(securedpath + '/updateWorkorderByPhoto', function (req, res)
{
    res.header("Access-Control-Allow-Origin", "*");
    var pho = url.parse(req.url, true).query['pho'];
    var wdkey = url.parse(req.url, true).query['wkey'];
//    var imagename = url.parse(req.url, true).query['imagename'];
//     var imageBuffer = decodeBase64Image(imagename);
    // console.log("inside server photodate = " + imagename);
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?;call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID)", [wdkey, pho, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    // console.log("pho1 " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3][0]));
                }

            });
        }
        connection.release();
    });
});

//Photo upload ends
app.options('/saveinspectedQuestions', supportCrossOriginScript);
app.post(securedpath + '/saveinspectedQuestions', supportCrossOriginScript, function (req, res) {
    var inspectionnotes = url.parse(req.url, true).query['inspectionnotes'];
    var templateQstnValues = url.parse(req.url, true).query['templateQstnValues'];
    var templateid = url.parse(req.url, true).query['templateid'];
    var inspectionkey = url.parse(req.url, true).query['inspectionkey'];
    var questionid = url.parse(req.url, true).query['questionid'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log(".." + inspectionnotes + ".." + templateQstnValues + ".." + templateid + "..." + inspectionkey + ".." + questionid);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionnotes=?; set @templateQstnValues=?; set @templateid=?; set @inspectionkey=?; set @questionid=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_saveInspectedValues(@inspectionnotes,@templateQstnValues,@templateid,@inspectionkey,@questionid,@metaupdatedby,@OrganizationID)', [inspectionnotes, templateQstnValues, templateid, inspectionkey, questionid, metaupdatedby,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("saveinspectedQuestions...from server.." + JSON.stringify(rows[7]));
            res.end(JSON.stringify(rows[7]));
        }
         });
        }  
        connection.release();
    });
});

app.options('/updateEditedTemplateQuestion', supportCrossOriginScript);
app.post(securedpath + '/updateEditedTemplateQuestion', supportCrossOriginScript, function (req, res) {
//    var inspectionnotes = url.parse(req.url, true).query['inspectionnotes'];
//    var templateQstnValues = url.parse(req.url, true).query['templateQstnValues'];
    var templateid = url.parse(req.url, true).query['templateid'];
//    var inspectionkey = url.parse(req.url, true).query['inspectionkey'];
    var questionid = url.parse(req.url, true).query['questionid'];
    var metaupdatedby = url.parse(req.url, true).query['empkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log(".." + inspectionnotes + ".." + templateQstnValues + ".." + templateid + "..." + inspectionkey + ".." + questionid);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;  set @questionid=?;set @metaupdatedby=?; set@OrganizationID=?; call usp_updateEditedTemplateQuestion(@templateid,@questionid,@metaupdatedby,@OrganizationID)', [templateid, questionid,metaupdatedby,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("updateEditedTemplateQuestion...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.options('/insertEditedTemplateQuestion', supportCrossOriginScript);
app.post(securedpath + '/insertEditedTemplateQuestion', supportCrossOriginScript, function (req, res) {
//    var inspectionnotes = url.parse(req.url, true).query['inspectionnotes'];
//    var templateQstnValues = url.parse(req.url, true).query['templateQstnValues'];
    var templateid = url.parse(req.url, true).query['templateid'];
//    var inspectionkey = url.parse(req.url, true).query['inspectionkey'];
    var questionid = url.parse(req.url, true).query['questionid'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
//    console.log(".." + inspectionnotes + ".." + templateQstnValues + ".." + templateid + "..." + inspectionkey + ".." + questionid);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;  set @questionid=?; set @empKey=?; set@OrganizationID=?; call usp_insertEditedTemplateQuestion(@templateid,@questionid,@empKey,@OrganizationID)', [templateid, questionid,empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("insertEditedTemplateQuestion...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});


app.options('/inspectionCompleted', supportCrossOriginScript);
app.post(securedpath + '/inspectionCompleted', supportCrossOriginScript, function (req, res) {
    var inspectionorderkey = req.body.InspectionorderKey;
    var metaupdatedby = req.body.EmployeeKey;
    var OrganizationID = req.body.OrganizationID;
    console.log("inspectionCompleted " + inspectionorderkey + ".." + metaupdatedby);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionorderkey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_inspectionCompleted(@inspectionorderkey,@metaupdatedby,@OrganizationID)', [inspectionorderkey, metaupdatedby,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
        });
        }
        connection.release();
    });
});



app.get(securedpath + '/getinspectionedDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionorderkey = url.parse(req.url, true).query['inspectionorder'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionorderkey=?; call usp_getinspectionedDetails(@inspectionorderkey)', [inspectionorderkey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("getinspectionedDetails...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllAvailableShifts', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shifttypekey = url.parse(req.url, true).query['shifttypekey'];
    var zonekey = url.parse(req.url, true).query['zonekey'];
    var startdate = url.parse(req.url, true).query['startdate'];
    var enddate = url.parse(req.url, true).query['enddate'];
    var empKey = url.parse(req.url, true).query['empKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("--------------");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shifttypekey=?; set @zonekey=?;set @startdate=?;set @enddate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllAvailableShifts(@shifttypekey,@zonekey,@startdate,@enddate,@empKey,@OrganizationID)', [shifttypekey, zonekey, startdate, enddate,empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllAvailableShifts...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[6]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/getWorkorderImageByKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderkey = url.parse(req.url, true).query['key'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?; set @employeekey=?; set@OrganizationID=?; call usp_workorderPhotoGetByKey(@workorderkey,@employeekey,@OrganizationID)', [workorderkey, employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getWorkorderImageByKey...from server.." + JSON.stringify(rows[2][0]));
            res.end(JSON.stringify(rows[3][0]));
        }
       });
        } 
        connection.release();
    });
});

app.get(securedpath + '/checkUniqueBarcode', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @barcode=?; call usp_checkingForUniqueBarcode(@barcode)', [barcode], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUniqueBarcode...from server.." + JSON.stringify(rows[2][0]));
                    res.end(JSON.stringify(rows[2][0]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/checkforcheckForWorkOrderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderTypeName = url.parse(req.url, true).query['WorkorderTypeName'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeName=?; set @employeekey=?; set @OrganizationID=?;call usp_checkforcheckForWorkOrderType(@WorkorderTypeName,@employeekey,@OrganizationID)', [WorkorderTypeName,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllAvailableShifts...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/checkforEmployeeNumber', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Employeenumber = url.parse(req.url, true).query['Employeenumber'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Employeenumber=?;set @employeekey=?;set @OrganizationID=?; call usp_checkforEmployeeNumber(@Employeenumber,@employeekey,@OrganizationID)', [Employeenumber,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllAvailableShifts...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/checkEmpNumberForSuperAdmin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Employeenumber = url.parse(req.url, true).query['Employeenumber'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Employeenumber=?;set @OrganizationID=?; call usp_checkEmpNumberForSuperAdmin(@Employeenumber,@OrganizationID)', [Employeenumber,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllAvailableShifts...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/assignChangesForWork', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerkey = url.parse(req.url, true).query['managerkey'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var batchkey = url.parse(req.url, true).query['batchkey'];
    var batchdesp = url.parse(req.url, true).query['batchdesp'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @managerkey=?;set @empkey=?;set @batchkey=?;set @batchdesp=?;set @OrganizationID=?; call usp_assignChangesForWork(@managerkey,@empkey,@batchkey,@batchdesp,@OrganizationID)', [managerkey,empkey,batchkey,batchdesp,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("assignChangesForWork...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/checkUniqueBarcode_Updation', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomkey = url.parse(req.url, true).query['roomkey'];
    var barcode = url.parse(req.url, true).query['barcode'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomkey=?; set @barcode=?; set @empkey=?;set @OrganizationID=?; call usp_checkingForUniqueBarcode_update(@roomkey,@barcode,@empkey,@OrganizationID)', [roomkey, barcode, empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUniqueBarcode...from server.." + JSON.stringify(rows[4][0]));
                    res.end(JSON.stringify(rows[4][0]));
                }
            });
        }
        connection.release();
    });
});
app.options(securedpath + '/organizationAdd', supportCrossOriginScript);
app.post(securedpath + '/organizationAdd', supportCrossOriginScript, function (req, res) {

    var OrganizationName = req.body.OrganizationName;
    var OrganizationDescription = req.body.OrganizationDescription;
    var Location = req.body.Location;
    var State = req.body.State;
    var Country = req.body.Country;
    var MetaUpdatedBy = req.body.MetaUpdatedBy;
    var TenantName = req.body.TenantName;
    var OrganizationEmail = req.body.OrganizationEmail;
    var TenantID = req.body.TenantID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationName=?; set @OrganizationDescription=?; set @Location=?; set @State=?; set @Country=?; set @MetaUpdatedBy=?; set @TenantName=?; set @OrganizationEmail=?; set @TenantID=?; call usp_organizationAdd(@OrganizationName,@OrganizationDescription,@Location,@State,@Country,@MetaUpdatedBy,@TenantName,@OrganizationEmail,@TenantID)', [OrganizationName, OrganizationDescription, Location, State, Country, MetaUpdatedBy, TenantName, OrganizationEmail, TenantID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("organizationAdd...from server.." + JSON.stringify(rows[9]));
                    res.end(JSON.stringify(rows[9]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getOrganizationDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var pageNumber = url.parse(req.url, true).query['pageNumber'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @itemsPerPage=?; set @pageNumber=?; call usp_OrganizationGetAllDetails(@itemsPerPage,@pageNumber)', [itemsPerPage, pageNumber], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getinspectionedDetails...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getOrganizationDetailsByID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_OrganizationGetDetailsByID(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("OrganizationID...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1][0]));
                }
            });
        }
        connection.release();
    });
});

app.options(securedpath + '/deleteOrganizationDetailsByID', supportCrossOriginScript);
app.post(securedpath + '/deleteOrganizationDetailsByID', supportCrossOriginScript, function (req, res) {

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var metaUpdatedBy = url.parse(req.url, true).query['metaUpdatedBy'];
    console.log(OrganizationID + "..." + metaUpdatedBy);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @metaUpdatedBy=?; call usp_organizationRemove(@OrganizationID,@metaUpdatedBy)', [OrganizationID, metaUpdatedBy], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("deleteOrganizationDetailsByID");
                    console.log("deleteOrganizationDetailsByID...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});

app.options(securedpath + '/updateOrganizationDetailsByID', supportCrossOriginScript);
app.post(securedpath + '/updateOrganizationDetailsByID', supportCrossOriginScript, function (req, res) {

    var OrganizationName = req.body.OrganizationName;
    var OrganizationDescription = req.body.OrganizationDescription;
    var Location = req.body.Location;
    var State = req.body.State;
    var Country = req.body.Country;
    var MetaUpdatedBy = req.body.MetaUpdatedBy;
    var OrganizationID = req.body.OrganizationID;
    var TenantName = req.body.TenantName;
    var OrganizationEmail = req.body.OrganizationEmail;
    var TenantID = req.body.TenantID;
    console.log(OrganizationName + "..." + OrganizationDescription + "..." + OrganizationID + ".." + MetaUpdatedBy + ".." + Country + "..." + State + ".." + Location);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationName=?; set @OrganizationDescription=?; set @Location=?; set @State=?; set @Country=?; set @MetaUpdatedBy=?; set @OrganizationID=?; set @TenantName=?; set @OrganizationEmail=?; set @TenantID=?; call usp_organizationUpdate(@OrganizationName,@OrganizationDescription,@Location,@State,@Country,@MetaUpdatedBy,@OrganizationID,@TenantName,@OrganizationEmail,@TenantID)', [OrganizationName, OrganizationDescription, Location, State, Country, MetaUpdatedBy, OrganizationID, TenantName, OrganizationEmail, TenantID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("updateOrganizationDetailsByID");
                    console.log("updateOrganizationDetailsByID...from server.." + JSON.stringify(rows[10]));
                    res.end(JSON.stringify(rows[10]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllOrganization', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_OrganizationGet(@OrganizationID)',[OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("usp_OrganizationGet...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getOrganizationforAdmin', function (req, res) {
    var Employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Employeekey=?;set @OrganizationID=?; call usp_getOrganizationforAdmin(@Employeekey,@OrganizationID)', [Employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log(" XXXXXXXXXXXXXXXXXXXXXX getOrganizationforAdmin...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getManagerOrganizationID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerKey = url.parse(req.url, true).query['managerKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @managerKey=?; set @OrganizationID=?; call usp_ManagerOrganizationIDGet(@managerKey,@OrganizationID)', [managerKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("usp_ManagerOrganizationIDGet...from server.." + JSON.stringify(rows[2][0]));
            res.end(JSON.stringify(rows[2][0]));
        }
            });
        }
        connection.release();
    });
});
//Jeffy code Ends

/*
 * 
 * Reconstructing using the cloud db for troowork2- Aneesh
 */
app.get(securedpath + '/allWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['workordertypes', empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/checkRoomInWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var wkey = url.parse(req.url, true).query['wkey'];
    var rkey = url.parse(req.url, true).query['rkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;set @OrganizationID=?;call usp_checkRoomInWorkOrder(@empkey,@wkey,@rkey,@OrganizationID)", [empkey, wkey, rkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/addRoomInWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var wkey = url.parse(req.url, true).query['wkey'];
    var rkey = url.parse(req.url, true).query['rkey'];
  var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;set @OrganizationID=?;call usp_addRoomInWorkOrder(@empkey,@wkey,@rkey,@OrganizationID)", [empkey, wkey, rkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkRoomFacilityInWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var wkey = url.parse(req.url, true).query['wkey'];
    var rkey = url.parse(req.url, true).query['rkey'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;call usp_checkRoomFacilityInWorkOrder(@empkey,@wkey,@rkey)", [empkey, wkey, rkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allequiptype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['equipmenttypes', empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log("AllFacilities " + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
        res.end();
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/domainvaluesByKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var domain = url.parse(req.url, true).query['domain'];
    var key = url.parse(req.url, true).query['key'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var filter;
    // console.log("DOMAIN AND KEY " + domain);
    switch (domain)
    {
        case 'facilities':
            filter = 'facilities';
            break;
        case 'equipments':
            filter = 'equipmenttypes';
            break;
        case 'facilityOnly':
            filter = 'facilityOnly';
            break;
        default:
            filter = 'roomtypes';
    }
    // console.log("Fac key for floo and filter " + key + " " + filter);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query('set @key1=?;set @key2=?;set @key3=?;set @key4=?;call usp_domainValuesByKeysGet(@key1,@key2,@key3,@key4)', [domain, '', filter, key], function (err, rows) {
              connection.query('set @key1=?;set @key2=?; set @OrganizationID=?; call usp_domainValuesByKeysAlternative(@key1,@key2,@OrganizationID)', [filter,key,OrganizationID], function (err, rows) {

           if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log("domainvaluesByKey " + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/allemployees', function (req, res) {//empkey

    console.log("Called employyee list fetcjh 2017");
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID=?;call usp_properEmployeeList(@key,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {
//            console.log("ALL EMPL FROM EMP KEY  " + employeekey + "  " + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/employeeForManager', function (req, res) {//empkey

    console.log("Called employyee list fetcjh 2017");
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID= ?; call usp_employeeForManager(@key,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {
//            console.log("ALL EMPL FROM EMP KEY  " + employeekey + "  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allshifttype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = 100;
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['shifttypes', empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log("Allshiftes " + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
      });
        }  
        connection.release();
    });
});
app.get(securedpath + '/allpriority', function (req, res) {
    console.log("Called /allpriority  list fetcjh 2017");
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = 100;
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['priorities', empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("Allprioo " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewworkorder_FilterByRoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var filter = url.parse(req.url, true).query['filter'];
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var key = url.parse(req.url, true).query['key'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    // console.log("filter and key are " + empkey + filter + " " + key + "  " + on_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?; set @facilitykey=?;set @OrganizationID=?; call usp_workordersViewbyRoomType(@empk,@filter,@key,@ondate,@facilitykey,@OrganizationID)", [empkey, filter, key, on_DT, facilitykey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/roomByFacility_Floor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("keys for zone" + fkey + " " + flkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @fkey=?; set @flkey=?;set @OrganizationID=?; call usp_getRoomByFacility_Floor(@fkey,@flkey,@OrganizationID)", [fkey, flkey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            //  console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/roomtypeByFacility_Floor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("Fac key for roomtypene" + fkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?; set @flkey=?; set @OrganizationID=?;call usp_getRoomtypeByFacility_Floor(@fkey,@flkey,@OrganizationID)", [fkey, flkey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            //  console.log(JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
    });
     }
        connection.release();
    });
});
app.options('/addNewWorkorder', supportCrossOriginScript);
app.post(securedpath + '/addNewWorkorder', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var workorderkey = newWOObj.workorderkey;
    console.log("server new WO " + newWOObj.workordertypekey);
    var workordertypekey = newWOObj.workordertypekey;
    console.log("inside server wot= " + workordertypekey);
    var equipmentkey = newWOObj.equipmentkey;
    console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = newWOObj.roomkeys;
    var facilitykeys = newWOObj.facilitykeys;
    var floorkeys = newWOObj.floorkeys;
    var zonekeys = newWOObj.zonekeys;
    var roomtypekeys = newWOObj.roomtypekeys;
    console.log("inside server roomkey= " + roomkeys);
    var employeekey = newWOObj.employeekey;
    console.log("inside server empkey= " + employeekey);
    var priority = newWOObj.priority;
    console.log("inside server priority= " + priority);
    var fromdate = newWOObj.fromdate;
    console.log("inside server fromdate= " + fromdate);
    var todate = newWOObj.todate;
    console.log("inside server todate= " + todate);
    var intervaltype = newWOObj.intervaltype;
    console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = newWOObj.repeatinterval;
    console.log("inside server repeatinterval= " + repeatinterval);
    var occursonday = newWOObj.occursonday;
    console.log("inside server occursonday= " + occursonday);
    var occursontime = newWOObj.occursontime;
    console.log("inside server occursontime= " + occursontime);
    var occurstype = newWOObj.occurstype;
    console.log("inside server occurstype= " + occurstype);
    var workordernote = newWOObj.workordernote;
    var isbar = newWOObj.isbar;
    var isphoto = newWOObj.isphoto;
    var metaupdatedby = newWOObj.metaupdatedby;
     var OrganizationID = newWOObj.OrganizationID;
    //console.log("****************metaupdatedby************");
    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys + " occursontime " + occursontime);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?;call usp_workordersAdd(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys,OrganizationID], function (err, res)
            {
                if (err) {
                    console.log(err);
                }
                // console.log(JSON.stringify(res));
            });
            res.end("success");
        }
        connection.release();
    });

});


app.options('/addworkorderSchedule', supportCrossOriginScript);
app.post(securedpath + '/addworkorderSchedule', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var scheduleKey = newWOObj.scheduleKey;
    console.log("server new WO " + newWOObj.scheduleKey);
    var workorderkey = newWOObj.workorderkey;
    console.log("server new WO " + newWOObj.workorderkey);
    var workordertypekey = newWOObj.workordertypekey;
    console.log("inside server wot= " + workordertypekey);
    var equipmentkey = newWOObj.equipmentkey;
    console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = newWOObj.roomkeys;
    var facilitykeys = newWOObj.facilitykeys;
    var floorkeys = newWOObj.floorkeys;
    var zonekeys = newWOObj.zonekeys;
    var roomtypekeys = newWOObj.roomtypekeys;
    console.log("inside server roomkey= " + roomkeys);
    var employeekey = newWOObj.employeekey;
    console.log("inside server empkey= " + employeekey);
    var priority = newWOObj.priority;
    console.log("inside server priority= " + priority);
    var fromdate = newWOObj.fromdate;
    console.log("inside server fromdate= " + fromdate);
    var todate = newWOObj.todate;
    console.log("inside server todate= " + todate);
    var intervaltype = newWOObj.intervaltype;
    console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = newWOObj.repeatinterval;
    console.log("inside server repeatinterval= " + repeatinterval);
    var occursonday = newWOObj.occursonday;
    console.log("inside server occursonday= " + occursonday);
    var occursontime = newWOObj.occursontime;
    console.log("inside server occursontime= " + occursontime);
    var occurstype = newWOObj.occurstype;
    console.log("inside server occurstype= " + occurstype);
    var workordernote = newWOObj.workordernote;
    var isbar = newWOObj.isbar;
    var isphoto = newWOObj.isphoto;
    var metaupdatedby = newWOObj.metaupdatedby;
     var OrganizationID = newWOObj.OrganizationID;
    //console.log("****************metaupdatedby************");
    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys + " occursontime " + occursontime);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scheduleKey=?; set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?;set @OrganizationID=?; call usp_BatchScheduleAdd(@scheduleKey,@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [scheduleKey,workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys,OrganizationID], function (err, res)
    {
        if (err) {
            console.log(err);
        }
        // console.log(JSON.stringify(res));
    });
    res.end("success");
    }
        connection.release();
    });

});

app.options('/addworkorderwithEquipment', supportCrossOriginScript);
app.post(securedpath + '/addworkorderwithEquipment', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var workorderkey = newWOObj.workorderkey;
    console.log("server new WO " + newWOObj.workordertypekey);
    var workordertypekey = newWOObj.workordertypekey;
    console.log("inside server wot= " + workordertypekey);
    var equipmentkey = newWOObj.equipmentkey;
    console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = newWOObj.roomkeys;
    var facilitykeys = newWOObj.facilitykeys;
    var floorkeys = newWOObj.floorkeys;
    var zonekeys = newWOObj.zonekeys;
    var roomtypekeys = newWOObj.roomtypekeys;
    console.log("inside server roomkey= " + roomkeys);
    var employeekey = newWOObj.employeekey;
    console.log("inside server empkey= " + employeekey);
    var priority = newWOObj.priority;
    console.log("inside server priority= " + priority);
    var fromdate = newWOObj.fromdate;
    console.log("inside server fromdate= " + fromdate);
    var todate = newWOObj.todate;
    console.log("inside server todate= " + todate);
    var intervaltype = newWOObj.intervaltype;
    console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = newWOObj.repeatinterval;
    console.log("inside server repeatinterval= " + repeatinterval);
    var occursonday = newWOObj.occursonday;
    console.log("inside server occursonday= " + occursonday);
    var occursontime = newWOObj.occursontime;
    console.log("inside server occursontime= " + occursontime);
    var occurstype = newWOObj.occurstype;
    console.log("inside server occurstype= " + occurstype);
    var workordernote = newWOObj.workordernote;
    var isbar = newWOObj.isbar;
    var isphoto = newWOObj.isphoto;
    var metaupdatedby = newWOObj.metaupdatedby;
    var OrganizationID = newWOObj.OrganizationID;
    //console.log("****************metaupdatedby************");
    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?;call usp_workordersAddwithEquipment(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys,OrganizationID], function (err, res)
            {
                if (err) {
                    console.log(err);
                }
                // console.log(JSON.stringify(res));
            });
            res.end("success");
        }
        connection.release();
    });

});


app.options('/addworkorderSchedulewithEquipment', supportCrossOriginScript);
app.post(securedpath + '/addworkorderSchedulewithEquipment', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var scheduleKey = newWOObj.scheduleKey;
    console.log("server new WO " + newWOObj.scheduleKey);
    var workorderkey = newWOObj.workorderkey;
    console.log("server new WO " + newWOObj.workorderkey);
    var workordertypekey = newWOObj.workordertypekey;
    console.log("inside server wot= " + workordertypekey);
    var equipmentkey = newWOObj.equipmentkey;
    console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = newWOObj.roomkeys;
    var facilitykeys = newWOObj.facilitykeys;
    var floorkeys = newWOObj.floorkeys;
    var zonekeys = newWOObj.zonekeys;
    var roomtypekeys = newWOObj.roomtypekeys;
    console.log("inside server roomkey= " + roomkeys);
    var employeekey = newWOObj.employeekey;
    console.log("inside server empkey= " + employeekey);
    var priority = newWOObj.priority;
    console.log("inside server priority= " + priority);
    var fromdate = newWOObj.fromdate;
    console.log("inside server fromdate= " + fromdate);
    var todate = newWOObj.todate;
    console.log("inside server todate= " + todate);
    var intervaltype = newWOObj.intervaltype;
    console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = newWOObj.repeatinterval;
    console.log("inside server repeatinterval= " + repeatinterval);
    var occursonday = newWOObj.occursonday;
    console.log("inside server occursonday= " + occursonday);
    var occursontime = newWOObj.occursontime;
    console.log("inside server occursontime= " + occursontime);
    var occurstype = newWOObj.occurstype;
    console.log("inside server occurstype= " + occurstype);
    var workordernote = newWOObj.workordernote;
    var isbar = newWOObj.isbar;
    var isphoto = newWOObj.isphoto;
    var metaupdatedby = newWOObj.metaupdatedby;
    var OrganizationID = newWOObj.OrganizationID;
    //console.log("****************metaupdatedby************");
    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scheduleKey=?; set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?;set @OrganizationID=?; call usp_addworkorderSchedulewithEquipment(@scheduleKey,@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [scheduleKey,workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys,OrganizationID], function (err, res)
    {
        if (err) {
            console.log(err);
        }
        // console.log(JSON.stringify(res));
    });
    res.end("success");
    }
        connection.release();
    });

});

app.post(securedpath + '/workorderByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var workorderStatusKey = newWOObj.workorderStatusKey;
    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
    var workorderTypeKey = newWOObj.workorderTypeKey;
    console.log("inside server workorderTypeKey= " + workorderTypeKey);
    var BatchScheduleNameKey = newWOObj.BatchScheduleNameKey;
     var OrganizationID = newWOObj.OrganizationID;
//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;  set @BatchScheduleNameKey=?; set @OrganizationID=?;  call usp_workorderByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@BatchScheduleNameKey,@OrganizationID)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, BatchScheduleNameKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[13]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/viewinspectionCountAllFilter', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
//    var workorderStatusKey = newWOObj.workorderStatusKey;
//    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var employeekey = newWOObj.employeekey;
    console.log("inside server employeekey= " + employeekey);
    var tempid = newWOObj.tempid;
    console.log("inside server tempid= " + tempid);


//    console.log("----------viewinspectionCountAllFilter---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @employeekey=?; set @tempid=?;call usp_viewinspectionCountAllFilter(@manager,@workorderDate,@workorderDate2,@employeekey,@tempid)", [manager, workorderDate, workorderDate2, employeekey, tempid], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderScheduleByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var workorderStatusKey = newWOObj.workorderStatusKey;
    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
    var workorderTypeKey = newWOObj.workorderTypeKey;
    console.log("inside server workorderTypeKey= " + workorderTypeKey);
    var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
    console.log("inside server batchScheduleNameKey= " + batchScheduleNameKey);
 var OrganizationID = newWOObj.OrganizationID;
//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;set @batchScheduleNameKey=?;set @OrganizationID=?;call usp_workorderScheduleByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@batchScheduleNameKey,@OrganizationID)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey,batchScheduleNameKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[13]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderReportByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var workorderStatusKey = newWOObj.workorderStatusKey;
    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
     var OrganizationID = newWOObj.OrganizationID;
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @OrganizationID=?;call usp_workorderReportByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@OrganizationID)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[11]));
        }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/barcodeReportByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var OrganizationID = newWOObj.OrganizationID;
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID=?;call usp_barcodeReportByallFilters(@manager,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [manager, facilitykey, roomTypeKey, floorKey, zoneKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/viewRoomsByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
//    var workorderStatusKey = newWOObj.workorderStatusKey;
//    console.log("server new workorderStatusKey " + workorderStatusKey);
//    var workorderDate = newWOObj.workorderDate;
//    console.log("server new workorderDate " + newWOObj.workorderDate);
//    var workorderDate2 = newWOObj.workorderDate2;
//    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var floorTypeKey = newWOObj.floorTypeKey;
    console.log("inside server floortype= " + floorTypeKey);
    var OrganizationID = newWOObj.OrganizationID;
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @floorTypeKey=?;set @OrganizationID=?;call usp_viewRoomsByallFilters(@manager,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@floorTypeKey,@OrganizationID)", [manager, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, floorTypeKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderEmployeeByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
//    var workorderStatusKey = newWOObj.workorderStatusKey;
//    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
//    var roomKey = newWOObj.roomKey;
//     console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
      var OrganizationID = newWOObj.OrganizationID;
//    var employeekey = newWOObj.employeeKey;
//    console.log("inside server empkey= " + employeekey);
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID =?;call usp_workorderEmployeeByallFilters(@manager,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [manager, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, zoneKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});
app.options('/addQuickworkorder', supportCrossOriginScript);
app.post(securedpath + '/addQuickworkorder', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var workorderkey = newWOObj.workorderkey;
    console.log("server new WO " + newWOObj.workordertypekey);
    var workordertypekey = newWOObj.workordertypekey;
    console.log("inside server wot= " + workordertypekey);
    var equipmentkey = newWOObj.equipmentkey;
    console.log("inside server equipmentkey= " + equipmentkey);
    var roomkeys = newWOObj.roomkeys;
    var facilitykeys = newWOObj.facilitykeys;
    var floorkeys = newWOObj.floorkeys;
    var zonekeys = newWOObj.zonekeys;
    var roomtypekeys = newWOObj.roomtypekeys;
    console.log("inside server roomkey= " + roomkeys);
    var employeekey = newWOObj.employeekey;
    console.log("inside server empkey= " + employeekey);
    var priority = newWOObj.priority;
    console.log("inside server priority= " + priority);
    var fromdate = newWOObj.fromdate;
    console.log("inside server fromdate= " + fromdate);
    var todate = newWOObj.todate;
    console.log("inside server todate= " + todate);
    var intervaltype = newWOObj.intervaltype;
    console.log("inside server intervaltype= " + intervaltype);
    var repeatinterval = newWOObj.repeatinterval;
    console.log("inside server repeatinterval= " + repeatinterval);
    var occursonday = newWOObj.occursonday;
    console.log("inside server occursonday= " + occursonday);
    var occursontime = newWOObj.occursontime;
    console.log("inside server occursontime= " + occursontime);
    var occurstype = newWOObj.occurstype;
    console.log("inside server occurstype= " + occurstype);
    var workordernote = newWOObj.workordernote;
    var isbar = newWOObj.isbar;
    var isphoto = newWOObj.isphoto;
    var metaupdatedby = newWOObj.metaupdatedby;
    var OrganizationID = req.body.OrganizationID;
    //console.log("****************metaupdatedby************");
    console.log("****************metaupdatedby************" + metaupdatedby + "ZZZZZZ " + isphoto);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; call usp_QuickworkorderAdd(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys,OrganizationID], function (err, res)
            {
                if (err) {
                    console.log(err);
                }
                // console.log(JSON.stringify(res));
            });
            res.end("success");
        }
        connection.release();
    });

});

//app.options('/addQuickworkorder', supportCrossOriginScript);
//app.post(securedpath + '/addQuickworkorder', supportCrossOriginScript, function (req, res) {
//
//    var newWOObj = {};
//    newWOObj = req.body;
//    var workorderkey = newWOObj.workorderkey;
//    // console.log("server new WO " + newWOObj.workordertypekey + user_return);
//    var workordertypekey = newWOObj.workordertypekey;
//    // console.log("inside server wot= " + workordertypekey);
////    var equipmentkey = newWOObj.equipmentkey;
//    // console.log("inside server equipmentkey= " + equipmentkey);
//    var roomkeys = newWOObj.roomkeys;
////    var facilitykeys = newWOObj.facilitykeys;
////    var floorkeys = newWOObj.floorkeys;
////    var zonekeys = newWOObj.zonekeys;
////    var roomtypekeys = newWOObj.roomtypekeys;
//    // console.log("inside server roomkey= " + roomkeys);
//    var employeekey = newWOObj.employeekey;
//    // console.log("inside server empkey= " + employeekey);
//    var priority = newWOObj.priority;
//    // console.log("inside server priority= " + priority);
//    var fromdate = newWOObj.fromdate;
//    // console.log("inside server fromdate= " + fromdate);
////    var todate = newWOObj.todate;
////    // console.log("inside server todate= " + todate);
////    var intervaltype = newWOObj.intervaltype;
////    // console.log("inside server intervaltype= " + intervaltype);
////    var repeatinterval = newWOObj.repeatinterval;
//    // console.log("inside server repeatinterval= " + repeatinterval);
////    var occursonday = newWOObj.occursonday;
////    // console.log("inside server occursonday= " + occursonday);
////    var occursontime = newWOObj.occursontime;
////    // console.log("inside server occursontime= " + occursontime);
////    var occurstype = newWOObj.occurstype;
//    // console.log("inside server occurstype= " + occurstype);
//    var workordernote = newWOObj.workordernote;
//    var isbar = newWOObj.isbar;
//    var isphoto = newWOObj.isphoto;
//    var metaupdatedby = newWOObj.metaupdatedby;
//    //console.log("****************metaupdatedby************");
//    console.log("****************metaupdatedby************" + metaupdatedby);
////    console.log("3 VAlues are tot=16 " + note + " " + isbar + " " + isphoto);
//    pool.query('set @workorderkey=?;set @workordertypekey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?;  set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?;  call usp_QuickworkorderAdd(@workorderkey,@workordertypekey,@roomkeys,@employeekey,@priority,@fromdate,@workordernotes,@isbar,@isphoto,@metaupdatedby) ', [workorderkey, workordertypekey, roomkeys, employeekey, priority, fromdate, workordernote, isbar, isphoto, metaupdatedby], function (err, res)
//    {
//        if (err) {
//            console.log(err);
//        }
//        // console.log(JSON.stringify(res));
//    });
//    res.end("success");
//
//});

app.options('/addworkordertype', supportCrossOriginScript);
app.post(securedpath + '/addworkordertype', supportCrossOriginScript, function (req, res) {


    var WorkorderType = url.parse(req.url, true).query['WorkorderType'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderType=?; set @employeekey=?;set @OrganizationID=?; call usp_addworkordertype(@WorkorderType,@employeekey,@OrganizationID)', [WorkorderType,employeekey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing viewworkorder");
            console.log("RETURNED WOT QQQQQQQQQQQQQQQ " + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[3]));
        }
    });
      }
        connection.release();
    });

});

app.get(securedpath + '/viewworkorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------viewworkorder---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_workordersGetByEmpKey(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
    });
     }
        connection.release();
    });
});

app.get(securedpath + '/findingUser', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log("----------viewworkorder---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @OrganizationID =?;call usp_findingUser(@employeekey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/managerWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------viewworkorder---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_managerWorkOrder(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewScheduledWorks', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------viewScheduledWorks---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_viewScheduledWorks(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
    });
     }
        connection.release();
    });
});

app.get(securedpath + '/getBarcodeForRoom', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var workDT = url.parse(req.url, true).query['viewdate'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
//    console.log("----------getBarcodeForRoom---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call  usp_getBarcodeForRoom(@empkey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getBarcodeForEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var workDT = url.parse(req.url, true).query['viewdate'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
//    console.log("----------getBarcodeForRoom---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?;  call usp_getBarcodeForEquipment(@empkey,@OrganizationID)", [empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/searchEmployeeOnTable', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var searchEmployee = url.parse(req.url, true).query['searchEmployee'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------searchEmployeeOnTable---------" + empkey + " " + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchEmployee =?;set @pageno=?; set @itemsPerPage=?;set @employeekey =?;set @OrganizationID =?;call usp_searchEmployeeOnTable(@searchEmployee,@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [searchEmployee, pageno, itemsPerPage, empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/searchRoomOnTable', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var searchRoom = url.parse(req.url, true).query['searchRoom'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log("----------searchRoomOnTable---------" + empkey + " " + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchRoom =?;set @employeekey =?;set @OrganizationID=?;call usp_searchRoomOnTable(@searchRoom,@employeekey,@OrganizationID)", [searchRoom, empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewworkorderemployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerkey = url.parse(req.url, true).query['managerkey'];
//    var workDT = url.parse(req.url, true).query['viewdate'];
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerkey =?;call usp_workordersemployeeGetByMngKey(@managerkey)", [managerkey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewworkorder_Filter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var filter = url.parse(req.url, true).query['filter'];
    var key = url.parse(req.url, true).query['key'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_workordersViewbyDomain(@empk,@filter,@key,@ondate,@ondate2,@OrganizationID)", [empkey, filter, key, on_DT, upto_DT,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/viewworkorderReport_Filter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var filter = url.parse(req.url, true).query['filter'];
    var key = url.parse(req.url, true).query['key'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];

//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;call usp_workordersReportViewbyDomain(@empk,@filter,@key,@ondate,@ondate2)", [empkey, filter, key, on_DT, upto_DT], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewRooms_Filter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var filter = url.parse(req.url, true).query['filter'];
    var key = url.parse(req.url, true).query['key'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  ");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @filter =?;set @key =?;set @empk =?;set @OrganizationID=?;call usp_roomsViewbyDomain(@filter,@key,@empk,@OrganizationID)", [filter, key, empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/workorderByWorkorderkeyandInventory', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var filter = url.parse(req.url, true).query['filter'];
    var key = url.parse(req.url, true).query['key'];
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    console.log("-----------workorderByWorkorderkeyandInventory---------- " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?; call usp_workorderByWorkorderkeyandInventory(@empk,@filter,@key,@ondate,@ondate2,@OrganizationID)", [empkey, filter, key, on_DT, upto_DT,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewWorkorderFilter_WorkOrderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderTypeKey = url.parse(req.url, true).query['WorkorderTypeKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var search_DT = url.parse(req.url, true).query['search_DT'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    console.log("ZZZZZZZZZZZZZ filter and key are " + WorkorderTypeKey + employeekey + " " + search_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @WorkorderTypeKey =?;set @employeekey =?;set @search_DT =?;set @OrganizationID =?;call usp_viewWorkorderFilter_WorkOrderType(@WorkorderTypeKey,@employeekey,@search_DT,@OrganizationID)", [WorkorderTypeKey, employeekey, search_DT,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewinspection_Filter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var key = url.parse(req.url, true).query['key'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("ZZZZZZZZZZZZZ filter and key are " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_viewinspection_Filter(@key,@ondate,@ondate2,@OrganizationID)", [key, on_DT, upto_DT,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


//app.get(securedpath + '/viewinspectionCountAllFilter', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//
//    var key = url.parse(req.url, true).query['key'];
//    var key1 = url.parse(req.url, true).query['key1'];
//    var on_DT = url.parse(req.url, true).query['searchDT'];
//    var upto_DT = url.parse(req.url, true).query['searchDT2'];
//    console.log("ZZZZZZZZZZZZZ filter and key are " + key + "  " + on_DT + " " + upto_DT);
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query("set @key =?; set @key1 =?;set @ondate =?;set @ondate2 =?;call usp_viewinspectionCountAllFilter(@key,@key1,@ondate,@ondate2)", [key,key1,on_DT, upto_DT], function (err, rows) {
//        if (err)
//        {
//            // console.log("Problem with MySQL" + err);
//        }
//        else
//        {
//            //    console.log("Printing rows");
//            // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
//            res.end(JSON.stringify(rows[4]));
//        }
//    });
//    }
//        connection.release();
//    });
//});



//app.get(securedpath + '/viewinspectionReport_FilterByDates', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//
//    var employeekey = url.parse(req.url, true).query['employeekey'];
//    var on_DT = url.parse(req.url, true).query['searchDT'];
//    var upto_DT = url.parse(req.url, true).query['searchDT2'];
//    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
////     var Empsearch = url.parse(req.url, true).query['EmployeeKey'];
//    console.log("ZZZZZZZZZZZZZ filter and key are " + key + "  " + on_DT + " " + upto_DT);
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query("set @employeekey =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_viewinspectionReport_FilterByDates(@employeekey,@ondate,@ondate2,@OrganizationID)", [employeekey, on_DT, upto_DT, OrganizationID], function (err, rows) {
//                if (err)
//                {
//                    // console.log("Problem with MySQL" + err);
//                }
//                else
//                {
//                    //    console.log("Printing rows");
//                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
//                    res.end(JSON.stringify(rows[4]));
//                }
//            });
//        }
//        connection.release();
//    });
//});

app.get(securedpath + '/viewinspectionReport_FilterByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    //console.log("ZZZZZZZZZZZZZ filter and key are " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_viewinspectionReport_FilterByDates(@employeekey,@ondate,@ondate2,@OrganizationID)", [employeekey, on_DT, upto_DT,OrganizationID], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewinspectionQuestionCountByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var key = url.parse(req.url, true).query['employeekey'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    console.log("ZZZZZZZZZZZZZ filter and key are " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @key =?;set @ondate =?;set @ondate2 =?;call usp_viewinspectionQuestionCountByDates(@key,@ondate,@ondate2)", [key, on_DT, upto_DT], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    // console.log("Workorer filtered output " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/viewworkorderempfilter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var managerkey = url.parse(req.url, true).query['managerkey'];
//    var key = url.parse(req.url, true).query['key'];
    var on_DT = url.parse(req.url, true).query['searchDT'];

//    var on_DT = if(url.parse(req.url, true).query['searchDT'],null);

    // console.log("filter and key are " + empkey + filter + " " + key + "  " + on_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @managerkey =?;set @ondate =?;call usp_viewworkorderempfilter(@empk,@managerkey,@ondate)", [empkey, managerkey, on_DT], function (err, rows) {
                if (err)
                {
                    // console.log("Problem with MySQL" + err);
                }
                else
                {
                    //    console.log("Printing rows");
                    console.log("Workorer filtered output " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllValueByDomain', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var domname = url.parse(req.url, true).query['domainName'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log(" " + domname + " " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@key,@empkey,@OrganizationID)', [domname, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});
app.get(securedpath + '/allRoomList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var domname = url.parse(req.url, true).query['domainName'];
//    var empkey = url.parse(req.url, true).query['empkey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_allRoomList(@OrganizationID)', [OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});


app.get(securedpath + '/getBatchScheduleName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var domname = url.parse(req.url, true).query['domainName'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getBatchScheduleName(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});

app.get(securedpath + '/ViewWorkorderByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderFromDate = url.parse(req.url, true).query['WorkorderFromDate'];
    var WorkorderToDate = url.parse(req.url, true).query['WorkorderToDate'];
    var empkey = url.parse(req.url, true).query['empkey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderFromDate=?;set @WorkorderToDate=?;set @empkey=?;call usp_ViewWorkorderByDates(@WorkorderFromDate,@WorkorderToDate,@empkey)', [WorkorderFromDate, WorkorderToDate, empkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});


app.get(securedpath + '/viewReportingWorkorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderFromDate = url.parse(req.url, true).query['WorkorderFromDate'];
    var WorkorderToDate = url.parse(req.url, true).query['WorkorderToDate'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("--------------llllll----------- " + WorkorderFromDate + " " + WorkorderToDate + " " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderFromDate=?;set @WorkorderToDate=?;set @empkey=?; set @OrganizationID=?; call usp_ViewWorkorderByDates(@WorkorderFromDate,@WorkorderToDate,@empkey,@OrganizationID)', [WorkorderFromDate, WorkorderToDate, empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});
app.get(securedpath + '/viewReportingInspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var WorkorderFromDate = url.parse(req.url, true).query['WorkorderFromDate'];
    var WorkorderToDate = url.parse(req.url, true).query['WorkorderToDate'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    console.log("--------------llllll----------- " + pageno + " " + itemsPerPage + " " + WorkorderFromDate + " " + WorkorderToDate + " " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?;set @itemsPerPage=?;set @WorkorderFromDate=?;set @WorkorderToDate=?;set @empkey=?;call usp_viewReportingInspection(@pageno,@itemsPerPage,@WorkorderFromDate,@WorkorderToDate,@empkey)', [pageno, itemsPerPage, WorkorderFromDate, WorkorderToDate, empkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by domain " + domname + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[5]));
                }
                res.end();
            });
        }
        connection.release();
    });
//    res.end();
});
app.get(securedpath + '/workorderDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderKey = url.parse(req.url, true).query['SearchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("WorkorderDetailKey ....." + workorderKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?; set @OrganizationID=?;call usp_workorderViewByWorkOrderKey(@workorderKey,@OrganizationID)', [workorderKey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing rows");
                    // console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/workorderScheduleDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderKey = url.parse(req.url, true).query['SearchKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("WorkorderDetailKey ....." + workorderKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?;set @OrganizationID=?;call usp_workorderScheduleDetails(@workorderKey,@OrganizationID)', [workorderKey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing rows");
                    // console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getRoomNameByRoomList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderKey = url.parse(req.url, true).query['SearchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("WorkorderDetailKey ....." + workorderKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?;set @OrganizationID=?;call usp_getRoomNameByRoomList(@workorderKey,@OrganizationID)', [workorderKey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing rows");
                    // console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/workorderCycleDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var wkey = url.parse(req.url, true).query['SearchKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?; set @OrganizationID=?; call usp_workorderCycleDetails(@key,@OrganizationID)', [wkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("workorderCycleDetails" + wkey + "  is  " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewAllWorkorderByDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    // console.log("Employee key for workorder is " + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdate =?;call usp_workordersGetByDate(@workdate)", [workDT], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing rows");
                    // console.log("ROWS" + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getZoneByFacilityKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; call usp_zoneByFacilityKeyGet(@facilitykey)', [facilitykey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("usp_zoneByFacilityKeyGet...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getFloorByZoneFacilityKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var zonekey = url.parse(req.url, true).query['zone'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @zone=?; call usp_floorByZoneFacilityKeyGet(@facilitykey,@zone)', [facilitykey, zonekey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("usp_zoneByFacilityKeyGet...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewworkorderFilterByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var zonekey = url.parse(req.url, true).query['zone'];
    var floorkey = url.parse(req.url, true).query['floor'];
    var t_date = url.parse(req.url, true).query['today'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @zone=?; set @floor=?; set @today=?; set @employeekey=?; set@OrganizationID=?; call usp_workorderViewByFacilityFloorZone(@facilitykey,@zone,@floor,@today,@employeekey,@OrganizationID)', [facilitykey, zonekey, floorkey, t_date, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("usp_zoneByFacilityKeyGet...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/workorderFilterByStatusEmpView', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var statuskey = url.parse(req.url, true).query['statuskey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var t_date = url.parse(req.url, true).query['today'];
    var emp = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @statuskey=?; set @today=?;  set @emp=?; set@OrganizationID=?; call usp_workorderFilterByStatusEmpView(@statuskey,@today,@emp,@OrganizationID)', [statuskey, t_date, emp,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("usp_zoneByFacilityKeyGet...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[4]));
        }
      });
        }  
        connection.release();
    });
});


//app.options('/deleteByWorkorderKey', supportCrossOriginScript);
//app.post(securedpath + '/deleteByWorkorderKey', supportCrossOriginScript, function (req, res) {
//    var workkey = url.parse(req.url, true).query['workorderkey'];
//    // console.log("inside server wkey is "+workkey);
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query('set @key=?;call usp_workorderdeleteByKey(@key)', [workkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
//        if (err) {
//            console.log("Problem with MySQL" + err);
//        }
//        else {
//            // console.log("AllValues by del "+ JSON.stringify(rows));
//            res.end(JSON.stringify(rows));
//        }
//        res.end();
//    });
//    }
//        connection.release();
//    });
//});
app.options('/deletebywschedulekey', supportCrossOriginScript);
app.post(securedpath + '/deletebywschedulekey', supportCrossOriginScript, function (req, res) {
    var workschedulekey = url.parse(req.url, true).query['workschedulekey'];
    var currenttime = url.parse(req.url, true).query['currenttime'];
    var endtime = url.parse(req.url, true).query['endtime'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("-------inside server deletebywschedulekey------" + workschedulekey + " " + currenttime + " " + endtime);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?; set @currenttime=?; set @endtime=?;set @OrganizationID=?;call usp_workorderDeteteByScheduleKey(@key,@currenttime,@endtime,@OrganizationID)', [workschedulekey, currenttime, endtime,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by del "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.options('/DeleteWorkorderSchedulebyKey', supportCrossOriginScript);
app.post(securedpath + '/DeleteWorkorderSchedulebyKey', supportCrossOriginScript, function (req, res) {
    var workschedulekey = url.parse(req.url, true).query['workschedulekey'];
    var currenttime = url.parse(req.url, true).query['currenttime'];
    var endtime = url.parse(req.url, true).query['endtime'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("-------inside server DeleteWorkorderSchedulebyKey------" + workschedulekey + " " + currenttime + " " + endtime);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?; set @currenttime=?; set @endtime=?; set @OrganizationID?; call usp_DeleteWorkorderSchedulebyKey(@key,@currenttime,@endtime,@OrganizationID)', [workschedulekey, currenttime, endtime,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by del "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewDashboardWorkorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var viewdate = url.parse(req.url, true).query['viewdate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @viewdate=?; set@OrganizationID=?; call usp_workordersGetByEmpKey_mob(@employeekey,@viewdate,@OrganizationID)', [employeekey, viewdate,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("usp_workorderEmpView...from server.." + JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
       });
        } 
        connection.release();
    });
});
app.get(securedpath + '/getAllValuesForRouteMap', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @OrganizationID=?;call usp_routemapGet(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MYSQL " + err);
                }
                else {
                    // console.log("AllValues by del "+ JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEmployeeByShift_Jobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pageno'];
    ;
    var itemsPerPage = url.parse(req.url, true).query['itemsperpage'];
    var shiftkey = url.parse(req.url, true).query['shiftkey'];
    var meetingdate = url.parse(req.url, true).query['meetingdate'];
    var jobtitlekey = url.parse(req.url, true).query['jobtitle'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("inside server wkey is"+shiftkey+" "+meetingdate+" "+jobtitlekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?; set @meetingdate=?; set @jobtitlekey=?; set @pagenumber=?; set @itemsPerPage=?;set @OrganizationID=?; call usp_GetEmployeeByShift_Jobtitle(@shiftkey,@meetingdate,@jobtitlekey,@pagenumber,@itemsPerPage,@OrganizationID)', [shiftkey, meetingdate, jobtitlekey, pagenumber, itemsPerPage,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("AllValues by del "+ JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/allWorkordersByEmployeeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var managerkey = url.parse(req.url, true).query['managerkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("Employee key for workorder is " + empkey + " " + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @manager =?; set@OrganizationID=?; call usp_getWorkorderByEmployeeKeyForInspection(@employeekey,@workdate,@manager,@OrganizationID)", [empkey, workDT, managerkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            //  console.log("Printing allWorkordersByEmployeeKey");
            // console.log("ROWS" + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[4]));
        }
        });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllEmployees', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_GetAllEmployees(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("usp_GetAllEmployees...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getShiftDetailsByShiftKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shiftkey = url.parse(req.url, true).query['shiftkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log("inside ...jobTitle..." + jobTitle);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?;set @OrganizationID=?;call usp_getShiftDetailsByShiftKey(@shiftkey,@OrganizationID)', [shiftkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("Printing rows");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.options('/getShiftDetails', supportCrossOriginScript);
app.post(securedpath + '/getShiftDetails', supportCrossOriginScript, function (req, res) {
    var zone = req.body.zoneKey;
    var start_date = req.body.StartDate;
    var end_date = req.body.EndDate;
    var shiftTypeKey = req.body.shiftTypeKey;
    var supervisor = req.body.supervisorKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    // console.log("inside addSchedulingBy_shift " + start_date + " " + end_date + " " + shiftTypeKey + " " + supervisor + "  " + zone);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?;set @OrganizationID=?; call usp_getShiftDetails(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {

                    // console.log("editEmp_scheduling " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[6]));

                }
            });
        }
        connection.release();
    });
});
app.options('/addInspectionOrderwithoutWorkorder', supportCrossOriginScript);
app.post(securedpath + '/addInspectionOrderwithoutWorkorder', supportCrossOriginScript, function (req, res) {
    var templateid = req.body.templateID;
    var employeekey = req.body.supervisorKey;
    var inspectiondate = req.body.inspectiondate;
    var isRecurring = req.body.isRecurring;
    var timer = req.body.inspectiontime;
    var roomkeylist = req.body.roomKey;
    var metaupdatedby = req.body.metaUpdatedBy;
    var empkey = req.body.empkey;
    var full = req.body.fulltime;
    var OrganizationID = req.body.OrganizationID;

////    isRecurring
    if (isRecurring == true) {
        isRecurring = '1';
    } else {
        isRecurring = '0';
    }
    console.log("----------------------addInspectionOrderwithoutWorkorder Template..." + isRecurring + "-----" + templateid + "employee..." + employeekey + "inspectiondate...." + inspectiondate + " " + timer + " " + "roomkey..." + roomkeylist + "metaupdatedby.." + metaupdatedby + " empkey " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;set @employeekey=?;set @inspectiondate=?;set @isRecurring=?;set @timer=?;set @roomkey=?; set @metaupdatedby=?; set @empkey=?;set @full=?; set@OrganizationID=?; call usp_inspectionorderAddwithoutWorkorders(@templateid,@employeekey,@inspectiondate,@isRecurring,@timer,@roomkey,@metaupdatedby,@empkey,@full,@OrganizationID)', [templateid, employeekey, inspectiondate, isRecurring, timer, roomkeylist, metaupdatedby, empkey,full,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log(" QQQQQQQQQQQQQQQ res got is " + JSON.stringify(rows[8]));
            res.end(JSON.stringify(rows[10]));

                }
            });
        }
        connection.release();
    });
});
app.options('/addInspectionOrderwithRecurring', supportCrossOriginScript);
app.post(securedpath + '/addInspectionOrderwithRecurring', supportCrossOriginScript, function (req, res) {
    var templateid = req.body.templateID;
    var employeekey = req.body.supervisorKey;
    var inspectionFromDate = req.body.inspectionFromDate;
    var inspectionToDate = req.body.inspectionToDate;
    var isRecurring = req.body.isRecurring;
    var timer = req.body.inspectiontime;
    var roomkeylist = req.body.roomKey;
    var metaupdatedby = req.body.metaUpdatedBy;
    var empkey = req.body.empkey;
    var full = req.body.fulltime;
     var OrganizationID = req.body.OrganizationID;

////    isRecurring
    if (isRecurring == true) {
        isRecurring = '1';
    } else {
        isRecurring = '0';
    }
    console.log("----------------------addInspectionOrderwithRecurring Template..." + isRecurring + "-----" + templateid + "employee..." + employeekey + "inspectiondate...." + inspectionFromDate + "inspectiondate1...." + inspectionToDate + " " + timer + " " + "roomkey..." + roomkeylist + "metaupdatedby.." + metaupdatedby + " empkey " + empkey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;set @employeekey=?;set @inspectionFromDate=?;set @inspectionToDate=?;set @isRecurring=?;set @timer=?;set @roomkey=?; set @metaupdatedby=?; set @empkey=?;set @full=?; set @OrganizationID=?;  call usp_addInspectionOrderwithRecurring(@templateid,@employeekey,@inspectionFromDate,@inspectionToDate,@isRecurring,@timer,@roomkey,@metaupdatedby,@empkey,@full,@OrganizationID)', [templateid, employeekey, inspectionFromDate, inspectionToDate, isRecurring, timer, roomkeylist, metaupdatedby, empkey,full, OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log(" QQQQQQQQQQQQQQQ res got is " + JSON.stringify(rows[9]));
            res.end(JSON.stringify(rows[10]));

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getinspectionDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionorderkey = url.parse(req.url, true).query['inspectionorder'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionorderkey=?; set@OrganizationID=?; call usp_getinspectionedDetails(@inspectionorderkey,@OrganizationID)', [inspectionorderkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getinspectionedDetails...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
        });
        }
        connection.release();
    });
});

app.get(securedpath + '/getWorkorderByStatusEmployeeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var workstatuskey = url.parse(req.url, true).query['workstatuskey'];
    var t_date = url.parse(req.url, true).query['today'];
    var userKey = url.parse(req.url, true).query['userKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @workstatuskey=?; set @today=?; set @userKey=?; set@OrganizationID=?; call usp_workorderGetByStatusEmployeeKey(@employeekey,@workstatuskey,@today,@userKey,@OrganizationID)', [employeekey, workstatuskey, t_date,userKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("usp_zoneByFacilityKeyGet...from server.." + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[5]));
        }
        });
        }
        connection.release();
    });
});


app.get(securedpath + '/inspectionDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionorderKey = url.parse(req.url, true).query['inspectionorderKey'];
//    console.log("date  is " + to_date);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionorderKey=?;call usp_getInspectionorderByKey(@inspectionorderKey)', [inspectionorderKey], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewInspectionTemplate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@OrganizationID=?; call usp_getInspectionTemplateDetails(@OrganizationID)', [OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[1]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTemplateDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?;set @itemsPerPage=?; set @empkey=?; set@OrganizationID=?; call usp_getTemplateDetails(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage,empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTempDetailsForDropdown', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getTempDetailsForDropdown(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTemplateFilterByTemplateID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var pageno = url.parse(req.url, true).query['pageno'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var key = url.parse(req.url, true).query['key'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?; set @OrganizationID=?;call usp_getTemplateFilterByTemplateID(@key,@OrganizationID)', [key,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.options('/deleteInspectionTemplateQuestions', supportCrossOriginScript);
app.post(securedpath + '/deleteInspectionTemplateQuestions', supportCrossOriginScript, function (req, res) {

    var templateID = url.parse(req.url, true).query['templateID'];
    var templateQuestionID = url.parse(req.url, true).query['templateQuestionID'];
    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?; set @templateQuestionID=?; set @updatedBy=?; set@OrganizationID=?; call usp_InspectionTemplateQuestionsRemove(@templateID,@templateQuestionID,@updatedBy,@OrganizationID)', [templateID, templateQuestionID, updatedBy,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editTemplateDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templateID = url.parse(req.url, true).query['templateID'];
    var templateQuestionID = url.parse(req.url, true).query['templateQuestionID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?; set @templateQuestionID=?;   call usp_getInspectionTemplateDetailsByIDs(@templateID,@templateQuestionID)', [templateID, templateQuestionID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/deleteInspectionTemplate', supportCrossOriginScript);
app.post(securedpath + '/deleteInspectionTemplate', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templateID = url.parse(req.url, true).query['templateID'];
    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?; set @updatedBy=?; set@OrganizationID=?;  call usp_InspectionTemplatesRemove(@templateID,@updatedBy,@OrganizationID)', [templateID, updatedBy,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});


app.options('/deleteSelectedTemplateQuestion', supportCrossOriginScript);
app.post(securedpath + '/deleteSelectedTemplateQuestion', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templateID = url.parse(req.url, true).query['templateID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?;set @OrganizationID=?;   call usp_deleteSelectedTemplateQuestion(@templateID,@OrganizationID)', [templateID,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});


app.options('/deleteWorkCycleByKey', supportCrossOriginScript);
app.post(securedpath + '/deleteWorkCycleByKey', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderkey = url.parse(req.url, true).query['workorderkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;  set @OrganizationID=?; call usp_deleteWorkCycleByKey(@workorderkey,@OrganizationID)', [workorderkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});


app.options('/deleteByWorkorderKey', supportCrossOriginScript);
app.post(securedpath + '/deleteByWorkorderKey', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workkey = url.parse(req.url, true).query['workorderkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var templateID = url.parse(req.url, true).query['templateID'];
//    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID =?;call usp_workorderdeleteByKey(@key,@OrganizationID)', [workkey,OrganizationID], function (err, rows) 
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.options('/deleteWorkorderFromView', supportCrossOriginScript);
app.post(securedpath + '/deleteWorkorderFromView', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workkey = url.parse(req.url, true).query['workorderkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var templateID = url.parse(req.url, true).query['templateID'];
//    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID=?;call usp_deleteWorkorderFromView(@key,@OrganizationID)', [workkey,OrganizationID], function (err, rows) 
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTrainingDetailsByJobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ondate = url.parse(req.url, true).query['ondate'];
    var todate = url.parse(req.url, true).query['todate'];
    var jobtitles = url.parse(req.url, true).query['job'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @todate=?;  set @jobtitles=?;set @empkey=?;set @OrganizationID=?; call usp_getTrainingDetailsByMultipleJobtitle(@date,@todate,@jobtitles,@empkey,@OrganizationID)', [ondate,todate, jobtitles, employeekey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getTrainingDetailsByJobtitle "+ JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[5]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewEmployeesOfEvent', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var filter = url.parse(req.url, true).query['filter']; 
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?;set @employeekey=?;set @OrganizationID=?; call usp_viewEmployeesOfEvent(@EventKey,@employeekey,@OrganizationID)', [EventKey, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("gettodaysMeeting "+ JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/gettodaysMeeting', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ondate = url.parse(req.url, true).query['ondate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var filter = url.parse(req.url, true).query['filter']; 
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @empkey=?;set @pageno=?;set @itemsPerPage=?;set @OrganizationID=?;  call usp_getAllMeetingTrainingByDate(@date,@empkey,@pageno,@itemsPerPage,@OrganizationID)', [ondate, employeekey,pageno,itemsPerPage,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("gettodaysMeeting "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewSharedStatusButton', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var ondate = url.parse(req.url, true).query['ondate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var filter = url.parse(req.url, true).query['filter'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @empkey=?;set @OrganizationID=?;  call usp_viewSharedStatusButton(@empkey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("gettodaysMeeting "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewAllMeetingByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var search_DT = url.parse(req.url, true).query['search_DT'];
    var search_DT2 = url.parse(req.url, true).query['search_DT2'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var filter = url.parse(req.url, true).query['filter']; 
    console.log("from date" + search_DT + "todate" + search_DT2);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @search_DT=?;set @search_DT2=?; set @empkey=?;set @OrganizationID=?;  call usp_viewAllMeetingByDates(@search_DT,@search_DT2,@empkey,@OrganizationID)', [search_DT, search_DT2, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("gettodaysMeeting "+ JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllDefaultEvents', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
      var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
      var employeekey = url.parse(req.url, true).query['employeekey'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
      pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?;set @itemsPerPage=?; set @employeekey=?;set @OrganizationID=?; call usp_getAllDefaultEvents(@pageno,@itemsPerPage,@employeekey,@OrganizationID)', [pageno,itemsPerPage,employeekey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("usp_getAllDefaultEvents "+ JSON.stringify(rows[0]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/allfacilityByPageNo', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?; call usp_getAllFacility_Pagination(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("allfacilityByPageNo " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getallWorkorderStatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_getallWorkorderStatus(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForNewWorkorderStatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderStatus = url.parse(req.url, true).query['WorkorderStatus'];
    var WorkorderStatusDescription = url.parse(req.url, true).query['WorkorderStatusDescription'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?;set @OrganizationID=?; set @WorkorderStatusDescription=?; call usp_checkForNewWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@OrganizationID)', [WorkorderStatus, WorkorderStatusDescription,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/allFloorType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pagenumber'];
    var itemsperpage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_floorTypeGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("allFloorType "+ JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/allFloorTypes', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var pageno = url.parse(req.url, true).query['pagenumber'];
//    var itemsperpage = url.parse(req.url, true).query['itemsPerPage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_allFloorTypes(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("allFloorType "+ JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/floorvaluesByfacKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var key = url.parse(req.url, true).query['key'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var itemsperpage = url.parse(req.url, true).query['itemsPerPage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID=?; call usp_floorvaluesByfacKey(@key,@OrganizationID)', [key,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("allFloorType "+ JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllEquipmentTypes', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("pagenumber "+pageno+".."+itemsperpage);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_getAllEquipmentTypes(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage,empkey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("allFloorType "+ JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/getShiftsByZone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var zonekey = url.parse(req.url, true).query['zonekey'];
    var startdate = url.parse(req.url, true).query['startdate'];
    var enddate = url.parse(req.url, true).query['enddate'];
    var empKey = url.parse(req.url, true).query['empKey'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zonekey=?; set @startdate=?; set @enddate=?; set @empKey=?; set @OrganizationID=?; call usp_getShiftsByZone(@zonekey,@startdate,@enddate,@empKey,@OrganizationID)', [zonekey, startdate, enddate,empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getShiftsByZone...from server.." + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[5]));
        }
    });
     }
        connection.release();
    });
});


app.get(securedpath + '/getAllShiftByShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Shifttype = url.parse(req.url, true).query['Shifttype'];
    var startdate = url.parse(req.url, true).query['startdate'];
    var enddate = url.parse(req.url, true).query['enddate'];
    var epmKey = url.parse(req.url, true).query['epmKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
     pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Shifttype=?; set @startdate=?; set @enddate=?; set @epmKey=?;set @OrganizationID=?; call usp_getAllShiftByShiftType(@Shifttype,@startdate,@enddate,@epmKey,@OrganizationID)', [Shifttype, startdate, enddate,epmKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/getAllShiftByDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var startdate = url.parse(req.url, true).query['startdate'];
    var enddate = url.parse(req.url, true).query['enddate'];
    var empKey = url.parse(req.url, true).query['empKey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @startdate=?; set @enddate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllShiftByDate(@startdate,@enddate,@empKey,@OrganizationID)', [startdate, enddate,empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeeWithoutSupervisor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getAllEmployeeWithoutSupervisor(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/getAllShiftinChargesShiftsByDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var endDate = url.parse(req.url, true).query['endDate'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @endDate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllShiftinChargesShiftsByDate(@pagenumber,@itemsPerPage,@startDate,@endDate,@empKey,@OrganizationID)', [pagenumber, itemsPerPage, startDate, endDate,empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows));
            res.end(JSON.stringify(rows[6]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/getAllEmployeesShiftsByDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var endDate = url.parse(req.url, true).query['endDate'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @endDate=?;set @OrganizationID=?; call usp_getAllEmployeesShiftsByDate(@pagenumber,@itemsPerPage,@startDate,@endDate,@OrganizationID)', [pagenumber, itemsPerPage, startDate, endDate,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.options('/backgroundGeoLocation', supportCrossOriginScript);
app.post(securedpath + '/backgroundGeoLocation', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var latitude = req.body.geolatitude;
    var longitude = req.body.geolongitude;
    var employeekey = req.body.EmployeeKey;
    var curr_date = req.body.currenttime;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @latitude=?; set @longitude=?; set @employeekey=?;set @curr_date=?; set@OrganizationID=?; call usp_backgroundGeoLocation(@latitude,@longitude,@employeekey,@curr_date,@OrganizationID)', [latitude, longitude, employeekey, curr_date,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFloorName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getFloorName(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("workorderCycleDetails  is  " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getZoneName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getZoneName(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("workorderCycleDetails  is  " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomTypeName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getRoomTypeName(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("workorderCycleDetails  is  " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
}); //

app.get(securedpath + '/getRoomName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getRoomName(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("workorderCycleDetails  is  " + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/updateQuestion', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var tempid = url.parse(req.url, true).query['tempid'];
    var tempQid = url.parse(req.url, true).query['tempQid'];
    var Question = url.parse(req.url, true).query['Question'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @tempid=?; set @tempQid=?; set @Question=?;set@OrganizationID=?; call usp_updateQuestion(@tempid,@tempQid,@Question,@OrganizationID)', [tempid, tempQid, Question,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("updateQuestion  is  " + JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/updateEditInspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var TemplateName = url.parse(req.url, true).query['TemplateName'];
    var TemplateID = url.parse(req.url, true).query['TemplateID'];
    var ScoreTypeKey = url.parse(req.url, true).query['ScoreTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @TemplateName=?; set @TemplateID=?; set @ScoreTypeKey=?; set@OrganizationID=?; call usp_updateEditInspection(@TemplateName,@TemplateID,@ScoreTypeKey,@OrganizationID)', [TemplateName, TemplateID, ScoreTypeKey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            // console.log("updateEditInspection  is  " + JSON.stringify(rows));
            res.end(JSON.stringify(rows[4]));
        }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/deleteScheduleView', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    var ShiftKey = url.parse(req.url, true).query['ShiftKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//     var IsDeleted = url.parse(req.url, true).query['IsDeleted'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftKey=?;set @OrganizationID=?;   call usp_deleteScheduleView(@ShiftKey,@OrganizationID)', [ShiftKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("deleteScheduleView  is  " + JSON.stringify(rows));

            res.end(JSON.stringify(rows[2]));
        }
        res.end();
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/editSupervisorSchedule', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftKey = url.parse(req.url, true).query['ShiftKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID']
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftKey=?;set @OrganizationID=?;call usp_editSupervisorSchedule(@ShiftKey,@OrganizationID)', [ShiftKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("editSupervisorSchedule  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.options('/updateSchedulingSupervisor', supportCrossOriginScript);
app.post(securedpath + '/updateSchedulingSupervisor', supportCrossOriginScript, function (req, res) {


    var ShiftKey = url.parse(req.url, true).query['ShiftKey'];
    var ZoneKey = url.parse(req.url, true).query['zoneKey'];
    var StartDate = url.parse(req.url, true).query['StartDate'];
    var EndDate = url.parse(req.url, true).query['EndDate'];
    var shiftTypeKey = url.parse(req.url, true).query['shiftTypeKey'];
    var SupervisorKey = url.parse(req.url, true).query['supervisorKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("updateSchedulingSupervisor....shiftkey "+ShiftKey+"...zonekey.. "+ZoneKey+"....startdate.. "+StartDate+".....enddate.. "+EndDate+"..shifttypekey.."+shiftTypeKey+"..supervisorkey..."+SupervisorKey+"..employeekey..."+employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftKey=?; set @ZoneKey=?; set @StartDate=?; set @EndDate=?; set @shiftTypeKey=?; set @SupervisorKey=?; set @employeekey=?;set @OrganizationID=?; call usp_updateSchedulingSupervisor(@ShiftKey,@ZoneKey,@StartDate,@EndDate,@shiftTypeKey,@SupervisorKey,@employeekey,@OrganizationID)', [ShiftKey, ZoneKey, StartDate, EndDate, shiftTypeKey, SupervisorKey, employeekey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("updateSchedulingSupervisor "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.options('/submitDefaultEventDetails', supportCrossOriginScript);
app.post(securedpath + '/submitDefaultEventDetails', supportCrossOriginScript, function (req, res) {
    var ActionType = url.parse(req.url, true).query['ActionType'];
    var Action = url.parse(req.url, true).query['Action'];
    var Description = url.parse(req.url, true).query['Description'];
    var ActionKey = url.parse(req.url, true).query['ActionKey'];
    var ActionTypeKey = url.parse(req.url, true).query['ActionTypeKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("submitDefaultEventDetails  "+ActionType,Action,Description,ActionKey,ActionTypeKey,employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ActionType=?; set @Action=?; set @Description=?; set @ActionKey=?; set @ActionTypeKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_submitDefaultEventDetails(@ActionType,@Action,@Description,@ActionKey,@ActionTypeKey,@employeekey,@OrganizationID)', [ActionType, Action, Description, ActionKey, ActionTypeKey, employeekey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("submitDefaultEventDetails "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.options('/deleteDefaultEventDetails', supportCrossOriginScript);
app.post(securedpath + '/deleteDefaultEventDetails', supportCrossOriginScript, function (req, res) {


    var ActionKey = url.parse(req.url, true).query['ActionKey'];
    var ActionTypeKey = url.parse(req.url, true).query['ActionTypeKey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    // console.log("deleteDefaultEventDetails  "+ActionKey,ActionTypeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ActionKey=?; set @ActionTypeKey=?;set @OrganizationID=?;   call usp_deleteDefaultEventDetails(@ActionKey,@ActionTypeKey,@OrganizationID)', [ActionKey, ActionTypeKey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("deleteDefaultEventDetails "+ JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmployeeScheduling', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var EmpKey = url.parse(req.url, true).query['EmpKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @EmpKey=?;set @OrganizationID=?; call usp_getEmployeeScheduling(@pagenumber,@itemsPerPage,@startDate,@EmpKey,@OrganizationID)', [pagenumber, itemsPerPage, startDate, EmpKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("editSupervisorSchedule  is  " + JSON.stringify(rows));

            res.end(JSON.stringify(rows[5]));
        }
        res.end();
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityString = url.parse(req.url, true).query['facilityString'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @facilityString=?;set @OrganizationID=?; call usp_getDetailsByFacility(@facilityString,@OrganizationID)', [facilityString,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByFacility...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getTrainingByEmployeeList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var meetingDate = url.parse(req.url, true).query['meetingDate'];
    var employee = url.parse(req.url, true).query['employee'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @meetingDate=?; set @employee=?;set @OrganizationID=?;   call usp_getTrainingByEmployeeList(@meetingDate,@employee,@OrganizationID)', [meetingDate, employee,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getTrainingByEmployeeList  is  " + JSON.stringify(rows[3]));

            res.end(JSON.stringify(rows[3]));
        }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getTrainingByShiftKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeKey = url.parse(req.url, true).query['ShiftTypeKey'];
    var meetingDate = url.parse(req.url, true).query['meetingDate'];
    var employeeKey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("****************" + ShiftTypeKey + "   " + meetingDate + "   " + employeeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftTypeKey=?; set @meetingDate=?; set @empkey=?; set @OrganizationID=?;   call usp_getTrainingByShiftKey(@ShiftTypeKey,@meetingDate,@empkey,@OrganizationID)', [ShiftTypeKey, meetingDate, employeeKey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getTrainingByShiftKey  is  " + JSON.stringify(rows[4]));

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/updateScheduleViewEmployeeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EmployeeCalendarID = url.parse(req.url, true).query['EmployeeCalendarID'];
    var EmployeeKey = url.parse(req.url, true).query['EmployeeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EmployeeCalendarID=?; set @EmployeeKey=?;set @OrganizationID=?;   call usp_updateScheduleViewEmployeeDetails(@EmployeeCalendarID,@EmployeeKey,@OrganizationID)', [EmployeeCalendarID, EmployeeKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("updateScheduleViewEmployeeDetails  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/deleteScheduleViewEmployeeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EmployeeCalendarID = url.parse(req.url, true).query['EmployeeCalendarID'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EmployeeCalendarID=?;set @OrganizationID=?;   call usp_deleteScheduleViewEmployeeDetails(@EmployeeCalendarID,@OrganizationID)', [EmployeeCalendarID,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteScheduleViewEmployeeDetails  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEditViewTrainingMeetingDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
    var EmployeeKey = url.parse(req.url, true).query['EmployeeKey'];
    var ActionKey = url.parse(req.url, true).query['ActionKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?; set @EmployeeKey=?; set @ActionKey=?;set @OrganizationID=?;  call usp_getEditViewTrainingMeetingDetails(@EventKey,@EmployeeKey,@ActionKey,@OrganizationID)', [EventKey, EmployeeKey, ActionKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("geteditViewTrainingMeetingDetails  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/deleteMeetingViewEmployeeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?;set @OrganizationID=?;   call usp_deleteMeetingViewEmployeeDetails(@EventKey,@OrganizationID)', [EventKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("deleteMeetingViewEmployeeDetails  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var floorString = url.parse(req.url, true).query['floorString'];
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @floorString=?; set @facilitykey=?;set @OrganizationID=?; call usp_getDetailsByFloor(@floorString,@facilitykey,@OrganizationID)', [floorString, facilitykey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByFloor...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByZone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var zoneString = url.parse(req.url, true).query['zoneString'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @zoneString=?; set @facilitykey=?;set @OrganizationID=?; call usp_getDetailsByZone(@zoneString,@facilitykey,@OrganizationID)', [zoneString, facilitykey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByFloor...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByRoomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomtypeString = url.parse(req.url, true).query['roomtypeString'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @roomtypeString=?;set @OrganizationID=?; call usp_getDetailsByRoomType(@roomtypeString,@OrganizationID)', [roomtypeString,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByFloor...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByRoomTypeFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityString = url.parse(req.url, true).query['facilityString'];
    var roomtypeString = url.parse(req.url, true).query['roomtypeString'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @roomtypeString=?; set @facilityString=?;set @OrganizationID=?; call usp_getDetailsByRoomTypeFacility(@roomtypeString,@facilityString,@OrganizationID)', [roomtypeString, facilityString,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByRoomTypeFacility...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getDetailsByRoom', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomString = url.parse(req.url, true).query['roomString'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @roomString=?;set @OrganizationID=?;  call usp_getDetailsByRoom(@roomString,@OrganizationID)', [roomString,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getDetailsByRoomTypeFacility...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewEmployeeMeetingTraining', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var meetingDate = url.parse(req.url, true).query['meetingDate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @meetingDate=?; set @employeekey=?;set @OrganizationID=?; call usp_getTrainingByEmployeekey(@meetingDate,@employeekey,@OrganizationID)', [meetingDate,employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_getTrainingByEmployeekey...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getselectedEmployeeByEventKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
    var EmployeeKey = url.parse(req.url, true).query['EmployeeKey'];
    var ActionKey = url.parse(req.url, true).query['ActionKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @EventKey=?; set @EmployeeKey=?; set @ActionKey=?;set @OrganizationID=?; call usp_EmployeeByEventKey(@EventKey,@EmployeeKey,@ActionKey,@OrganizationID)', [EventKey, EmployeeKey, ActionKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getselectedEmployeeByEventKey...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEmployeesLocation', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @employeekey=?; set@OrganizationID=?; call usp_getEmployeesLocation(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("usp_getEmployeesLocation...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
        });
        }
        connection.release();
    });
});
app.options('/unAttendedTrainingChangeStatus', supportCrossOriginScript);
app.post(securedpath + '/unAttendedTrainingChangeStatus', supportCrossOriginScript, function (req, res) {
    var EventKey = url.parse(req.url, true).query['EventKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @EventKey=?; set @employeekey=?;set @OrganizationID=?; call usp_unAttendedTrainingChangeStatus(@EventKey,@employeekey,@OrganizationID)', [EventKey, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("unAttendedTrainingChangeStatus...from server.." + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.options('/updateEditMeetingDetails', supportCrossOriginScript);
app.post(securedpath + '/updateEditMeetingDetails', function (req, res) {
    var MeetingNotes = req.body.MeetingNotes;
    var actionKey = req.body.actionKey;
    var OrganizationID = req.body.OrganizationID;
    var actionTypeKey = req.body.actionTypeKey;
    var eventKey = req.body.eventKey;
    var eventhost = req.body.eventhost;
    var venue = req.body.venue;
    var meetingDate = req.body.meetingDate;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var employeeKeyList = req.body.empKey;
    var metaupdatedby = req.body.employeekey;
    console.log("updateEditMeetingDetails " + actionKey + " ..." + eventhost + "..." + venue + " ..." + meetingDate + " ..." + startTime + " ..." + endTime + " .." + employeeKeyList);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @MeetingNotes=?; set @actionKey=?; set @actionTypeKey=?;  set @eventKey=?; set @eventhost=?; set @venue=?; set @meetingDate=?; set @startTime=?; set @endTime=?; set @employeeKeyList=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_updateMeetingTraining(@MeetingNotes,@actionKey,@actionTypeKey,@eventKey,@eventhost,@venue,@meetingDate,@startTime,@endTime,@employeeKeyList,@metaupdatedby,@OrganizationID)', [MeetingNotes, actionKey, actionTypeKey, eventKey, eventhost, venue, meetingDate, startTime, endTime, employeeKeyList, metaupdatedby,OrganizationID], function (err, rows)
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else
                {
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/markAsAttendedTrainingDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    // console.log("EventKey "+EventKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?;set @OrganizationID=?;   call usp_getEmployeeListByEventKey(@EventKey,@OrganizationID)', [EventKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log("markAsAttendedTrainingDetails  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/submitMarkAsAttendedTraining', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var attendedEmployees = url.parse(req.url, true).query['attendedEmployees'];
    var EventKey = url.parse(req.url, true).query['EventKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @attendedEmployees=?; set @EventKey=?;set @OrganizationID=?; call usp_eventHasAttendedUpdated(@attendedEmployees,@EventKey,@OrganizationID)', [attendedEmployees, EventKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("submitMarkAsAttendedTraining...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/geteventAttendedEmployeeList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EventKey = url.parse(req.url, true).query['EventKey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @EventKey=?; call usp_getHasAttendedEmployeeList(@EventKey)', [EventKey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("geteventAttendedEmployeeList...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.options('/pho1', supportCrossOriginScript);
app.post(securedpath + '/pho1', supportCrossOriginScript, function (req, res) {
    var pho = req.body.Filename;
    var wdkey = req.body.Workorderkey;
    var employeekey = req.body.EmployeeKey;
    var OrganizationID = req.body.OrganizationID;
    var newPath = pho;
    console.log("pho" + pho + " wdkey " + wdkey + " employeekey " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID)", [wdkey, newPath, employeekey,OrganizationID], function (err, rows)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            // console.log("pho1 " + JSON.stringify(rows[3][0].WorkorderStatus));
            res.end(JSON.stringify(rows[4][0].WorkorderStatus));
        }

            });
        }
        connection.release();
    });
});


app.options('/uploadImageFromSmallDevices', supportCrossOriginScript);
app.post(securedpath + '/uploadImageFromSmallDevices', supportCrossOriginScript, function (req, res) {
//    console.log('hit post ');
    uploadImageFromSmallDevices(req, res, function (err) {
        if (err) {
            // console.log(err);
            // console.log(err.stack);
            //console.log(req);
            return res.end("Error uploading file.");
        } else {
            // console.log('done');
            res.end("File is uploaded");
        }

    });
});

var PhotostorageDevice = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, '../webui/pho1');
//        callback(null, 'ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/pho1/');
        // console.log("destination " +file.originalname);
    },
    filename: function (req, file, callback) {
        var fname = file.originalname;
        callback(null, fname);
        // console.log("success file name " +fname);
    }
});
var uploadImageFromSmallDevices = multer({storage: PhotostorageDevice}).single('file');

app.get(securedpath + '/checkUsername', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = url.parse(req.url, true).query['username'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @employeekey=?;set @OrganizationID=?; call usp_checkUsername(@username,@employeekey,@OrganizationID)', [username, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getManagerForEmployeeForSuperAdmin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getManagerForEmployeeForSuperAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getManagerForEmployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getManagerForEmployee(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getOtherManagers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var rolekey = url.parse(req.url, true).query['rolekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @rolekey=?;set @OrganizationID=?; call usp_getOtherManagers(@employeekey,@rolekey,@OrganizationID)', [employeekey, rolekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForEmployeeInJobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobtitlekey = url.parse(req.url, true).query['jobtitlekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitlekey=?;set @OrganizationID=?; call usp_checkForEmployeeInJobtitle(@jobtitlekey,@OrganizationID)', [jobtitlekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/setUsernamePassword', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = url.parse(req.url, true).query['username'];
    var password = url.parse(req.url, true).query['password'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    var userRoleTypeKey = url.parse(req.url, true).query['userRoleTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @password=?; set @employeekey=?; set @updatedBy=?; set @userRoleTypeKey=?; set @OrganizationID=?;call usp_setUsernamePassword(@username,@password,@employeekey,@updatedBy,@userRoleTypeKey,@OrganizationID)', [username, password, employeekey, updatedBy, userRoleTypeKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("setUsernamePassword...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getLoginDetailsForAllUsers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
//    var itemsperpage = itemsperpage;
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW " + pageno + " " + itemsperpage + " " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?;call usp_getLoginDetailsForAllUsers(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_getLoginDetailsForAllUsers...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getLoginDetailsByID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_getLoginDetailsByID(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getLoginDetailsByID...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/resetPassword', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = url.parse(req.url, true).query['username'];
    var password = url.parse(req.url, true).query['password'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var updatedBy = url.parse(req.url, true).query['updatedBy'];
    var userloginid = url.parse(req.url, true).query['userloginid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//     console.log(updatedBy);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @password=?; set @employeekey=?; set @updatedBy=?; set @userloginid=?;set @OrganizationID=?; call usp_resetPassword(@username,@password,@employeekey,@updatedBy,@userloginid,@OrganizationID)', [username, password, employeekey, updatedBy,userloginid,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("resetPassword...from server.." + JSON.stringify(rows[6]));
            res.end(JSON.stringify(rows[6]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/deleteUsernamePassword', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_userloginRemove(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getLoginDetailsByID...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllUserRoleType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllUserRoleType()', function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

// for admin and super admin
app.get(securedpath + '/getAllUserRoleType_Admin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getAllUserRoleTypebyAdmin(@OrganizationID)',[OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getAllUserRoleType_SuperAdmin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getAllUserRoleTypebySuperAdmin(@OrganizationID)',[OrganizationID],function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
// for admin and super admin ends
app.get(securedpath + '/getManagerDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getManagerDetails(@OrganizationID)',[OrganizationID],function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getManagerDetails...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllManagersForFiltering', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllManagersForFiltering()', function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllManagersForFiltering...from server.." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmployeeRolerTypeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getEmployeeRolerTypeKey(@OrganizationID)',[OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getEmployeeRolerTypeKey...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeeDetailsByManagerKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerkey = url.parse(req.url, true).query['managerkey'];
    var pagenumber = url.parse(req.url, true).query['pagenumber'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @managerkey=?; set @pagenumber=?; set @itemsperpage=?; call usp_getAllEmployeeDetailsByManagerKey(@managerkey,@pagenumber,@itemsperpage)', [managerkey, pagenumber, itemsperpage], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllEmployeeDetailsByManagerKey...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewEmpByManager', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerkey = url.parse(req.url, true).query['managerkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var pagenumber = url.parse(req.url, true).query['pagenumber'];
//    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @managerkey=?;set @OrganizationID=?;  call usp_viewEmpByManager(@managerkey,@OrganizationID)', [managerkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("viewEmpByManager...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getFormDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID']; 
    console.log("pageno   " + pageno + " itemsPerPage  " + itemsPerPage);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsPerPage=?; set @empkey=?;set @OrganizationID=?; call usp_getFormDetails(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage,empkey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getFormDetails  is  " + JSON.stringify(rows[4]));

            res.end(JSON.stringify(rows[4]));
        }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmpByJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobtitleString = url.parse(req.url, true).query['jobtitleString'];
    var currentPage = url.parse(req.url, true).query['currentPage'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    console.log("jobtitleString   " + jobtitleString + " currentPage  " + currentPage);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitleString=?; set @currentPage=?; set @itemsPerPage=?; set @empkey=?; call usp_getEmpByJobTitle(@jobtitleString,@currentPage,@itemsPerPage,@empkey)', [jobtitleString, currentPage, itemsPerPage, empkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getEmpByJobTitle  is  " + JSON.stringify(rows[4]));

                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/searchEmpByJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobtitleString = url.parse(req.url, true).query['jobtitleString'];
//    var currentPage = url.parse(req.url, true).query['currentPage'];
//    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("jobtitleString   " + jobtitleString);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitleString=?; set @empkey=?;set @OrganizationID=?; call usp_searchEmpByJobTitle(@jobtitleString,@empkey,@OrganizationID)', [jobtitleString,empkey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getEmpByJobTitle  is  " + JSON.stringify(rows[2]));

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmpShiftCheck', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkeystring = url.parse(req.url, true).query['empkeystring'];
    var ShiftKey = url.parse(req.url, true).query['ShiftKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("empkeystring " + empkeystring + " ShiftKey " + ShiftKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkeystring=?; set @ShiftKey=?;set @OrganizationID=?;  call usp_getEmpShiftCheck(@empkeystring,@ShiftKey,@OrganizationID)', [empkeystring, ShiftKey,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getEmpShiftCheck  is  " + JSON.stringify(rows[3]));

            res.end(JSON.stringify(rows[3]));
        }
        res.end();
    });
     }
        connection.release();
    });
});

app.get(securedpath + '/uploadFormFile', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FormtypeId = url.parse(req.url, true).query['FormtypeId'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var fileName = url.parse(req.url, true).query['fileName'];
    var FormDesc = url.parse(req.url, true).query['FormDesc'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @employeekey=?; set @fileName=?; set @FormDesc=?; set @OrganizationID=?; call usp_uploadFormFile(@FormtypeId,@employeekey,@fileName,@FormDesc,@OrganizationID)', [FormtypeId, employeekey, fileName, FormDesc,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("uploadFormFile  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/updateFormDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FormtypeId = url.parse(req.url, true).query['FormtypeId'];
    var FormType = url.parse(req.url, true).query['FormType'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("FormtypeId " + FormtypeId + " FormType " + FormType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @FormType=?; set @empkey=?;set @OrganizationID=?; call usp_updateFormDetails(@FormtypeId,@FormType,@empkey,@OrganizationID)', [FormtypeId, FormType, empkey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("updateFormDetails  is  " + JSON.stringify(rows));

            res.end(JSON.stringify(rows[4]));
        }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getEditFormDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FormtypeId = url.parse(req.url, true).query['FormtypeId'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    console.log("FormtypeId                    " + FormtypeId);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @OrganizationID=?; call usp_getEditFormDetails(@FormtypeId,@OrganizationID)', [FormtypeId,OrganizationID], function (err, rows) {
        if (err) {
            console.log("Problem with MySQL" + err);
        }
        else {
            console.log("getEditFormDetails  is  " + JSON.stringify(rows[2]));

            res.end(JSON.stringify(rows[2]));
        }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/deleteForm', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FormtypeId = url.parse(req.url, true).query['FormtypeId'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @OrganizationID=?;  call usp_deleteForm(@FormtypeId,@OrganizationID)', [FormtypeId,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteForm  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/addNewForms', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newform = url.parse(req.url, true).query['newform'];
    var serverEmpKey = url.parse(req.url, true).query['serverEmpKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

//   console.log("EventKey "+EventKey+" attendedSelectEmp "+attendedSelectEmp);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @newform=?; set @serverEmpKey=?; set @OrganizationID=?; call usp_addNewForms(@newform,@serverEmpKey,@OrganizationID)', [newform, serverEmpKey,OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("addNewForms  is  " + JSON.stringify(rows));

                    res.end(JSON.stringify(rows));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkforForms', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newform = url.parse(req.url, true).query['newform'];
    var serverEmpKey = url.parse(req.url, true).query['serverEmpKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @newform=?; set @serverEmpKey=?; set @OrganizationID=?; call usp_checkforForms(@newform,@serverEmpKey,@OrganizationID)', [newform, serverEmpKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("getAllAvailableShifts...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[3]));
        }
            });
        }
        connection.release();
    });
});
//app.get(securedpath + '/checkforForms', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    var newform = url.parse(req.url, true).query['newform'];
//    var serverEmpKey = url.parse(req.url, true).query['serverEmpKey'];
//
////   console.log("EventKey "+EventKey+" attendedSelectEmp "+attendedSelectEmp);
//
//    pool.query('set @newform=?; set @serverEmpKey=?; call usp_checkforForms(@newform,@serverEmpKey)', [newform, serverEmpKey], function (err, rows) {
//        if (err) {
//            console.log("Problem with MySQL" + err);
//        }
//        else {
//            console.log("checkforForms  is  " + JSON.stringify(rows));
//
//            res.end(JSON.stringify(rows));
//        }
//        res.end();
//    });
//});
//add employee
app.options(securedpath + '/addemp', supportCrossOriginScript);
app.post(securedpath + '/addemp', supportCrossOriginScript, function (req, res) {

    var employeekey = -99;
    var metaupdatedby = req.body.metaupdatedBy;
    var employeenumber = req.body.employeenumber;
    var firstname = req.body.firstname;
    var middlename = req.body.middlename;
    var lastname = req.body.lastname;
    var jobtitlekey = req.body.jobTitleKey;
    var managerkey = req.body.managerkey;
    var addressline1 = req.body.addressline1;
    var addressline2 = req.body.addressline2;
    var city = req.body.city;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var country = req.body.country;
    var primaryphone = req.body.primaryphone;
    var alternatephone = req.body.alternatephone;
    var birthdate = req.body.birthDate;
    var hiredate = req.body.hireDate;
    var issupervisor = req.body.isSupervisor;
    var supervisorKey = req.body.supervisorKey;
    var departmentkey = req.body.departmentKey;
    var lastevaluationdate = null;
    var nextevaluationdate = null;
    var isrelieved;
    var ishkii = 0;
    var isactive = 1;
    var email = req.body.email;
    var OrganizationID = req.body.OrganizationID;
    var gender = req.body.gender;
    var shirtSize = req.body.shirtSize;
    var pantSize = req.body.pantSize;
    console.log("---------------------" + metaupdatedby + " " + employeenumber + " " + OrganizationID + " " + gender + " " + shirtSize + " " + pantSize + " " + supervisorKey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @issupervisor=?;set @supervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?; call usp_employeesAdd(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@issupervisor,@supervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, issupervisor, supervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("add employee..."+JSON.stringify(rows[26][0]));
                    res.end(JSON.stringify(rows[31][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getManagerDetailsByID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_getManagerDetailsByID(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getManagerDetailsByID...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeesDetailsOnly', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@OrganizationID=?;call usp_employeesOnly(@OrganizationID)',[OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("usp_employeesOnly...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
        });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllTemplatesWithoutScoringType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllTemplatesWithoutScoringType()', function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log("getAllTemplatesWithoutScoringType...from server.." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTemplates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID  = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @OrganizationID=?; call usp_getTemplates(@employeekey,@OrganizationID)',[employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log("getTemplates...from server.." + JSON.stringify(rows[0]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/statusByWorkorderDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var date = url.parse(req.url, true).query['date'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//      console.log("employeesGetByEmployeeKey...from server..");
//      console.log(employeeKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @employeekey=?; set@OrganizationID=?; call usp_statusFilterListByWorkorderDate(@date,@employeekey,@OrganizationID)', [date, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//             console.log("employeesGetByEmployeeKey...from server.." + JSON.stringify(rows));
            res.end(JSON.stringify(rows[3]));
        }
        });
        }
        connection.release();
    });
});
app.get(securedpath + '/getStatusListByEmployeeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var date = url.parse(req.url, true).query['today_date'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var userKey = url.parse(req.url, true).query['userKey'];
       var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @employeekey=?; set @userKey=?; set@OrganizationID=?; call usp_statusFilterListByEmployeeKey(@date,@employeekey,@userKey,@OrganizationID)', [date, employeekey,userKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getStatusListByEmployeeKey...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
        });
        }
        connection.release();
    });
});  // /getfacilitykeyByRoomId

app.get(securedpath + '/getfacilitykeyByRoomId', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomkey = url.parse(req.url, true).query['rkey'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomkey=?; call usp_facilitykeybyroomid(@roomkey)', [roomkey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

//varun code starts

app.get(securedpath + '/checkForNewInventory', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var checkValue = url.parse(req.url, true).query['checkValue'];
    var type = url.parse(req.url, true).query['type'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @checkValue=?; set @type=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewInventory(@checkValue,@type,@employeekey,@OrganizationID)', [checkValue, type, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForNewFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorName = url.parse(req.url, true).query['FloorName'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?; set @FloorName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewFloor(@FacilityKey,@FloorName,@employeekey,@OrganizationID)', [FacilityKey, FloorName, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForNewScheduleName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var bkey = url.parse(req.url, true).query['bkey'];
//    var FloorName = url.parse(req.url, true).query['FloorName'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bkey=?; set @employeekey=?; set @OrganizationID=?;call usp_checkForNewScheduleName(@bkey,@employeekey,@OrganizationID)', [bkey,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("checkForNewScheduleName...from server.." + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/checkForNewZone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];
    var ZoneName = url.parse(req.url, true).query['ZoneName'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?; set @FloorKey=?; set @ZoneName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewZone(@FacilityKey,@FloorKey,@ZoneName,@employeekey,@OrganizationID)', [FacilityKey, FloorKey, ZoneName, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/checkForNewRoom', supportCrossOriginScript, function (req, res) {
    var newObj = {};
    newObj = req.body;
    var FacilityKey = newObj.FacilityKey;
    var FloorKey = newObj.FloorKey;
    var FloorTypeKey = newObj.FloorTypeKey;
    var ZoneKey = newObj.ZoneKey;
    var RoomTypeKey = newObj.RoomTypeKey;
    var RoomName = newObj.RoomName;
    var employeekey = newObj.employeekey;
    var OrganizationID = newObj.OrganizationID;

    // console.log(facility_key, floor_key, facility_name, floor_name, zone_key, zone_name);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?; set @FloorKey=?; set @FloorTypeKey=?; set @ZoneKey=?; set @RoomTypeKey=?; set @RoomName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewRoom(@FacilityKey,@FloorKey,@FloorTypeKey,@ZoneKey,@RoomTypeKey,@RoomName,@employeekey,@OrganizationID)', [FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//             console.log(JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[8]));
                    console.log("Facility Key...from server.." + JSON.stringify(rows[8]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForNewEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var EquipmentName = url.parse(req.url, true).query['EquipmentName'];

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EquipmentTypeKey=?; set @EquipmentName=?; set @employeekey=?; set @OrganizationID=?; call usp_checkForNewEquipment(@EquipmentTypeKey,@EquipmentName,@employeekey,@OrganizationID)', [EquipmentTypeKey, EquipmentName, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/checkForTemplate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var templateName = url.parse(req.url, true).query['templateName'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
 
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateName=?; set@OrganizationID=?; call usp_checkForTemplate(@templateName,@OrganizationID)', [templateName,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkforInspectionOnTemplate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var templateid = url.parse(req.url, true).query['templateid'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
 
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?; call usp_checkforInspectionOnTemplate(@templateid,@OrganizationID)', [templateid,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTemplateEditDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var templateid = url.parse(req.url, true).query['templateid'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];   
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?;  call usp_getTemplateEditDetails(@templateid,@OrganizationID)', [templateid,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTemplateQuestionsEditDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
//    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var templateid = url.parse(req.url, true).query['templateid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
 
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?;  call usp_getTemplateQuestionsEditDetails(@templateid,@OrganizationID)', [templateid,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForBarcodeInventory', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Barcode = url.parse(req.url, true).query['Barcode'];
    var type = url.parse(req.url, true).query['type'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Barcode=?; set @type=?;set @OrganizationID=?;  call usp_checkForBarcodeInventory(@Barcode,@type,@OrganizationID)', [Barcode, type,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/insertNewShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeName = url.parse(req.url, true).query['ShiftTypeName'];
    var ShiftStartTime = url.parse(req.url, true).query['ShiftStartTime'];
    var ShiftEndTime = url.parse(req.url, true).query['ShiftEndTime'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            connection.query('set @ShiftTypeName=?; set @ShiftStartTime=?; set @ShiftEndTime=?; set @empKey=?;set @OrganizationID=?; call usp_insertNewShiftType(@ShiftTypeName,@ShiftStartTime,@ShiftEndTime,@empKey,@OrganizationID)', [ShiftTypeName, ShiftStartTime, ShiftEndTime, empKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });

        }
        connection.release();
    });
});

app.get(securedpath + '/getAllShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?;call usp_getAllShiftType_Pagination(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey,OrganizationID], function (err, rows)
            {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getAllShiftType " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });


});


app.get(securedpath + '/editShiftTypeGet', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeKey = url.parse(req.url, true).query['ShiftTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @ShiftTypeName=?; set @OrganizationID=?; call usp_editShiftTypeGet(@ShiftTypeName,@OrganizationID)', [ShiftTypeKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });


});

app.get(securedpath + '/updateShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeName = url.parse(req.url, true).query['ShiftTypeName'];
    var ShiftStartTime = url.parse(req.url, true).query['ShiftStartTime'];
    var ShiftEndTime = url.parse(req.url, true).query['ShiftEndTime'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var ShiftTypeKey = url.parse(req.url, true).query['ShiftTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @ShiftTypeName=?; set @ShiftStartTime=?; set @ShiftEndTime=?; set @empKey=?; set @ShiftTypeKey=?; set @OrganizationID=?; call usp_updateShiftType(@ShiftTypeName,@ShiftStartTime,@ShiftEndTime,@empKey,@ShiftTypeKey,@OrganizationID)', [ShiftTypeName, ShiftStartTime, ShiftEndTime, empKey, ShiftTypeKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });


});

app.get(securedpath + '/deleteShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeKey = url.parse(req.url, true).query['ShiftTypeKey'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @ShiftTypeKey=?; call usp_deleteShiftType(@ShiftTypeKey)', [ShiftTypeKey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });


});


app.get(securedpath + '/checkForNewShiftType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ShiftTypeName = url.parse(req.url, true).query['ShiftTypeName'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @ShiftTypeName=?;set @OrganizationID=?; call usp_checkForNewShiftType(@ShiftTypeName,@OrganizationID)', [ShiftTypeName,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("ShiftTypeName...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });


});


app.get(securedpath + '/checkForNewJobTittle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var JobTitle = url.parse(req.url, true).query['JobTitle'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @JobTitle=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewJobTittle(@JobTitle,@employeekey,@OrganizationID)', [JobTitle,employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkForNewJobTittle...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });


});
// varun  code
app.get('/getSuperAdminIdForAddUser', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");



    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query(' call usp_getSuperAdminIdForAddUser()', [], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getSuperAdminIdForAddUser...from server.." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });


});



app.get(securedpath + '/checkNewRoomName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var RoomName = url.parse(req.url, true).query['RoomName'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @RoomName=?; set @OrganizationID=?; call usp_checkNewRoomName(@RoomName,@OrganizationID)', [RoomName, OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkNewRoomName...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/employeeByAllFilter', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var JobTitle = req.body.JobTitleKey;
     var ManagerKey = req.body.ManagerKey;
      var employeekey = req.body.employeekey;
       var pagenumber = req.body.pagenumber;
        var itemsPerPage =req.body.itemsPerPage;
         var OrganizationID =req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @JobTitle=?; set @ManagerKey=?; set @employeekey=?; set @pagenumber=?; set  @itemsPerPage=?;set @OrganizationID=?;  call usp_getEmployeeByAllFilter(@JobTitle,@ManagerKey,@employeekey,@pagenumber,@itemsPerPage,@OrganizationID)', [JobTitle,ManagerKey,employeekey,pagenumber,itemsPerPage,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("employeeByAllFilter...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });


});



app.get(securedpath + '/checkForEditedRoomName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomKey = url.parse(req.url, true).query['roomKey'];
    var RoomName = url.parse(req.url, true).query['RoomName'];
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @roomKey=?; set @RoomName=?; set @FacilityKey=?; set @employeekey=?; set @OrganizationID=?; call usp_checkForEditedRoomName(@roomKey,@RoomName,@FacilityKey,@employeekey,@OrganizationID)', [roomKey, RoomName, FacilityKey, employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("checkForEditedRoomName...from server.." + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmailIdByEmp', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
  
    
   




    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @employeekey=?; set@OrganizationID=?;  call usp_getEmailIdByEmp(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getEmailIdByEmp...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getInspectionDetailsForEmail', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionOrderKey = url.parse(req.url, true).query['inspectionorderKey'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
  
    
   




    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @inspectionOrderKey=?; set@OrganizationID=?;  call usp_getInspectionDetailsForEmail(@inspectionOrderKey,@OrganizationID)', [inspectionOrderKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getInspectionDetailsForEmail...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEditRoomDetailsList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var ZoneKey = url.parse(req.url, true).query['ZoneKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @FacilityKey=?; set @ZoneKey=?; set @FloorKey=?;  call usp_getEditRoomDetailsList(@FacilityKey,@ZoneKey,@FloorKey)', [FacilityKey, ZoneKey, FloorKey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getInspectionDetailsForEmail...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getFloorListForRoomEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @FacilityKey=?; set @OrganizationID=?;  call usp_getFloorListForRoomEdit(@FacilityKey,@OrganizationID)', [FacilityKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_getFloorListForRoomEdit...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getFloorTypeListForRoomEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_getFloorTypeListForRoomEdit(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getFloorTypeListForRoomEdit...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getZoneListForRoomEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];
 var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @FacilityKey=?; set @FloorKey=?;set @OrganizationID=?;  call usp_getZoneListForRoomEdit(@FacilityKey,@FloorKey,@OrganizationID)', [FacilityKey, FloorKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_getFloorListForRoomEdit...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomTypeListForRoomEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_getRoomTypeListForRoomEdit(@empkey,@OrganizationID)', [empkey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("getRoomTypeListForRoomEdit...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/deleteWorkOrderBatchSchedule', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workschedulekey = url.parse(req.url, true).query['workorderSchedulekey'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @workschedulekey=?;set @OrganizationID=?;    call usp_deleteWorkOrderBatchSchedule(@workschedulekey,@OrganizationID)', [workschedulekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_deleteWorkOrderBatchSchedule...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmployeeForBatchScheduling', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var key = url.parse(req.url, true).query['key'];
      var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @key=?;set @OrganizationID=?;   call usp_getEmployeeForBatchScheduling(@key,@OrganizationID)', [key,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("usp_getEmployeeForBatchScheduling...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/delayCurrentWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Workorder = url.parse(req.url, true).query['WorkorderKey'];
    var emp = url.parse(req.url, true).query['emp'];
     var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @Workorder=?; set @emp=?; set @OrganizationID=?;  call usp_delayCurrentWorkOrder(@Workorder,@emp,@OrganizationID)', [Workorder,emp,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("delayCurrentWorkOrder...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/continueCurrentWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Workorder = url.parse(req.url, true).query['WorkorderKey'];
    var emp = url.parse(req.url, true).query['emp'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
  
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @Workorder=?; set @emp=?; set@OrganizationID=?;  call usp_continueCurrentWorkOrder(@Workorder,@emp,@OrganizationID)', [Workorder,emp,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("continueCurrentWorkOrder...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/deleteWorkOrders', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var deleteWorkOrderString = url.parse(req.url, true).query['deleteWorkOrderString'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
   var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @deleteWorkOrderString=?; set @employeekey=?;set @OrganizationID=?;  call usp_deleteWorkOrders(@deleteWorkOrderString,@employeekey,@OrganizationID)', [deleteWorkOrderString,employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("deleteWorkOrders...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getBatchScheduleList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var BatchScheduleNameKey = url.parse(req.url, true).query['BatchScheduleNameKey'];




    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @BatchScheduleNameKey=?;  call usp_getBatchScheduleList(@BatchScheduleNameKey)', [BatchScheduleNameKey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("BatchScheduleNameKey...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/BatchSchedule_Report', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var WorkorderScheduleKey = url.parse(req.url, true).query['WorkorderScheduleKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
  
  pool.getConnection(function (err, connection) {
     if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }else{
                connection.query('set @WorkorderScheduleKey=?;set @OrganizationID=?;   call usp_BatchSchedule_Report(@WorkorderScheduleKey,@OrganizationID)', [WorkorderScheduleKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("WorkorderScheduleKey...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/metricTypevalues', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@OrganizationID=?;call usp_getmetricName(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTemplatesNameFor_Mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getTemplatesNameFor_Mob(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[0]));
            res.end(JSON.stringify(rows[2]));
        }
        });
        }
        connection.release();
    });
});
app.get(securedpath + '/managerWorkOrder_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @workDT=?; set @OrganizationID=?; call usp_managerWorkOrder_mob(@employeekey,@workDT,@OrganizationID)', [employeekey, workDT,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/searchEmployeeList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var searchEmployee = url.parse(req.url, true).query['searchEmployee'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @searchEmployee=?;set @OrganizationID=?;  call usp_searchEmployeeListLogin(@employeekey,@searchEmployee,@OrganizationID)', [employeekey,searchEmployee,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/empGetBySupervisor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var SupervisorKey = url.parse(req.url, true).query['SupervisorKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @SupervisorKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_empGetBySupervisor(@SupervisorKey,@employeekey,@OrganizationID)', [SupervisorKey,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/empGetBySupervisorjobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var SupervisorKey = url.parse(req.url, true).query['SupervisorKey'];
    var JobTitleKey = url.parse(req.url, true).query['JobTitleKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @SupervisorKey=?; set @employeekey=?; set @JobTitleKey=?;set @OrganizationID=?;  call usp_empGetBySupervisorjobTitle(@SupervisorKey,@employeekey,@JobTitleKey,@OrganizationID)', [SupervisorKey,employeekey,JobTitleKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomsForCreateBatchSchedule', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var BatchScheduleNameKey = url.parse(req.url, true).query['BatchScheduleNameKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @BatchScheduleNameKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_roomsForCreateBatchSchedule(@BatchScheduleNameKey,@employeekey,@OrganizationID)', [BatchScheduleNameKey,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});



app.post(securedpath + '/saveScheduleReport', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var roomList = newWOObj.roomList;
    var frequency = newWOObj.frequency;
    var monCheck = newWOObj.monCheck;
    var tueCheck = newWOObj.tueCheck;
    var wedCheck = newWOObj.wedCheck;
    var thuCheck = newWOObj.thuCheck;
     var friCheck = newWOObj.friCheck;
      var satCheck = newWOObj.satCheck;
       var sunCheck = newWOObj.sunCheck;
        var barCheck = newWOObj.barCheck;
        var photCheck = newWOObj.photCheck;
        var empKey = newWOObj.empKey;
        var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
        var batchReportID = newWOObj.batchReportID;
        var workorderNotes = newWOObj.WorkorderNotes;
        var OrganizationID = newWOObj.OrganizationID;
       
    

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @roomList =?; set @frequency =?; set @monCheck =?; set @tueCheck=?; set @wedCheck=?; set @thuCheck=?; set @friCheck=?; set @satCheck=?; set @sunCheck=?; set @barCheck=?; set @photCheck=?; set @empKey=?; set @batchScheduleNameKey=?; set @batchReportID=?; set @workorderNotes=?;set @OrganizationID =?; call usp_saveScheduleReport(@roomList,@frequency,@monCheck,@tueCheck,@wedCheck,@thuCheck,@friCheck,@satCheck,@sunCheck,@barCheck,@photCheck,@empKey,@batchScheduleNameKey,@batchReportID,@workorderNotes,@OrganizationID)", [roomList,frequency,monCheck,tueCheck,wedCheck,thuCheck,friCheck,satCheck,sunCheck,barCheck,photCheck,empKey,batchScheduleNameKey,batchReportID,workorderNotes,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[16]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewScheduleReport', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var BatchScheduleNameKey = url.parse(req.url, true).query['BatchScheduleNameKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @BatchScheduleNameKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_viewScheduleReport(@BatchScheduleNameKey,@employeekey,@OrganizationID)', [BatchScheduleNameKey,employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
//            console.log(".." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/viewMeettingTrainingByAllFilter', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var empKey = newWOObj.empKey;
     var search_DT = newWOObj.search_DT;
      var search_DT2 = newWOObj.search_DT2;
       var employees = newWOObj.employees;
        var jobs = newWOObj.jobs;
    
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @search_DT=?; set@search_DT2=?; set@employees=?; set@jobs=?; set @empKey=?;call usp_viewMeettingTrainingByAllFilter(@search_DT,@search_DT2,@employees,@jobs,@empKey)", [search_DT,search_DT2,employees,jobs,empKey], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[5]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/JobtitleForSuperAdmin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_JobtitleForSuperAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("JobtitleForSuperAdmin...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
    });
    }
        connection.release();
    });
});



app.get(securedpath + '/getManagerForUpdateEmployeeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @OrganizationID=?; call usp_getManagerForUpdateEmployeeDetails(@employeekey,@OrganizationID)', [employeekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getManagerForUpdateEmployeeDetails...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchBuildingList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchFacility = url.parse(req.url, true).query['searchFacility'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_searchBuildingList(@searchFacility,@OrganizationID)', [searchFacility,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("usp_searchBuildingList...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/getSearchFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchFloor = url.parse(req.url, true).query['searchFloor'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_getSearchFloor(@searchFacility,@OrganizationID)', [searchFloor,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/searchZoneList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchZone = url.parse(req.url, true).query['searchZone'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_searchZoneList(@searchFacility,@OrganizationID)', [searchZone,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/searchFloorTypeList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchFloorType = url.parse(req.url, true).query['searchFloorType'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFloorType=?; set @OrganizationID=?; call usp_searchFloorTypeList(@searchFloorType,@OrganizationID)', [searchFloorType,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.post(securedpath + '/searchWorkorderByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var workorderStatusKey = newWOObj.workorderStatusKey;
    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
    var workorderTypeKey = newWOObj.workorderTypeKey;
    console.log("inside server workorderTypeKey= " + workorderTypeKey);
    var BatchScheduleNameKey = newWOObj.BatchScheduleNameKey;
     var OrganizationID = newWOObj.OrganizationID;
     var searchWO = newWOObj.searchWO;
//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;  set @BatchScheduleNameKey=?; set @OrganizationID=?; set @searchWO=?;  call usp_searchWorkorderByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@BatchScheduleNameKey,@OrganizationID,@searchWO)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, BatchScheduleNameKey,OrganizationID,searchWO], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[14]));
                }
            });
        }
        connection.release();
    });
});




app.post(securedpath + '/searchWorkorderScheduleByallFilters', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
    var workorderStatusKey = newWOObj.workorderStatusKey;
    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
    var roomKey = newWOObj.roomKey;
    console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
    var workorderTypeKey = newWOObj.workorderTypeKey;
    console.log("inside server workorderTypeKey= " + workorderTypeKey);
    var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
    console.log("inside server batchScheduleNameKey= " + batchScheduleNameKey);
 var OrganizationID = newWOObj.OrganizationID;
         var searchWO = newWOObj.searchWO;
//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;set @batchScheduleNameKey=?;set @OrganizationID=?; set@searchWO=?; call usp_searchWorkorderScheduleByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@batchScheduleNameKey,@OrganizationID,@searchWO)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey,batchScheduleNameKey,OrganizationID,searchWO], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[14]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/searchMeetingEventView', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var empKey = newWOObj.empKey;
     var search_DT = newWOObj.search_DT;
      var search_DT2 = newWOObj.search_DT2;
       var employees = newWOObj.employees;
        var jobs = newWOObj.jobs;
        var searchMeeting = newWOObj.searchMeeting;
    
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @search_DT=?; set@search_DT2=?; set@employees=?; set@jobs=?; set @empKey=?; set @searchMeeting=?;call usp_searchMeetingEventView(@search_DT,@search_DT2,@employees,@jobs,@empKey,@searchMeeting)", [search_DT,search_DT2,employees,jobs,empKey,searchMeeting], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
            res.end(JSON.stringify(rows[6]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/searchMytemplate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchMytemp = url.parse(req.url, true).query['searchMytemp'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchMytemp=?; set @OrganizationID=?; call usp_searchMytemplate(@searchMytemp,@OrganizationID)', [searchMytemp,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/searchtemplateQun', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchMytemp = url.parse(req.url, true).query['searchMytemp'];
    var TemplateID = url.parse(req.url, true).query['TemplateID'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchMytemp=?; set @OrganizationID=?; set @TemplateID=?; call usp_searchtemplateQun(@searchMytemp,@OrganizationID,@TemplateID)', [searchMytemp,OrganizationID,TemplateID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/searchFormList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchForm = url.parse(req.url, true).query['searchForm'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
    console.log(OrganizationID+" "+searchForm);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchForm=?; set @OrganizationID=?; call usp_searchFormList(@searchForm,@OrganizationID)', [searchForm,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("searchFormList...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchViewFormList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchForm = url.parse(req.url, true).query['searchForm'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
    console.log(OrganizationID+" "+searchForm);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchForm=?; set @OrganizationID=?; call usp_searchViewFormList(@searchForm,@OrganizationID)', [searchForm,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("searchFormList...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/searchEquipmentTypeList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchEquipmentType = url.parse(req.url, true).query['searchEquipmentType'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
    console.log(OrganizationID+" "+searchEquipmentType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchEquipmentType=?; set @OrganizationID=?; call usp_searchEquipmentTypeList(@searchEquipmentType,@OrganizationID)', [searchEquipmentType,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("searchEquipmentTypeList...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


//app.get(securedpath + '/myWorkOrderSearchList', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    var searchWO = url.parse(req.url, true).query['searchWO'];
//    var WorkorderDate = url.parse(req.url, true).query['WorkorderDate'];
//    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var employeekey = url.parse(req.url, true).query['employeekey'];
////    console.log(OrganizationID+" "+searchEquipmentType);
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query('set @searchWO=?; set @WorkorderDate=?; set @employeekey=?; set @OrganizationID=?; call usp_myWorkOrderSearchList(@searchWO,@WorkorderDate,@employeekey,@OrganizationID)', [searchWO,WorkorderDate,employeekey,OrganizationID], function (err, rows) {
//        if (err)
//        {
//            console.log("Problem with MySQL" + err);
//        }
//        else
//        {
//            console.log("searchEquipmentTypeList...from server.." + JSON.stringify(rows[4]));
//            res.end(JSON.stringify(rows[4]));
//        }
//    });
//    }
//        connection.release();
//    });
//});


app.post(securedpath + '/myWorkOrderSearchList', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
//    var workorderStatusKey = newWOObj.workorderStatusKey;
//    console.log("server new workorderStatusKey " + workorderStatusKey);
    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var facilitykey = newWOObj.facilitykey;
    console.log("inside server facilitykey= " + facilitykey);
    var roomTypeKey = newWOObj.roomTypeKey;
    console.log("inside server roomTypeKey= " + roomTypeKey);
    var floorKey = newWOObj.floorKey;
    console.log("inside server floorKey= " + floorKey);
//    var roomKey = newWOObj.roomKey;
//     console.log("inside server roomKey= " + roomKey);
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
      var OrganizationID = newWOObj.OrganizationID;
       var searchWO = newWOObj.searchWO;
//    var employeekey = newWOObj.employeeKey;
//    console.log("inside server empkey= " + employeekey);
//    var workorderTypeKey = newWOObj.workorderTypeKey;
//    console.log("inside server workorderTypeKey= " + workorderTypeKey);

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchWO=?; set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID =?;call usp_myWorkOrderSearchList(@searchWO,@manager,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [searchWO,manager, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, zoneKey,OrganizationID], function (err, rows) {
                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[9]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/allWorkOrderTypeWithOutQuick', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?;call usp_allWorkOrderTypeWithOutQuick(@empkey,@OrganizationID)", [ empkey,OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("workordertypelist...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});


app.get(securedpath + '/getEquipmentBuildFloor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?;set @FloorKey=?;set @OrganizationID=?; call usp_getEquipmentBuildFloor(@FacilityKey,@FloorKey,@OrganizationID)', [FacilityKey,FloorKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[3]));
            res.end(JSON.stringify(rows[3]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/getFloorKeyForEquipWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderkey = url.parse(req.url, true).query['workorderkey'];   
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @OrganizationID=?; call usp_getFloorKeyForEquipWorkOrder(@workorderkey,@OrganizationID)', [workorderkey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/getFloorKeyForEquipSchedule', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderSchedulekey = url.parse(req.url, true).query['workorderSchedulekey'];   
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderSchedulekey=?;set @OrganizationID=?; call usp_getFloorKeyForEquipSchedule(@workorderSchedulekey,@OrganizationID)', [workorderSchedulekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/getEquipmentNameList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderSchedulekey = url.parse(req.url, true).query['workorderSchedulekey'];   
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderSchedulekey=?;set @OrganizationID=?; call usp_getEquipmentNameList(@workorderSchedulekey,@OrganizationID)', [workorderSchedulekey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getEquipmentNameList...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/getEquipmentEquTypeChange', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];
    var EquipmentTypeKey = url.parse(req.url, true).query['EquipmentTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
   
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?;set @FloorKey=?; set@EquipmentTypeKey=?; set@OrganizationID=?; call usp_getEquipmentEquTypeChange(@FacilityKey,@FloorKey,@EquipmentTypeKey,@OrganizationID)', [FacilityKey,FloorKey,EquipmentTypeKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getEquipmentEquTypeChange...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

//app.get(securedpath + '/workorderReasonStatus', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//   
//   
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query('set  set@OrganizationID=?; call usp_getWorkorderReasonStatus(@OrganizationID)', [OrganizationID], function (err, rows) {
//        if (err)
//        {
//            console.log("Problem with MySQL" + err);
//        }
//        else
//        {
//            console.log("getEquipmentEquTypeChange...from server.." + JSON.stringify(rows[1]));
//            res.end(JSON.stringify(rows[1]));
//        }
//    });
//    }
//        connection.release();
//    });
//});
// varun code ends
app.get(securedpath + '/welcomeMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_welcomeMessage(@empkey,@OrganizationID)', [empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/valuesForPie', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var date = url.parse(req.url, true).query['date'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var userkey = url.parse(req.url, true).query['userkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?;set @empkey=?;set @userkey=?;set @OrganizationID =?; call usp_getvaluesforpie(@date,@empkey,@userkey,@OrganizationID )', [date,empkey,userkey,OrganizationID ], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("checkUsername...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/welcomeMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?; call usp_welcomeMessage(@empkey)', [empKey], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
    });
    }
        connection.release();
    });
});

app.post(securedpath + '/workorderByfilterPie', supportCrossOriginScript, function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);

    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);

    var workorderDate2 = newWOObj.workorderDate2;
    console.log("server new workorderDate2 " + newWOObj.workorderDate2);

    var employeekey = newWOObj.employeeKey;
    console.log("inside server empkey= " + employeekey);
    var workorderTypeKey = newWOObj.workorderTypeKey;
    console.log("inside server workorderTypeKey= " + workorderTypeKey);
     var OrganizationID = newWOObj.OrganizationID;

//    console.log("----------workorderByallFilters---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");
    // console.log("Employee key for workorder is " + empkey + workDT);//set @employeekey =?;call tm_workorderdetail(@employeekey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?; set @workorderDate =?; set @workorderDate2 =?; set @employeekey=?; set @workorderTypeKey=?;set @OrganizationID=?;  call usp_workorderByallFiltersPie(@manager,@workorderDate,@workorderDate2,@employeekey,@workorderTypeKey,@OrganizationID)", [manager,workorderDate,workorderDate2,employeekey,workorderTypeKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            // console.log("Printing viewworkorder");
//            console.log("ROWS" + JSON.stringify(rows));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/getEmployeeForPie', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var date = newWOObj.Date;
    var date1 = newWOObj.Date1;

    var empkey = newWOObj.EmployeeKey;
    var managerKey = newWOObj.managerKey;
    var WorkorderTypeKey = newWOObj.WorkorderTypeKey;
    var OrganizationID = newWOObj.OrganizationID;
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @date1=?; set @empkey=?; set @managerKey=?; set @WorkorderTypeKey=?;set @OrganizationID=?; call usp_getEmpvaluesforpie(@date,@date1,@empkey,@managerKey,@WorkorderTypeKey,@OrganizationID)', [date,date1,empkey,managerKey,WorkorderTypeKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("checkUsername...from server.." + JSON.stringify(rows[6]));
            res.end(JSON.stringify(rows[6]));
        }
            });
        }
        connection.release();
    });
});
//Pooja's code starts here
             
      app.get(securedpath + '/welcomeUpdateMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var empkey = url.parse(req.url, true).query['empkey'];
//    var userkey = url.parse(req.url, true).query['userkey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_welcomeUpdateMessage(@empkey,@OrganizationID)', [empKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/checkForTenantId', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var TenantID = url.parse(req.url, true).query['TenantID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @TenantID=?;call usp_checkForTenantId(@TenantID)', [TenantID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("getAllShiftByShiftType...from server.." + JSON.stringify(rows[1]));
            res.end(JSON.stringify(rows[1]));
        }
    });
    }
        connection.release();
    });
});

    app.get(securedpath + '/updateTemplateDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templatename = url.parse(req.url, true).query['templatename'];
    var tempEditid = url.parse(req.url, true).query['tempEditid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var ScoreTypeKey = url.parse(req.url, true).query['ScoreTypeKey'];
//    console.log(username);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templatename=?;set @tempEditid=?;set @OrganizationID=?;set @ScoreTypeKey=?; call usp_updateTemplateDetails(@templatename,@tempEditid,@OrganizationID,@ScoreTypeKey)', [templatename,tempEditid,OrganizationID,ScoreTypeKey], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchInspectionOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchLocation = url.parse(req.url, true).query['searchLocation'];
    var search_DT = url.parse(req.url, true).query['search_DT'];
    var search_DT2 = url.parse(req.url, true).query['search_DT2'];
    
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchLocation=?;set @search_DT=?;set @search_DT2=?; call usp_searchInspectionOrder(@OrganizationID,@searchLocation,@search_DT,@search_DT2)', [OrganizationID,searchLocation,search_DT,search_DT2], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchroomType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchRoomType = url.parse(req.url, true).query['searchRoomType'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchRoomType=?; call usp_searchroomType(@OrganizationID,@searchRoomType)', [OrganizationID,searchRoomType], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchequipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchEquipment = url.parse(req.url, true).query['searchEquipment'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchEquipment=?; call usp_searchequipment(@OrganizationID,@searchEquipment)', [OrganizationID,searchEquipment], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/searchworkOrderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchWorkOrderType = url.parse(req.url, true).query['searchWorkOrderType'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchWorkOrderType=?; call usp_searchworkOrderType(@OrganizationID,@searchWorkOrderType)', [OrganizationID,searchWorkOrderType], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/searchjobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchJobTitle = url.parse(req.url, true).query['searchJobTitle'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchJobTitle=?; call usp_searchjobTitle(@OrganizationID,@searchJobTitle)', [OrganizationID,searchJobTitle], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});
app.get(securedpath + '/searchScheduleName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchSchedule = url.parse(req.url, true).query['searchSchedule'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchSchedule=?; call usp_searchScheduleName(@OrganizationID,@searchSchedule)', [OrganizationID,searchSchedule], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/adminsearchJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchJobTitle = url.parse(req.url, true).query['searchJobTitle'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchJobTitle=?; call usp_adminsearchJobTitle(@OrganizationID,@searchJobTitle)', [OrganizationID,searchJobTitle], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/adminSearchDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchDepartment = url.parse(req.url, true).query['searchDepartment'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchDepartment=?; call usp_adminSearchDepartment(@OrganizationID,@searchDepartment)', [OrganizationID,searchDepartment], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

app.get(securedpath + '/searchEmpMeetingORTraining', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchActionType = url.parse(req.url, true).query['searchActionType'];
    var toServeremployeekey = url.parse(req.url, true).query['toServeremployeekey'];
    var today_DT = url.parse(req.url, true).query['today_DT'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchActionType=?;set @toServeremployeekey=?;set @today_DT=?; call usp_searchEmpMeetingORTraining(@OrganizationID,@searchActionType,@toServeremployeekey,@today_DT)', [OrganizationID,searchActionType,toServeremployeekey,today_DT], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

app.post(securedpath + '/getfloorTypeValue', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var FacilityKey = newWOObj.FacilityKey;
    var FloorKey = newWOObj.FloorKey;
    var ZoneKey = newWOObj.ZoneKey;
    var RoomTypeKey = newWOObj.RoomTypeKey ;
    var OrganizationID = newWOObj.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @FacilityKey=?;set @FloorKey=?; set @ZoneKey=?; set @RoomTypeKey=?; set @OrganizationID=?;call usp_getfloorTypeValue(@FacilityKey,@FloorKey,@ZoneKey,@RoomTypeKey,@OrganizationID)", [FacilityKey,FloorKey,ZoneKey,RoomTypeKey,OrganizationID], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
              console.log(JSON.stringify(rows[5]));
            res.end(JSON.stringify(rows[5]));
        }
    });
    }
        connection.release();
    });
});

//Pooja's code ends
//Roshni's code starts

//app.get(securedpath + 'searchDepartmentType', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
//    var  searchDepartment= url.parse(req.url, true).query['searchDepartment'];
//    console.log(OrganizationID+" "+searchDepartment);
//    // console.log("Fac key for roomtypene" + fkey + " usp_getRoomtypeByFacility_Floor_zone called");
////    pool.query("set @fkey=?;set @flkey=?;set @zon=?;call usp_getRoomtypeByFacility_Floor_zone(@fkey,@flkey,@zon)", [fkey, flkey, zon], function (err, rows) {
//    pool.getConnection(function (err, connection) {
//        if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }
//        else {
//            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//            connection.query("set @OrganizationID=?;set @searchDepartment=?; call usp_searchDepartmentType(@OrganizationID,@searchDepartment)", [OrganizationID,searchDepartment], function (err, rows) {
//                if (err) {
//                    console.log("Problem with MySQL" + err);
//                }
//                else {
////            console.log(JSON.stringify(rows));
//            res.end(JSON.stringify(rows[2]));
//        }
//    });
//    }
//        connection.release();
//    });
//});

app.get(securedpath + '/searchDepartmentType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var searchDepartment = url.parse(req.url, true).query['searchDepartment'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @searchDepartment=?; call usp_searchDepartmentType(@OrganizationID,@searchDepartment)', [OrganizationID,searchDepartment], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
            res.end(JSON.stringify(rows[2]));
        }
    });
    }
        connection.release();
    });
});

//Roshni's code ends

app.get(securedpath + '/searchinspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var searchWO = url.parse(req.url, true).query['searchWO'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var toServeremployeekey = url.parse(req.url, true).query['toServeremployeekey'];
    var today_DT = url.parse(req.url, true).query['today_DT'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchWO=?;set @OrganizationID=?;set @toServeremployeekey=?;set @today_DT=?; call usp_searchinspection(@searchWO,@OrganizationID,@toServeremployeekey,@today_DT)', [searchWO,OrganizationID,toServeremployeekey,today_DT], function (err, rows) {
        if (err)
        {
            console.log("Problem with MySQL" + err);
        }
        else
        {
            console.log("welcomeMessage...from server.." + JSON.stringify(rows[4]));
            res.end(JSON.stringify(rows[4]));
        }
    });
    }
        connection.release();
    });
});

// Sendmail route
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
// 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 is your sendgrid api
app.post(securedpath +'/sendmail', function (req, res) {
    var options = {
        service: 'Gmail',
        auth: {
            api_key: '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'
        }
    };
    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.sendMail(req.body, function (error, info) {
        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            } else {
//            console.log("WoooooW!!!!****************************Scheduler Works");
//                connection.query('call usp_workOrdersBatchAddByEvent()', [], function (err, rows) {
//                                    connection.query('insert into trooworkdb.a_test_table (Roomkey)values(1001); ', [], function (err, rows) {

//                if (error)
//                {
//                    console.log("Problem with MySQL" + err);
//                }
//                else
//                {
                console.log("nodemailer...from server..");
//                    res.end(JSON.stringify(rows[0]));
//                }
//            });
            }
            connection.release();
        });
//        if(error){
//            res.status('401').json({err: info});
//        }else{
//            res.status('200').json({success: true});
//        }
    });
});

var scheduler = require('node-schedule');

//var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(0, 6)];
//rule.hour = 10;
//rule.minute = 50;
//rule.second = [0, 20, 40];
// rule.second = 00;

var rule = new scheduler.RecurrenceRule();
rule.hour = 11;
rule.minute = 30;
rule.second = 00;
rule.dayOfWeek = new scheduler.Range(0, 6);
//                        var dailyJob = scheduler.scheduleJob(date, function(){
//                         console.log('I run on days at 12:01 pm');
//                        });
scheduler.scheduleJob(rule, function () {
//var j = schedule.scheduleJob(rule, function(){

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
//            console.log("WoooooW!!!!****************************Scheduler Works");
            connection.query('call usp_workOrdersBatchAddByEvent()', [], function (err, rows) {
//                                    connection.query('insert into trooworkdb.a_test_table (Roomkey)values(1001); ', [], function (err, rows) {

                if (err)
                {
                    console.log("Problem with MySQL" + err);
                }
                else
                {
                    console.log("Scheduler...from server..");
//                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

//                    var rule1 = new scheduler.RecurrenceRule();
//                        rule1.hour = [02,04,06,08,10,12,14,16,18,20,22,00];
//                        rule1.minute = 00;
//                        rule1.second = 00;
//                        rule1.dayOfWeek = new scheduler.Range(0,6);
//
//                        scheduler.scheduleJob(rule1, function(){
//
//
//     pool.getConnection(function (err, connection) {
//     if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }else{ 
//                connection.query('call usp_demoTestingScheduler()', [], function (err, rows) {
//
//                if (err)
//                {
//                    console.log("Problem with MySQL" + err);
//                }
//                else
//                {
//                    console.log("Scheduler demo testing...from server.." );
//                }
//            });
//        }
//       connection.release();
//    });
//});


// var j = schedule.scheduleJob('0 11 * * *', function(){
////var j = schedule.scheduleJob(rule, function(){
//
//  pool.getConnection(function (err, connection) {
//     if (err) {
//
//            console.log("Failed! Connection with Database spicnspan via connection pool failed");
//        }else{ 
////            console.log("WoooooW!!!!****************************Scheduler Works");
//                connection.query('call usp_workOrdersBatchAddByEvent()', [], function (err, rows) {
//                if (err)
//                {
//                    console.log("Problem with MySQL" + err);
//                }
//                else
//                {
//                    console.log("Scheduler...from server.." );
////                    res.end(JSON.stringify(rows[0]));
//                }
//            });
//        }
//       connection.release();
//    });
//});

// app.get(securedpath +'/getAllTemplatesWithoutScoringType',function (req,res){
//     res.header("Access-Control-Allow-Origin", "*");

//     pool.query('call usp_getAllTemplatesWithoutScoringType()', function (err, rows) {
//         if (err)
//         {
//             console.log("Problem with MySQL" + err);
//         }
//         else
//         {
//              console.log("getAllTemplatesWithoutScoringType...from server.." + JSON.stringify(rows[0]));
//             res.end(JSON.stringify(rows[0]));
//         }
//     });
// });
/*************END MIGRATE CODE**********************************************************/
//handle generic exceptions
//catch all other resource routes that are not defined above
app.get(securedpath + '/*', function (req, res) {
    res.json({"code": 403, "status": "Requested resource not available"});
});

app.use(errorHandler);

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({"code": 100, "status": "Error in establishing database connection"});
}

module.exports = app;
