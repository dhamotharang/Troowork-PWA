var config = require('./config');
var sendGridApi = require('./sendGridApi');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var url = require('url');
var multer = require('multer')
    , upload = multer();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var scheduler = require('node-schedule');
// var sendgrid = require('@sendgrid/mail');

function supportCrossOriginScript(req, res, next) {
    res.status(200);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
}

var app = express();
//initialize config variables
var jwtsecret = config.app.jwtsecret;
var viewpath = config.app.views; // setting webui tree location.
var securedpath = config.app.securedpath;
console.log('--------------------->' + securedpath);



app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    //    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.app.views)));



app.get('/', function (req, res) {

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




/*************START MIGRATE CODE**********************************************************/
var user_return = '';
var pass_return = '';
var employeekey_return = '';
var isSupervisor = '';
var organization = '';
var organizationID = '';
app.options('/authenticate', supportCrossOriginScript);

app.post('/authenticate', supportCrossOriginScript, function (req, res) {


    var userid = req.body.uname;

    var password = req.body.pwd;
    var tenantId = req.body.tid;

    var profile = {};

    DBPoolConnectionTry();
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @u_name=?;set @pwdd=?; set @tenantId=?; call usp_userLogin(@u_name,@pwdd,@tenantId)", [userid, password, tenantId], function (err, employees) {
                if (err) {
                    console.log("INSIDE errr() condition in /authenticate " + JSON.stringify(err));
                }
                console.log("entire response  " + JSON.stringify(employees));

                if (!employees[3][0]) {// if returns a void json like '[]'

                    console.log('Wrong user or password');

                    res.end('Wrong user or password');
                    return;
                } else {
                    console.log('Employee : ' + employees[3][0]["UserName"]);

                    user_return = employees[3][0]["UserId"];
                    organization = employees[3][0]["OrganizationName"];

                    username_return = employees[3][0]["UserName"];
                    role_return = employees[3][0]["UserRole"];

                    employeekey_return = employees[3][0]["EmployeeKey"];
                    isSupervisor = employees[3][0]["IsSupervisor"];
                    organizationID = employees[3][0]["OrganizationID"];
                    isemployeecalendar = employees[3][0]["IsEmployeeCalendar"];// Author Prakash for employee Calender

                    profile = {
                        user: user_return,
                        username: username_return,
                        role: role_return,
                        employeekey: employeekey_return,
                        //            password: pass_return,
                        IsSupervisor: isSupervisor,
                        Organization: organization,
                        OrganizationID: organizationID,
                        isemployeecalendar: isemployeecalendar// Author Prakash for employee Calender
                    };
                }
                // We are sending the profile inside the token
                var jwttoken = jwt.sign(profile, jwtsecret, { expiresIn: '4h' });

                res.cookie('refresh-token', jwttoken, 'httpOnly', 'secure')   //, 'secure','httpOnly')  '1h' //use for https
                    .json({ token: jwttoken });
                console.log("jwttoken" + jwttoken);
            });
        }
        connection.release();
    });
});



//method to verify jwt token. all secured path will pass thru here
// function jwtCheck(req, res, next) {
//     var token = '';
//     var accesstoken = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['x-auth-token'] || req.headers['authorization'];
//     var refreshtoken = req.cookies['refresh-token'];
//     //var refreshtoken = req.headers['cookie']; //also an option, but have to extract specific cookie from all cookies. comes in name:value pairs.
// //    console.log('headers<=>' + accesstoken); //req.headers['cookie']);
// //    console.log('for token verification -- cookies<=>' + refreshtoken); //req.cookies['access-token']);
//     //jwttoken = '';
//     if (refreshtoken) {
//         token = refreshtoken;
// //        console.log("got valid refresh token "+token);
//     } else {
//         token = accesstoken;
// //        console.log("got access token as "+token);
//     }
//     console.log("Verifying received token " + token);
//     jwt.verify(token, jwtsecret, function (err, decoded) {
//         if (err) {
//             console.log(err);
//             return res.json({success: false, message: 'Failed to authenticate token.'});
//         } else {
//             // if everything is good, save to request for use in other routes
//             req.decoded = decoded;
// //            console.log('decoded------->' + JSON.stringify(decoded));
// //            console.log('iat:' + new Date(1482535287));
// //            console.log('exat:' + new Date(1482553287));
//             //return res.json({ success: true, message: 'Authenticated successfully.' });    
//             next();
//         }
//     });
// }

// app.use(securedpath, jwtCheck);


// *********************code for form uploads-web starts **********************
//var multerUploadPath_photo = './webui/pho1';// use ../webui/uploads for cloud.
var locationinTable = 'pho1/';

//var multerUploadPath = './webui/uploads';// use ../webui/uploads for cloud.
var multerUploadPath = '';
var storage = multer.diskStorage({
    // use ./ inlocal and ../ in azure
    destination: function (req, file, callback) {
        if (url.parse(req.url, true).query['formtypeId']) {
            multerUploadPath = './webui/uploads';
        } else if (url.parse(req.url, true).query['Workorderkey']) {
            multerUploadPath = './webui/pho1';
        }
        callback(null, multerUploadPath);
    },
    filename: function (req, file, callback) {
        if (url.parse(req.url, true).query['formtypeId']) {
            var formtypeId = url.parse(req.url, true).query['formtypeId'];
            var formDesc = url.parse(req.url, true).query['formDesc'];
            var empkey = url.parse(req.url, true).query['empkey'];
            var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

            var filename = file.originalname;

            console.log(" SSSSSSSSSSSSSSSSSS fid fdesc fname are  " + formtypeId + " " + formDesc + " " + filename + " " + multerUploadPath);
            callback(null, file.originalname);

            pool.getConnection(function (err, connection) {
                if (err) {

                    console.log("Failed! Connection with Database spicnspan via connection pool failed");
                }
                else {
                    console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                    connection.query('set @formtypeId=?;set @empkey=?;set @fileName=?;set @formDesc=?; set @OrganizationID=?; call usp_uploadFormFile(@formtypeId,@empkey,@fileName,@formDesc,@OrganizationID)', [formtypeId, empkey, filename, formDesc, OrganizationID], function (err) {
                        if (err)
                            console.log("my error" + err);
                    });
                }
                connection.release();
            });
        }
        else if (url.parse(req.url, true).query['Workorderkey']) {
            console.log("VVVVVVVVVVVVVVVV inside storage_WOPhoto XXXXXXXXXXXXXXXXXXXXXXXXX" + multerUploadPath);

            var filename = file.originalname;
            var wdkey = url.parse(req.url, true).query['Workorderkey'];
            var employeekey = url.parse(req.url, true).query['EmployeeKey'];

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
                    connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey)", [wdkey, newPath, employeekey], function (err) {
                        if (err)
                            console.log("my error" + err);
                    });
                }
                connection.release();
            });

        }
    }


});


var upload = multer({ storage: storage }).single('file');
//  UPLOADING FORM FORM MANAGER req holds formid, description and file
// IMPORTANT THE API NAME '/upload' is important , dont change.
app.options('/upload', supportCrossOriginScript);
app.post(securedpath + '/upload', function (req, res) {


    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
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
var upload_WOphoto = multer({ storage: storage_WOPhoto }).single('file');

// var multerUploadPath_photo = '../webui/pho1';// use ../webui/uploads for cloud.
//var locationinTable = 'webui/pho1/';
var storage_WOPhoto = multer.diskStorage({
    // use ./ inlocal and ../ in azure
    destination: function (req, file, callback) {
        callback(null, '../webui/pho1');
    },
    filename: function (req, file, callback) {
        console.log("TRYING DB INSERTION");

        var filename = file.originalname;

        var wdkey = url.parse(req.url, true).query['Workorderkey'];
        var employeekey = url.parse(req.url, true).query['EmployeeKey'];

        var newPath = filename;
        console.log("pho" + filename + " wdkey " + wdkey + " employeekey " + employeekey);
        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            }
            else {
                console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey)", [wdkey, newPath, employeekey], function (err, rows) {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/fi', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getformupload()', function (err, rows) {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getZone()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/room', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getRoom()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});




app.get(securedpath + '/roomid', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getRoom()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});






app.get(securedpath + '/empList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getEmployee()", function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[0]));

                }
            });
        }
        connection.release();
    });
});








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
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_getDepartment(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zon=?;set @OrganizationID=?;call usp_getRoomTypeByFacilty_Zone(@fkey,@zon,@OrganizationID)", [fkey, zon, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @etype=?;set @OrganizationID=?;call usp_getEquipmentByType(@etype,@OrganizationID)", [etype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var templateId = url.parse(req.url, true).query['TemplateID'];

    var ScoringTypeKey = url.parse(req.url, true).query['ScoringTypeKey'];

    var frequency = url.parse(req.url, true).query['frequency'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateId=?;set @ScoringTypeKey=?;set @frequency=?;set @question=?; call tm_addNewTemplates_Question(@templateId,@ScoringTypeKey,@question,@frequency)', [templateId, ScoringTypeKey, question, frequency], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                res.end();
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getShiftInCharge', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shift = url.parse(req.url, true).query['shifttype'];
    var zone = url.parse(req.url, true).query['zone'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shift=?;set @zone=?;set @startDate=?; set @OrganizationID=?;call usp_getShiftInCharge(@shift,@zone,@startDate,@OrganizationID)', [shift, zone, startDate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query("set @barcode =?;set @empkey =?;set @date =?; set@OrganizationID=?;call usp_workorderGetByScannedBarcode(@barcode,@empkey,@date,@OrganizationID)", [barcode, empkey, ondate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });

});


app.get(securedpath + '/scanforWorkorder_empAng6', function (req, res) {
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
            connection.query("set @barcode =?;set @empkey =?;set @date =?; set@OrganizationID=?;call usp_workorderGetByScannedBarcode_Ang6(@barcode,@empkey,@date,@OrganizationID)", [barcode, empkey, ondate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('call usp_getUniqueFloorName()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('call usp_getUniqueZoneName()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('call usp_getUniqueRoomType()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('call usp_getUniqueRoomName()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('SELECT e.EquipmentTypeKey, e.EquipmentType FROM equipmenttype e group by e.EquipmentType', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });

});





app.get(securedpath + '/getAllEquipment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllEquipmentName()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @facility=?;set @roomtype=?;set @roomkey=?; set@OrganizationID=?; call tm_getFloorZoneByRTypeRoom(@facility,@roomtype,@roomkey,@OrganizationID)', [facility, roomtype, roomkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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

    var equipmentkey = url.parse(request.url, true).query['equipmenttypekey'];

    var roomkeys = url.parse(request.url, true).query['roomkeys'];

    var employeekey = url.parse(request.url, true).query['employeekey'];

    var priority = url.parse(request.url, true).query['priority'];

    var isrecurring = url.parse(request.url, true).query['isrecurring'];

    var fromdate = url.parse(request.url, true).query['fromdate'];

    var todate = url.parse(request.url, true).query['todate'];

    var intervaltype = url.parse(request.url, true).query['intervaltype'];

    var repeatinterval = url.parse(request.url, true).query['repeatinterval'];

    var occurenceinstance = url.parse(request.url, true).query['occurenceinstance'];

    var occurenceday = url.parse(request.url, true).query['occurenceday'];

    var occurenceat = url.parse(request.url, true).query['occurenceat'];

    var note = url.parse(request.url, true).query['note'];
    var isbar = url.parse(request.url, true).query['isbar'];
    var isphoto = url.parse(request.url, true).query['isphoto'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workordertypekey=?;set @equipmentkey=?;set @roomkey=?; set @empoyeekey=?; set @priority=?;set @isrecurring=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occurenceinstance=?;set @occurenceday=?;set @occurenceat=?; set @note=?;set @isbar=?;set @isphoto=?;call tm_createworkorder(@workordertypekey,@equipmentkey,@roomkey,@empoyeekey,@priority,@isrecurring,@fromdate,@todate,@intervaltype,@repeatinterval,@occurenceinstance,@occurenceday,@occurenceat,@note,@isbar,@isphoto) ', [workordertypekey, equipmentkey, roomkeys, employeekey, priority, isrecurring, fromdate, todate, intervaltype, repeatinterval, occurenceinstance, occurenceday, occurenceat, note, isbar, isphoto], function (err, res) {
                if (err) {
                    console.log(err);
                }

            });
        }
        connection.release();
    });

    response.end("sucess");

});






























//Jeffy code Starts



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

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });

});

app.options('/removeEmployee', supportCrossOriginScript);
app.post(securedpath + '/removeEmployee', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var employeeKey = newobject.empKey;
    var metaupdatedby = newobject.updatedBy;
    var OrganizationID = newobject.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeeKey=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_employeesRem(@employeeKey,@metaupdatedby,@OrganizationID)', [employeeKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[3]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/meetingTraining', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empKey=?;set @OrganizationID=?; call usp_actionTypesGet(@empKey,@OrganizationID)", [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeeKey=?; set @data=?;set @OrganizationID=?; call usp_sharedStatusButton(@employeeKey,@data,@OrganizationID)', [employeeKey, swich_value, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});
app.get(securedpath + '/selectShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var domainkey = "shifttypes";
    var empkey = 100;// shift types are not org boounded
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.


                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });


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
            connection.query("set @pageno=?;set @itemsPerPage=?;set @managerkey=?;set @OrganizationID=?;call usp_viewScheduleNameList(@pageno,@itemsPerPage,@managerkey,@OrganizationID)", [pageno, itemsPerPage, managerkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });

    //    res.end();
});

//For delete assignment name
app.get(securedpath + '/deleteScheduleName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var batchschedulenamekey = url.parse(req.url, true).query['batchschedulenamekey']
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @batchschedulenamekey=?; set @empkey=?;set @OrganizationID=?; call usp_deleteAssignmentName(@batchschedulenamekey,@empkey,@OrganizationID)", [batchschedulenamekey, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/scoringtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");


    var domainkey = "scoretypes";
    var empkey = 100;
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) //IMPORTANT : (err,rows) this order matters.
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/selectJobtitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    //  
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?; set @OrganizationID=?;call usp_addNewJobTitle(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/deleteJobTitleSelected', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobTitlekey = req.body.JobTitleKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobTitlekey=?;set @OrganizationID=?; call usp_deleteJobTitleSelected(@jobTitlekey,@OrganizationID)', [jobTitlekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/deleteDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var DepartmentKey = req.body.DepartmentKey;
    var OrganizationID = req.body.OrganizationID;
    //   var DepartmentKey = req.body.DepartmentKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @OrganizationID=?;  call usp_deleteDepartment(@DepartmentKey,@OrganizationID)', [DepartmentKey, OrganizationID], function (err, rows) {
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
    var WorkorderTypeKey = req.body.WorkorderTypeKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @OrganizationID=?;  call usp_deleteWorkOrderType(@WorkorderTypeKey,@OrganizationID)', [WorkorderTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteForm  is  " + JSON.stringify(rows[2]));

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @StatusKey=?; set @OrganizationID=?; call usp_getWorkorderstatusbyId(@StatusKey,@OrganizationID)', [StatusKey, OrganizationID], function (err, rows) {
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
            connection.query("set @pageno=?;set @itemsPerPage=?;set @empkey=?;set @OrganizationID=?; call usp_viewDepartmentpage(@pageno,@itemsPerPage,@empkey,@OrganizationID)", [pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/viewDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_viewDepartment(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @pageno=?;set @itemsPerPage=?; set @employeekey=?;set @OrganizationID=?; call usp_viewWorkorderType(@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [pageno, itemsPerPage, employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/addJobTitleNew', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

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
            connection.query("set @JobTitle=?;set @JobTitleDescription=?; set @empkey=?;set @OrganizationID=?;call usp_addJobTitleNew(@JobTitle,@JobTitleDescription,@empkey,@OrganizationID)", [JobTitle, JobTitleDescription, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/addNewWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var WorkorderTypeName = req.body.WorkorderTypeName;
    var Repeatable = req.body.Repeatable;
    var Frequency = req.body.Frequency;
    var WorkorderTime = req.body.WorkorderTime;
    var RoomTypeKey = req.body.RoomTypeKey;
    var empkey = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;
    var metric = req.body.metric;
    var MetricType = req.body.MetricType;
    if (Repeatable == true) {
        Repeatable = 'Y';
    } else {
        Repeatable = 'N';
    }
    console.log("addnewworkordertype--------------------" + WorkorderTypeName + "" + Repeatable + "" + Frequency + "" + WorkorderTime + "" + RoomTypeKey + "" + metric + "" + MetricType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @WorkorderTypeName=?;set @Repeatable=?; set @Frequency=?; set @WorkorderTime=?; set @RoomTypeKey=?; set @empkey=?;set @OrganizationID=?;set @metric=?;set @MetricType=?; call usp_addNewWorkordertype(@WorkorderTypeName,@Repeatable,@Frequency,@WorkorderTime,@RoomTypeKey,@empkey,@OrganizationID,@metric,@MetricType)", [WorkorderTypeName, Repeatable, Frequency, WorkorderTime, RoomTypeKey, empkey, OrganizationID, metric, MetricType], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[9]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/addNewDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var DepartmentName = req.body.DepartmentName;
    var empkey = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @DepartmentName=?; set @empkey=?;set @OrganizationID=?;call usp_addNewDepartment(@DepartmentName,@empkey,@OrganizationID)", [DepartmentName, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    console.log("FOR VIEW EDIT JOB TITLE KEY IS " + JobTitleKey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @JobTitleKey=?;set @OrganizationID=?;call usp_editviewJobTitle(@JobTitleKey,@OrganizationID)', [JobTitleKey, OrganizationID], function (err, rows) {
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

    console.log("FOR VIEW EDIT JOB TITLE KEY IS " + WorkorderTypeKey + "  OrganizationID  =" + OrganizationID);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @OrganizationID=?;call usp_editviewWorkOrderType(@WorkorderTypeKey,@OrganizationID)', [WorkorderTypeKey, OrganizationID], function (err, rows) {
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

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @OrganizationID=?;call usp_editviewDepartment(@DepartmentKey,@OrganizationID)', [DepartmentKey, OrganizationID], function (err, rows) {
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

    var jobtittlekey = req.body.JobTitleKey;
    var jobtittle = req.body.JobTitle;
    var jobdescription = req.body.JobTitleDescription;
    var empkey = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;

    console.log(" INSIDE UPDATING JOBTITLE " + jobtittlekey + " " + jobtittle + " " + jobdescription);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtittlekey=?;set @jobtittle=?;set @jobdescription=?; set @empkey=?;set @OrganizationID=?; call usp_updateSelectedJobTitle(@jobtittlekey,@jobtittle,@jobdescription,@empkey,@OrganizationID)', [jobtittlekey, jobtittle, jobdescription, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[5]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/editSelectedWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var WorkorderTypeKey = req.body.WorkorderTypeKey;
    var WorkorderTypeName = req.body.WorkorderTypeName;
    var RoomTypeKey = req.body.RoomTypeKey;
    var Frequency = req.body.Frequency;
    var Repeatable = req.body.Repeatable;
    var WorkorderTime = req.body.WorkorderTime;
    var OrganizationID = req.body.OrganizationID;
    var metric = req.body.metric;
    var MetricType = req.body.MetricType;
    if (Repeatable == true) {
        Repeatable = 'Y';
    } else {
        Repeatable = 'N';
    }

    console.log(" INSIDE UPDATING JOBTITLE " + WorkorderTypeKey + " " + WorkorderTypeName + " " + RoomTypeKey + " " + Frequency + " " + Repeatable + " " + WorkorderTime + " " + metric + " " + MetricType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderTypeKey=?;set @WorkorderTypeName=?;set @RoomTypeKey=?;set @Frequency=?;set @Repeatable=?;set @WorkorderTime=?; set @OrganizationID=?;set @metric=?;set @MetricType=?;call usp_editSelectedWorkordertype(@WorkorderTypeKey,@WorkorderTypeName,@RoomTypeKey,@Frequency,@Repeatable,@WorkorderTime,@OrganizationID,@metric,@MetricType)', [WorkorderTypeKey, WorkorderTypeName, RoomTypeKey, Frequency, Repeatable, WorkorderTime, OrganizationID, metric, MetricType], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[9]));


                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/editSelectedDepartment', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = req.body.empkey;
    var DepartmentKey = req.body.DepartmentKey;
    var DepartmentName = req.body.DepartmentName;
    var OrganizationID = req.body.OrganizationID;


    console.log(" INSIDE UPDATING Department " + DepartmentKey + " " + DepartmentName);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @DepartmentKey=?;set @DepartmentName=?; set @empkey=?;set @OrganizationID=?; call usp_editSelectedDepartment(@DepartmentKey,@DepartmentName,@empkey,@OrganizationID)', [DepartmentKey, DepartmentName, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_employeesByIdGet(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query("set @employeekey=?;set @OrganizationID=?; call usp_getallEquipment(@employeekey,@OrganizationID)", [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    console.log("skey is " + EquipmentTypeKey + "  " + EquipmentKey + "  " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @EquipmentTypeKey=?;set @EquipmentKey=?; set @employeekey=?; set @OrganizationID=?;call usp_barcodeReportByEquipment(@EquipmentTypeKey,@EquipmentKey,@employeekey,@OrganizationID)", [EquipmentTypeKey, EquipmentKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/supervisorname', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_auditorsDetails(@managerID,@OrganizationID)", [managerID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEmployeeStatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_getEmployeeStatus(@managerID,@OrganizationID)", [managerID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

//Author: Prakash Code Starts for Employee Calendar Starts Here
app.options('/update_employee_info', supportCrossOriginScript);
app.post(securedpath + '/update_employee_info', supportCrossOriginScript, function (req, response) {

    var employeekey = req.body.EmployeeKey;
    var metaupdatedby = req.body.managerKey;

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
    // var isSupervisor = req.body.IsSupervisor;
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

    // var start_sun_hour = req.body.start_sun_hour;
    // var start_sun_min = req.body.start_sun_min;
    // var start_sun_format = req.body.start_sun_format;
    // var start_mon_hour = req.body.start_mon_hour;
    // var start_mon_min = req.body.start_mon_min;
    // var start_mon_format = req.body.start_mon_format;
    // var start_tue_hour = req.body.start_tue_hour;
    // var start_tue_min = req.body.start_tue_min;
    // var start_tue_format = req.body.start_tue_format;
    // var start_wed_hour = req.body.start_wed_hour;
    // var start_wed_min = req.body.start_wed_min;
    // var start_wed_format = req.body.start_wed_format;
    // var start_thu_hour = req.body.start_thu_hour;
    // var start_thu_min = req.body.start_thu_min;
    // var start_thu_format = req.body.start_thu_format;
    // var start_fri_hour = req.body.start_fri_hour;
    // var start_fri_min = req.body.start_fri_min;
    // var start_fri_format = req.body.start_fri_format;
    // var start_sat_hour = req.body.start_sat_hour;
    // var start_sat_min = req.body.start_sat_min;
    // var start_sat_format = req.body.start_sat_format;
    // var end_sun_hour = req.body.end_sun_hour;
    // var end_sun_min = req.body.end_sun_min;
    // var end_sun_format = req.body.end_sun_format;
    // var end_mon_hour = req.body.end_mon_hour;
    // var end_mon_min = req.body.end_mon_min;
    // var end_mon_format = req.body.end_mon_format;
    // var end_tue_hour = req.body.end_tue_hour;
    // var end_tue_min = req.body.end_tue_min;
    // var end_tue_format = req.body.end_tue_format;
    // var end_wed_hour = req.body.end_wed_hour;
    // var end_wed_min = req.body.end_wed_min;
    // var end_wed_format = req.body.end_wed_format;
    // var end_thu_hour = req.body.end_thu_hour;
    // var end_thu_min = req.body.end_thu_min;
    // var end_thu_format = req.body.end_thu_format;
    // var end_fri_hour = req.body.end_fri_hour;
    // var end_fri_min = req.body.end_fri_min;
    // var end_fri_format = req.body.end_fri_format;
    // var end_sat_hour = req.body.end_sat_hour;
    // var end_sat_min = req.body.end_sat_min;
    // var end_sat_format = req.body.end_sat_format;

    // var idscheduler_exception = req.body.idscheduler_exception;

    // var idmaster_exception_weekend = req.body.idmaster_exception_weekend;

    // var idemployeegrouping = req.body.idemployeegrouping;

    // console.log("-----------------isSupervisor----------------" + isSupervisor + "  " + firstname + "  " + employeenumber + "birthdate" + birthdate + "hiredate" + hiredate);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @SupervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?; set @UserRoleTypeKey=?;set @EmployeeStatusKey1=?;set @Remark=?;call usp_employeesUpd(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@SupervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize,@UserRoleTypeKey,@EmployeeStatusKey1,@Remark)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, SupervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize, UserRoleTypeKey, EmployeeStatusKey1, Remark], function (err, rows) {
                //  set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;set @idmaster_exception_weekend=?;set @idemployeegrouping=?;

                // @start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception, @idmaster_exception_weekend, @idemployeegrouping

                // start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    response.end(JSON.stringify(rows[33]));
                }
            });
        }
        connection.release();
    });
});

//Author: Prakash Code Starts for Employee Calendar Ends Here
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
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actiontypeKey=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @empType=?;call usp_eventAdd(@actiontypeKey,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@empType);', [actiontypeKey, venue, meetingDate, eventhost, endtime, starttime, count, empType], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var venue = url.parse(req.url, true).query['venue'];
    var meetingDate = url.parse(req.url, true).query['mdate'];
    var eventhost = url.parse(req.url, true).query['eventhost'];
    var endtime = url.parse(req.url, true).query['etime'];
    var starttime = url.parse(req.url, true).query['stime'];
    var count = url.parse(req.url, true).query['count'];
    var empType = url.parse(req.url, true).query['selectedEmployee'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actiontypeKey=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @empType=?;call usp_eventAdd(@actiontypeKey,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@empType);', [actiontypeKey, venue, meetingDate, eventhost, endtime, starttime, count, empType], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_facilityZoneGet(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @empkey=?;call usp_facilityRoomGet(@empkey)', [empkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.options('/newEvent_employee', supportCrossOriginScript);
app.post(securedpath + '/newEvent_employee', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @eventType=?;set @eventName=?;set @eventDescription=?;set @venue=?;set @meetingDate=?;set @eventhost=?;set @endtime=?;set @starttime=?;set @count=?;set @selectedEmployee=?; set @metaupdatedby=?; call usp_newEventAdd(@eventType,@eventName,@eventDescription,@venue,@meetingDate,@eventhost,@endtime,@starttime,@count,@selectedEmployee,@metaupdatedby);', [eventType, eventName, eventDescription, venue, meetingDate, eventhost, endtime, starttime, count, selectedEmployee, metaupdatedby], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobTitle=?;set @empkey=?;set @OrganizationID=?;call usp_employeeKeyByJobtitle(@jobTitle,@empkey,@OrganizationID)', [jobTitle, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @shiftkey=?; set @zone=?; set @shiftTypeKey=?; set @start_date=?; set @end_date=?; set @employeeKeyList=?; set @updatedBy=?;set @OrganizationID=?; call usp_addEmployeeScheduling(@shiftkey,@zone,@shiftTypeKey,@start_date,@end_date,@employeeKeyList,@updatedBy,@OrganizationID)', [shiftkey, zone, shiftTypeKey, start_date, end_date, employeeKeyList, updatedBy, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_addSchedulingSupervisor(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@metaupdatedby,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end("success");

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/editEmp_scheduling', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var shift_Key = url.parse(req.url, true).query['shift_Key'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shift_Key=?; call usp_employeeSchedulingEdit(@shift_Key)', [shift_Key], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @shift_Key=?; call usp_supervisorSchedulingEdit(@shift_Key)', [shift_Key], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});
//add addTemplatequestion - :Pooja's code starts

app.post(securedpath + '/addTemplatequestion', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var question = newobject.question;

    var templatename = newobject.templatename;

    var ScoringTypeKey = newobject.scoringTypeKey;


    var metaupdatedby = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templatename=?;set @ScoringTypeKey=?;set @question=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_templateAdd(@templatename,@ScoringTypeKey,@question,@metaupdatedby,@OrganizationID)', [templatename, ScoringTypeKey, question, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                res.end();
            });
        }
        connection.release();
    });
});

//add addTemplatequestion - :Pooja's code ends

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
            connection.query('set @pageno=?; set @itemsPerPage=?; set @date=?; set @employeekey=?; set @OrganizationID=?; call usp_getInspectionByDate(@pageno,@itemsPerPage,@date,@employeekey,@OrganizationID)', [pageno, itemsPerPage, to_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @search_DT=?;set @search_DT2=?; set @empkey=?; set @OrganizationID=?;  call usp_viewAllInspectionByDates(@search_DT,@search_DT2,@empkey,@OrganizationID)', [search_DT, search_DT2, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scoringTypeKey=?; set@OrganizationID=?;call usp_allTemplatesGet(@scoringTypeKey,@OrganizationID)', [scoringTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getFloorByFacility(@fkey,@OrganizationID)", [fkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getZoneByFacility(@fkey,@OrganizationID)", [fkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getRoomtypeByFacility(@fkey,@OrganizationID)", [fkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @OrganizationID=?;call usp_getRoomByFacility(@fkey,@OrganizationID)", [fkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @flkey=?; set @fkey=?;set @OrganizationID=?;  call usp_floorZoneById(@flkey,@fkey,@OrganizationID)', [flkey, fkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});




app.get(securedpath + '/roomtypeByFacility_Floor_zone', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fkey = url.parse(req.url, true).query['fkey'];
    var flkey = url.parse(req.url, true).query['floorkey'];
    var zon = url.parse(req.url, true).query['zonekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @flkey=?;set @zon=?;set @OrganizationID=?; call usp_getRoomTypeByFacility_Floor_zone(@fkey,@flkey,@zon,@OrganizationID) ", [fkey, flkey, zon, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @flkey=?;set @zon=?; set @OrganizationID=?;call usp_getRoomByFacility_Floor_zone(@fkey,@flkey,@zon,@OrganizationID) ", [fkey, flkey, zon, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zone=?; set @OrganizationID=?;call usp_getRoomByFacility_Zone(@fkey,@zone,@OrganizationID)", [fkey, zone, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @floor=?;set @zone=?;set @roomtype=?;set @OrganizationID=?; call usp_getRoomByFacility_Floor_Zone_RoomType(@fkey,@floor,@zone,@roomtype,@OrganizationID)", [fkey, floor, zone, roomtype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @floor=?; set @roomtype=?; set @OrganizationID=?;call usp_getRoomByFacility_Floor_RoomType(@fkey,@floor,@roomtype,@OrganizationID)", [fkey, floor, roomtype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?;set @zone=?; set @roomtype=?; set @OrganizationID=?;call usp_getRoomByFacility_Zone_RoomType(@fkey,@zone,@roomtype,@OrganizationID)", [fkey, zone, roomtype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?; set @roomtype=?;set @OrganizationID=?; call usp_getRoomByFacility_RoomType(@fkey,@roomtype,@OrganizationID)", [fkey, roomtype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomIdsByFac_Rtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var rt = url.parse(req.url, true).query['rtype'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?;set @rt=?; call usp_getRoomIdsByFac_Rtype(@fac,@rt)', [fac, rt], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getRoomIdsByFac_Floor_Rtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var floor = url.parse(req.url, true).query['floor'];
    var rt = url.parse(req.url, true).query['rtype'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?; set @floor=?; set @rt=?; call usp_getRoomIdsByFac_Floor_Rtype(@fac,@floor,@rt)', [fac, floor, rt], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRoomIdsByFac_Zone_Rtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fac = url.parse(req.url, true).query['facility'];
    var zone = url.parse(req.url, true).query['zone'];
    var rt = url.parse(req.url, true).query['rtype'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fac=?; set @zone=?; set @rt=?; call usp_getRoomIdsByFac_Zone_Rtype(@fac,@zone,@rt)', [fac, zone, rt], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?; set @roomkey=?; call usp_getFloor_zonekeyByFac_Rkey(@facility,@roomkey)', [facility, roomkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?;set roomkey=?;set @floorkey=?; call usp_getZonekeyByFac_floor_Rkey(@facility,@roomkey,@floorkey)', [facility, roomkey, floorkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility=?; set @roomkey=?; set @zonekey=?; call usp_getFloorkeyByFac_zone_Rkey(@facility,@roomkey,@zonekey)', [facility, roomkey, zonekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/selectMorningShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var t_date = url.parse(req.url, true).query['t_date'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @t_date=?; call usp_getMorningShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @t_date=?; call usp_getEveningShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @t_date=?; call usp_getNightShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @t_date=?; call usp_getSupervisorMorningShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @t_date=?; call usp_getSupervisorEveningShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @t_date=?; call usp_getSupervisorNightShift(@t_date)', [t_date], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @shiftKey=?;set @shifttypes=?;set @shiftInCharge=?; set @zoneKey=?; set @startTime=?; set @endTime=?;set @OrganizationID=?;call usp_updateSupervisorSchedule(@shiftKey,@shifttypes,@shiftInCharge,@zoneKey,@startTime,@endTime,@OrganizationID)', [shiftKey, shifttypes, shiftInCharge, zoneKey, startTime, endTime, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});



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
            connection.query('set @pageno=?;set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_getUploadsView(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @formtype=?; set @empkey=?; set @OrganizationID=?; call usp_getUploadsView_sorted(@formtype,@empkey,@OrganizationID)', [formtype, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewimage/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

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
            connection.query('set @facility=?;set @OrganizationID=?;call usp_facilityByIdGet(@facility,@OrganizationID)', [facility, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/getFloorById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var floor = url.parse(req.url, true).query['floorKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floorKey=?; set@OrganizationID=?; call usp_floorByIdGet(@floorKey,@OrganizationID)', [floor, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/getScheduleById', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var bkey = url.parse(req.url, true).query['bkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bkey=?;set @OrganizationID=?;call usp_getScheduleById(@bkey,@OrganizationID)', [bkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });

});

//add facility,update facility,deletefacility - :Pooja's code starts
app.options('/deleteFacility', supportCrossOriginScript);
app.post(securedpath + '/deleteFacility', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var facility_key = newobject.facility_key;

    var metaupdatedby = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @metaupdatedby=?; set @OrganizationID=?;call usp_facilityRemove(@facility_key,@metaupdatedby,@OrganizationID)', [facility_key, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end();
                }

            });
        }
        connection.release();
    });
});

app.options('/addfacility', supportCrossOriginScript);
app.post(securedpath + '/addfacility', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newobject = {};
    newobject = req.body;
    var facility = newobject.fac;

    var userId = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;




    var facilityKey = -99;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @userId=?;set @quest=?;set @facilityKey=?;set @OrganizationID=?; call usp_facilityAdd(@userId,@quest,@facilityKey,@OrganizationID)', [userId, facility, facilityKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/updateFacility', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newobject = {};
    newobject = req.body;
    var facility_key = newobject.facility_key;

    var facility_name = newobject.facility_name;
    var metaupdatedby = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @facility_name=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_facilitiesUpdate(@facility_key,@facility_name,@metaupdatedby,@OrganizationID)', [facility_key, facility_name, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});
//add facility,update facility,deleteFacility- :Pooja's code ends
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?;set @OrganizationID=?;call usp_facilityFloorGet(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));

                }
            });
        }
        connection.release();
    });
});

//deleting floor - Pooja's code starts
app.options('/deleteFloor', supportCrossOriginScript);
app.post(securedpath + '/deleteFloor', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var floor_key = newobject.FloorKey;

    var facility_key = newobject.FacilityKey;
    var metaupdatedby = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floor_key=?;set @facility_key=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_floorRemove(@floor_key,@facility_key,@metaupdatedby,@OrganizationID)', [floor_key, facility_key, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end();
                }

            });
        }
        connection.release();
    });
});
//Pooja's code ends
app.options('/deleteBatchName', supportCrossOriginScript);
app.post(securedpath + '/deleteBatchName', supportCrossOriginScript, function (req, res) {
    var batchKey = url.parse(req.url, true).query['batchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @batchKey=?;set @OrganizationID=?; call usp_deleteBatchName(@batchKey,@OrganizationID)', [batchKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(" successfull");
                }

            });
        }
        connection.release();
    });
});


//add new floor -Pooja's code starts
app.options('/addnewfloor', supportCrossOriginScript);
app.post(securedpath + '/addnewfloor', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var FacilityKey = newobject.FacilityKey;

    var FloorName = newobject.FloorName;
    var FloorDescription = newobject.FloorDescription;
    var floorKey = newobject.floorKey;
    var userId = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?;set @metaupdatedby=?;set @floor=?;set @floorName=?;set @floordesc=?; set@OrganizationID=?; call usp_floorAdd(@FacilityKey,@metaupdatedby,@floor,@floorName,@floordesc,@OrganizationID)', [FacilityKey, userId, floorKey, FloorName, FloorDescription, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
//Pooja's code ends
app.options('/addnewbatchName', supportCrossOriginScript);
app.post(securedpath + '/addnewbatchName', supportCrossOriginScript, function (req, res) {

    var bname = req.body.BatchSchduleName;
    var bdesp = req.body.ScheduleDescription;
    var empkey = req.body.EmployeeKey;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var Date = req.body.Date;
    var managerKey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    var masterShiftID = req.body.masterShiftID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bname=?;set @bdesp=?;set @empkey=?;set @masterShiftID=?;set @startTime=?; set@endTime=?; set@Date=?; set @managerKey=?; set @OrganizationID=?;call usp_addnewbatchName(@bname,@bdesp,@empkey,@masterShiftID,@startTime,@endTime,@Date,@managerKey,@OrganizationID)', [bname, bdesp, empkey, masterShiftID, startTime, endTime, Date, managerKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[9]));
                }
            });
        }
        connection.release();
    });
});


app.options('/addnewWorkorderStatus', supportCrossOriginScript);
app.post(securedpath + '/addnewWorkorderStatus', supportCrossOriginScript, function (req, res) {


    var WorkorderStatus = req.body.WorkorderStatus;
    var WorkorderStatusDescription = req.body.WorkorderStatusDescription;

    var employeekey = req.body.employeekey;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?;set @WorkorderStatusDescription=?;set @employeekey=?; call usp_addnewWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@employeekey)', [WorkorderStatus, WorkorderStatusDescription, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
//Pooja's code starts
app.options('/updateFloor', supportCrossOriginScript);
app.post(securedpath + '/updateFloor', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var facilityKey = newobject.FacilityKey;

    var floorName = newobject.FloorName;
    var floorDescription = newobject.FloorDescription;
    var floorKey = newobject.FloorKey;
    var userId = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @floor_key=?; set @floor_name=?; set @floorDescription=?;set @userId=?; set @OrganizationID=?; call usp_floorUpdate(@facility_key,@floor_key,@floor_name,@floorDescription,@userId,@OrganizationID)', [facilityKey, floorKey, floorName, floorDescription, userId, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/empSelectWithFilterInMeetCreate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var emKey = req.body.emKey;
    var OrgID = req.body.OrgID;
    var JobT = req.body.JobT;
    var Sup = req.body.Sup;
    var DeptKey = req.body.DeptKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @emKey=?;set @OrgID=?;set @JobT=?;set @Sup=?;set @DeptKey=?; call usp_empSelectWithFilterInMeetCreate(@emKey,@OrgID,@JobT,@Sup,@DeptKey)', [emKey, OrgID, JobT, Sup, DeptKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[5]));


                }
            });
        }
        connection.release();
    });
});
//Pooja's code ends
app.options('/updateScheduleName', supportCrossOriginScript);
app.post(securedpath + '/updateScheduleName', supportCrossOriginScript, function (req, res) {
    var bname = req.body.BatchSchduleName;
    var bdesp = req.body.ScheduleDescription;
    var empkey = req.body.EmployeeKey;
    var bkey = req.body.bskey;
    var managerkey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var shiftKey = req.body.shiftKey;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bname=?; set @bdesp=?; set @empkey=?; set @bkey=?; set @managerkey=?;set @OrganizationID=?; set@startTime=?; set@endTime=?; set@shiftKey=?; call usp_updateScheduleName(@bname,@bdesp,@empkey,@bkey,@managerkey,@OrganizationID,@startTime,@endTime,@shiftKey)', [bname, bdesp, empkey, bkey, managerkey, OrganizationID, startTime, endTime, shiftKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});
//for edit from assignment schedule view starts here
app.options('/saveEmployeechange', supportCrossOriginScript);
app.post(securedpath + '/saveEmployeechange', supportCrossOriginScript, function (req, res) {
    var bname = req.body.BatchSchduleName;
    var bdesp = req.body.ScheduleDescription;
    var empkey = req.body.EmployeeKey;
    var bkey = req.body.bskey;
    var managerkey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    var scheduleDT = req.body.ScheduleDT;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bname=?; set @bdesp=?; set @empkey=?; set @bkey=?; set @managerkey=?;set @OrganizationID=?; set @scheduleDT=?; call usp_updateEmployeeChange(@bname,@bdesp,@empkey,@bkey,@managerkey,@OrganizationID,@scheduleDT)', [bname, bdesp, empkey, bkey, managerkey, OrganizationID, scheduleDT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));

                }
            });
        }
        connection.release();
    });
});
//for edit from assignment schedule view ends here
app.options('/updateWorkorderStatus', supportCrossOriginScript);
app.post(securedpath + '/updateWorkorderStatus', supportCrossOriginScript, function (req, res) {
    var WorkorderStatus = req.body.WorkorderStatus;
    var WorkorderStatusDescription = req.body.WorkorderStatusDescription;
    var WorkorderStatusKey = req.body.WorkorderStatusKey;

    var userId = req.body.employeekey;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?; set @WorkorderStatusDescription=?; set @WorkorderStatusKey=?; set @userId=?;call usp_updateWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@WorkorderStatusKey,@userId)', [WorkorderStatus, WorkorderStatusDescription, WorkorderStatusKey, userId], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?; call usp_facilityFloorZoneGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone_key=?; set@OrganizationID=?; call usp_zoneById(@zone_key,@OrganizationID)', [zone_key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var metaupdatedby = req.body.metaUpdatedBy;
    var workorderKeys = req.body.workorderkeylist;
    console.log("workorderKeys" + workorderKeys + "template..." + templateid + "employee..." + employeekey + "inspectiondate...." + inspectiondate + "metaupdatedby.." + metaupdatedby);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;set @employeekey=?;set @inspectiondate=?;set @timer=?;set @metaupdatedby=?; set @workorderKeys=?; call usp_inspectionorderAdd(@templateid,@employeekey,@inspectiondate,@timer,@metaupdatedby,@workorderKeys)', [templateid, employeekey, inspectiondate, timer, metaupdatedby, workorderKeys], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @empkey=?;call usp_floorGet(@empkey)', [empkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
//add zone - Pooja's code starts
app.options('/addnewzone', supportCrossOriginScript);
app.post(securedpath + '/addnewzone', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var FacilityKey = newobject.facility;

    var FloorName = newobject.floor;
    var ZoneName = newobject.zone;
    var employeekey = newobject.employeekey;
    var OrganizationID = newobject.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @quest=?;set @zone=?; set @floor=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_zoneAdd(@quest,@zone,@floor,@metaupdatedby,@OrganizationID)', [FacilityKey, ZoneName, FloorName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
// Pooja's code ends
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set @floor_key=?;set @zone_key=?; set @zone_name=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_zoneUpdate(@facility_key,@floor_key,@zone_key,@zone_name,@metaupdatedby,@OrganizationID)', [facility_key, floor_key, zone_key, zone_name, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facility_key=?; set@OrganizationID=?; call usp_facilityFloorById(@facility_key,@OrganizationID)', [facility_key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floor_key=?; set @facility_key=?; set @OrganizationID=?;call usp_floorZoneById(@floor_key,@facility_key,@OrganizationID)', [floor_key, facility_key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});
app.options('/deleteZoneById', supportCrossOriginScript);
app.post(securedpath + '/deleteZoneById', supportCrossOriginScript, function (req, res) {
    var facility = req.body.facility;
    var floorkey = req.body.floorkey;
    var zoneKey = req.body.zoneKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zoneKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_zoneRemove(@zoneKey,@metaupdatedby,@OrganizationID)', [zoneKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?; call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });
});
app.options('/deleteFloorTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteFloorTypeById', supportCrossOriginScript, function (req, res) {
    var floortypekey = req.body.floortypekey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @floortypekey=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeRemove(@floortypekey,@metaupdatedby,@OrganizationID)', [floortypekey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @floortypekey=?; set @OrganizationID=?; call usp_floorTypeById(@floortypekey,@OrganizationID)', [floortypekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @floortypekey=?; set @floortypename=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeUpdate(@floortypekey,@floortypename,@metaupdatedby,@OrganizationID)', [floortypekey, floortypename, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @floortypename=?; set @metaupdatedby=?; set @OrganizationID=?; call usp_floortypeAdd(@floortypename,@metaupdatedby,@OrganizationID)', [floortypename, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getShiftkey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shift = url.parse(req.url, true).query['shifttype'];
    var zone = url.parse(req.url, true).query['zone'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var endDate = url.parse(req.url, true).query['endDate'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @shift =?;set @zone =?;set @startDate =?;set @endDate =?;call usp_getShiftkey(@shift,@zone,@startDate,@endDate)", [shift, zone, startDate, endDate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?;set @OrganizationID=?; call usp_checkassignedShiftDetails(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?;call usp_RoomsGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var room = url.parse(req.url, true).query['roomkey'];
    var metaupdatedby = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @room=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_roomRemove(@room,@metaupdatedby,@OrganizationID)', [room, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @RoomKey=?;set @OrganizationID=?;call usp_RoomById(@RoomKey,@OrganizationID)', [RoomKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @username=?;set @empkey=?;set @OrganizationID=?;call usp_getUserEmail(@username,@empkey,@OrganizationID)', [username, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_roomTypeGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @floorkey=?; set @floortypekey=?; set @zonekey=?; set @roomtypekey=?; set @roomkey=?; set @area=?; set @roomname=?; set @metaupdatedby=?; set @Barcode=?; set @OrganizationID=?; call usp_roomUpdate(@facilitykey,@floorkey,@floortypekey,@zonekey,@roomtypekey,@roomkey,@area,@roomname,@metaupdatedby,@Barcode,@OrganizationID)', [facilitykey, floorkey, floortypekey, zonekey, roomtypekey, roomkey, area, roomname, metaupdatedby, Barcode, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @floorkey=?; set @floortypekey=?; set @zonekey=?; set @roomtypekey=?; set @roomkey=?; set @area=?; set @roomname=?; set @metaupdatedby=?; set @Barcode=?; set @OrganizationID=?; call usp_roomAdd(@facilitykey,@floorkey,@floortypekey,@zonekey,@roomtypekey,@roomkey,@area,@roomname,@metaupdatedby,@Barcode,@OrganizationID)', [facilitykey, floorkey, floortypekey, zonekey, roomtypekey, roomkey, area, roomname, metaupdatedby, Barcode, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @roomtypekey=?; set@OrganizationID=?; call usp_roomtypeById(@roomtypekey,@OrganizationID)', [roomtypekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @roomtypekey=?; set @roomtype=?; set @metaupdatedby=?; set @metric=?; set @MetricType=?; set @MetricTypeValue=?; set@OrganizationID=?; call usp_roomtypeUpdate(@roomtypekey,@roomtype,@metaupdatedby,@metric,@MetricType,@MetricTypeValue,@OrganizationID)', [roomtypekey, roomtype, metaupdatedby, metric, MetricType, MetricTypeValue, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomtype=?; set @metaupdatedby=?; set @metric=?; set @MetricType=?; set @MetricTypeValue=?;set @OrganizationID=?; call usp_roomtypeAdd(@roomtype,@metaupdatedby,@metric,@MetricType,@MetricTypeValue,@OrganizationID)', [roomtype, metaupdatedby, metric, MetricType, MetricTypeValue, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteRoomTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteRoomTypeById', supportCrossOriginScript, function (req, res) {
    var roomTypeKey = req.body.roomTypeKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_roomtypeRemove(@roomTypeKey,@metaupdatedby,@OrganizationID)', [roomTypeKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pageno=?; set @itemsperpage=?;set @empkey=?;set @OrganizationID=?; call usp_equipmentTypeEquipmentGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @equipmentKey=?;set @OrganizationID=?; call usp_equipmentKeyByIdGet(@equipmentKey,@OrganizationID)', [equipmentKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteEquipmentById', supportCrossOriginScript);
app.post(securedpath + '/deleteEquipmentById', supportCrossOriginScript, function (req, res) {
    var equipmentKey = req.body.EquipmentKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentKey=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_equipmentRemove(@equipmentKey,@metaupdatedby,@OrganizationID)', [equipmentKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Equipment_Key=?;set @EquipmentType_Key=?;set @Equipment_Type=?;set @Equipment_Name=?; set @EquipmentDescription=?; set @metaupdatedby=?;set @eqbarcode=?;set @facilityKey=?;set @floorKey=?;set @OrganizationID=?; set @barcodeINT=?; call usp_equipmentUpdate(@Equipment_Key,@EquipmentType_Key,@Equipment_Type,@Equipment_Name,@EquipmentDescription,@metaupdatedby,@eqbarcode,@facilityKey,@floorKey,@OrganizationID,@barcodeINT)', [Equipment_Key, EquipmentType_Key, Equipment_Type, Equipment_Name, EquipmentDescription, metaupdatedby, eqbarcode, FacilityKey, FloorKey, OrganizationID, barcodeINT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[11]));

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentType_key=?;set @Equipment=?; set @Equipmentdesc=?; set @metaupdatedby=?;set @eqbarcode=?;set @facilityKey=?;set @floorKey=?;set @OrganizationID=?; set @barcodeINT=?; call usp_equipmentAdd(@equipmentType_key,@Equipment,@Equipmentdesc,@metaupdatedby,@eqbarcode,@facilityKey,@floorKey,@OrganizationID,@barcodeINT)', [equipmentType_key, Equipment, Equipmentdesc, metaupdatedby, eqbarcode, FacilityKey, FloorKey, OrganizationID, barcodeINT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

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
            connection.query('set @equipmentTypeKey=?; set@OrganizationID=?; call usp_equipmentTypeKeyById(@equipmentTypeKey,@OrganizationID)', [equipmentTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

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
            connection.query('set @EquipmentType=?; set @EquipmentTypeDescription=?; set @EquipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeUpdate(@EquipmentType,@EquipmentTypeDescription,@EquipmentTypeKey,@metaupdatedby,@OrganizationID)', [EquipmentType, EquipmentTypeDescription, EquipmentTypeKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

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
            connection.query('set @EquipmentType=?; set @EquipmentTypeDescription=?; set @EquipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeAdd(@EquipmentType,@EquipmentTypeDescription,@EquipmentTypeKey,@metaupdatedby,@OrganizationID)', [EquipmentType, EquipmentTypeDescription, EquipmentTypeKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.options('/deleteEquipmentTypeById', supportCrossOriginScript);
app.post(securedpath + '/deleteEquipmentTypeById', supportCrossOriginScript, function (req, res) {
    var equipmentTypeKey = req.body.equipmentTypeKey;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @equipmentTypeKey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_equipmentTypeRemove(@equipmentTypeKey,@metaupdatedby,@OrganizationID)', [equipmentTypeKey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.options('/addMeetingTraining', supportCrossOriginScript);
app.post(securedpath + '/addMeetingTraining', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actionKey=?; set @eventhost=?; set @venue=?;set @MeetingNotes=?; set @meetingDate=?; set @startTime=?; set @endTime=?; set @employeeKeyList=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_addEventByActionKey(@actionKey,@eventhost,@venue,@MeetingNotes,@meetingDate,@startTime,@endTime,@employeeKeyList,@metaupdatedby,@OrganizationID)', [actionKey, eventhost, venue, MeetingNotes, meetingDate, startTime, endTime, employeeKeyList, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    res.end(JSON.stringify(rows));
                }
            });
        }
        connection.release();
    });
});
app.options('/addMeetinTraingByNewEvent', supportCrossOriginScript);
app.post(securedpath + '/addMeetinTraingByNewEvent', supportCrossOriginScript, function (request, res) {

    var eventType = request.body.eventType;//

    var eventDescription = request.body.eventDescription;//
    var eventName = request.body.eventName;//
    var EmployeeKey = request.body.EmployeeKey;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @eventType=?; set @eventName=?; set @eventDescription=?; set @EmployeeKey=?;set @OrganizationID=?; call usp_addEventOnly(@eventType,@eventName,@eventDescription,@EmployeeKey,@OrganizationID)', [eventType, eventName, eventDescription, EmployeeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

                    console.log("ROWS" + JSON.stringify(rows[4]));

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftTypeKey=?;set @date1=?;call usp_getEmpKeysByShiftKey(@shiftTypeKey,@date1)', [shiftTypeKey, date1], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @templateId=?; set@OrganizationID=?;call usp_getTemplateQuestions(@templateId,@OrganizationID)', [templateId, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @InspectionorderKey=?;set@OrganizationID=?; call usp_getInspectionorderByKey(@InspectionorderKey,@OrganizationID)', [inspectionorder_Key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @username=?; set@OrganizationID=?; call usp_getSupervisorInspectionView(@date,@username,@OrganizationID)', [to_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
var uploadPhoto = multer({ storage: Photostorage }).single('userPhoto');




app.get(securedpath + '/barcodeRoom_check', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
    var WorkorderKey = url.parse(req.url, true).query['wkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @barcode =?;set @workdetail =?; set @OrganizationID =?;call usp_WorkorderStatusCheckByBarcode(@barcode,@workdetail,@OrganizationID)", [barcode, WorkorderKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0].res));
                }


            });
        }
        connection.release();
    });
});
app.get(securedpath + '/barcodeRoom', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];

    var workorderkey = url.parse(req.url, true).query['wkey'];
    var updatetype = url.parse(req.url, true).query['updatetype'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?;set @barcode=?; set @empkey=?; set @updatetype=?; set @OrganizationID=?;call usp_WorkorderStatusUpdateByBarcode(@workdetail,@barcode,@empkey,@updatetype,@OrganizationID)", [workorderkey, barcode, employeekey, updatetype, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[5][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/barcodeRoom_Ang', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];

    var workorderkey = url.parse(req.url, true).query['wkey'];
    var updatetype = url.parse(req.url, true).query['updatetype'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var complete_Time = url.parse(req.url, true).query['complete_Time'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?;set @barcode=?; set @empkey=?; set @updatetype=?; set @OrganizationID=?;set @complete_Time=?;call usp_WorkorderStatusUpdateByBarcode_Ang6(@workdetail,@barcode,@empkey,@updatetype,@OrganizationID,@complete_Time)", [workorderkey, barcode, employeekey, updatetype, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[5][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getScheduleDescription', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var key = url.parse(req.url, true).query['key'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @key =?; set @OrganizationID =?; call usp_getScheduleDescription(@key,@OrganizationID)", [key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[1][0]));
                }
            });
        }
        connection.release();
    });
});

//Barcode scan to complete workorder ends
app.options('/completionTime', supportCrossOriginScript);
app.post(securedpath + '/completionTime', supportCrossOriginScript, function (req, res) {


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
            connection.query("set @Workorderkey=?; set  @Timetaken=?; set @EmployeeKey=?;set @OrganizationID=?; call usp_workCompletionTime(@Workorderkey,@Timetaken,@EmployeeKey,@OrganizationID)", [Workorderkey, Timetaken, EmployeeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/workCompleted', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var work_det_key = url.parse(req.url, true).query['wkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?; set @employeekey=?; set @OrganizationID=?;call usp_WorkorderStatusUpdate(@workdetail,@employeekey,@OrganizationID)", [work_det_key, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/workCompleted_Ang6', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var work_det_key = url.parse(req.url, true).query['wkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var complete_Time = url.parse(req.url, true).query['complete_Time'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?; set @employeekey=?; set @OrganizationID=?;set @complete_Time=?;call usp_WorkorderStatusUpdate_Ang6(@workdetail,@employeekey,@OrganizationID,@complete_Time)", [work_det_key, employeekey, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0]));
                }
            });
        }
        connection.release();
    });
});

app.options('/pho1Snapshot_Ang6', supportCrossOriginScript);
app.post(securedpath + '/pho1Snapshot_Ang6', supportCrossOriginScript, function (req, res) {
    var pho = req.body.Filename;
    var wdkey = req.body.Workorderkey;
    var employeekey = req.body.EmployeeKey;
    var OrganizationID = req.body.OrganizationID;
    var complete_Time = req.body.complete_Time;
    var newPath = pho;


    console.log("pho" + pho + " wdkey " + wdkey + " employeekey " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?; set @complete_Time=?; call usp_WorkorderStatusUpdateByPhotoWithSnapshot_Ang6(@wdk,@imgname,@employeekey,@OrganizationID,@complete_Time)", [wdkey, newPath, employeekey, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[5][0].WorkorderStatus));
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


app.get(securedpath + '/updateWorkorderByPhoto', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pho = url.parse(req.url, true).query['pho'];
    var wdkey = url.parse(req.url, true).query['wkey'];

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?;call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID)", [wdkey, pho, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0]));
                }

            });
        }
        connection.release();
    });
});

app.get(securedpath + '/updateWorkorderByPhoto_Ang6', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pho = url.parse(req.url, true).query['pho'];
    var wdkey = url.parse(req.url, true).query['wkey'];

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var complete_Time = url.parse(req.url, true).query['complete_Time'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?;set @complete_Time=?;call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID,@complete_Time)", [wdkey, pho, employeekey, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0]));
                }

            });
        }
        connection.release();
    });
});

app.get(securedpath + '/MaintnancUpdateMsg', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @empKey=?;set @OrganizationID=?; call usp_MaintnancUpdateMsg(@empKey,@OrganizationID)", [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }

            });
        }
        connection.release();
    });
});

//Photo upload ends
app.options('/saveinspectedQuestions', supportCrossOriginScript);
app.post(securedpath + '/saveinspectedQuestions', supportCrossOriginScript, function (req, res) {
    var inspectionnotes = req.body.inspectionnotes;
    var templateQstnValues = req.body.templateQstnValues;
    var templateid = req.body.templateid;
    var inspectionkey = req.body.inspectionkey;
    var questionid = req.body.questionid;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    console.log(".." + inspectionnotes + ".." + templateQstnValues + ".." + templateid + "..." + inspectionkey + ".." + questionid);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionnotes=?; set @templateQstnValues=?; set @templateid=?; set @inspectionkey=?; set @questionid=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_saveInspectedValues(@inspectionnotes,@templateQstnValues,@templateid,@inspectionkey,@questionid,@metaupdatedby,@OrganizationID)', [inspectionnotes, templateQstnValues, templateid, inspectionkey, questionid, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("saveinspectedQuestions...from server.." + JSON.stringify(rows[7]));
                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.options('/websaveinspectedQuestions', supportCrossOriginScript);
app.post(securedpath + '/websaveinspectedQuestions', supportCrossOriginScript, function (req, res) {
    var inspectionnotes = req.body.inspectionnotes;
    var templateQstnValues = req.body.templateQstnValues;
    var templateid = req.body.templateid;
    var inspectionkey = req.body.inspectionkey;
    var questionid = req.body.questionid;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    var ObservationDeficiency = req.body.ObservationDeficiency;
    var CorrectiveAction = req.body.CorrectiveAction;
    var CompletedDate = req.body.CompletedDate;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionnotes=?; set @templateQstnValues=?; set @templateid=?; set @inspectionkey=?; set @questionid=?; set @metaupdatedby=?; set @OrganizationID=?; set @ObservationDeficiency=?; set @CorrectiveAction=?; set @CompletedDate=?;call usp_web_saveInspectedValues(@inspectionnotes,@templateQstnValues,@templateid,@inspectionkey,@questionid,@metaupdatedby,@OrganizationID,@ObservationDeficiency,@CorrectiveAction,@CompletedDate)', [inspectionnotes, templateQstnValues, templateid, inspectionkey, questionid, metaupdatedby, OrganizationID, ObservationDeficiency, CorrectiveAction, CompletedDate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[10]));
                }
            });
        }
        connection.release();
    });
});

app.options('/updateEditedTemplateQuestion', supportCrossOriginScript);
app.post(securedpath + '/updateEditedTemplateQuestion', supportCrossOriginScript, function (req, res) {



    var templateid = req.body.templateid;

    var questionid = req.body.questionid;
    var metaupdatedby = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;  set @questionid=?;set @metaupdatedby=?; set@OrganizationID=?; call usp_updateEditedTemplateQuestion(@templateid,@questionid,@metaupdatedby,@OrganizationID)', [templateid, questionid, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var templateid = req.body.templateid;

    var questionid = req.body.questionid;
    var empKey = req.body.empKey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;  set @questionid=?; set @empKey=?; set@OrganizationID=?; call usp_insertEditedTemplateQuestion(@templateid,@questionid,@empKey,@OrganizationID)', [templateid, questionid, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @inspectionorderkey=?; set @metaupdatedby=?; set@OrganizationID=?; call usp_inspectionCompleted(@inspectionorderkey,@metaupdatedby,@OrganizationID)', [inspectionorderkey, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @shifttypekey=?; set @zonekey=?;set @startdate=?;set @enddate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllAvailableShifts(@shifttypekey,@zonekey,@startdate,@enddate,@empKey,@OrganizationID)', [shifttypekey, zonekey, startdate, enddate, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @workorderkey=?; set @employeekey=?; set@OrganizationID=?; call usp_workorderPhotoGetByKey(@workorderkey,@employeekey,@OrganizationID)', [workorderkey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @WorkorderTypeName=?; set @employeekey=?; set @OrganizationID=?;call usp_checkforcheckForWorkOrderType(@WorkorderTypeName,@employeekey,@OrganizationID)', [WorkorderTypeName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @Employeenumber=?;set @employeekey=?;set @OrganizationID=?; call usp_checkforEmployeeNumber(@Employeenumber,@employeekey,@OrganizationID)', [Employeenumber, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @Employeenumber=?;set @OrganizationID=?; call usp_checkEmpNumberForSuperAdmin(@Employeenumber,@OrganizationID)', [Employeenumber, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var scheduleDT = url.parse(req.url, true).query['date1'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scheduleDT=?;set @managerkey=?;set @empkey=?;set @batchkey=?;set @batchdesp=?;set @OrganizationID=?; call usp_assignChangesForWorkWithDT(@scheduleDT,@managerkey,@empkey,@batchkey,@batchdesp,@OrganizationID)', [scheduleDT, managerkey, empkey, batchkey, batchdesp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @roomkey=?; set @barcode=?; set @empkey=?;set @OrganizationID=?; call usp_checkingForUniqueBarcode_update_Ang6(@roomkey,@barcode,@empkey,@OrganizationID)', [roomkey, barcode, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
    var newobject = {};
    newobject = req.body;
    var OrganizationID = newobject.OrganizationID;
    var metaUpdatedBy = newobject.metaUpdatedBy;
    console.log(OrganizationID + "..." + metaUpdatedBy);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @metaUpdatedBy=?; call usp_organizationRemove(@OrganizationID,@metaUpdatedBy)', [OrganizationID, metaUpdatedBy], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @OrganizationID=?; call usp_OrganizationGet(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @Employeekey=?;set @OrganizationID=?; call usp_getOrganizationforAdmin(@Employeekey,@OrganizationID)', [Employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @managerKey=?; set @OrganizationID=?; call usp_ManagerOrganizationIDGet(@managerKey,@OrganizationID)', [managerKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['workordertypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;set @OrganizationID=?;call usp_checkRoomInWorkOrder(@empkey,@wkey,@rkey,@OrganizationID)", [empkey, wkey, rkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/addRoomInWorkOrder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = req.body.empkey;
    var wkey = req.body.wkey;
    var rkey = req.body.rkey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;set @OrganizationID=?;call usp_addRoomInWorkOrder(@empkey,@wkey,@rkey,@OrganizationID)", [empkey, wkey, rkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @wkey=?;set @rkey=?;call usp_checkRoomFacilityInWorkOrder(@empkey,@wkey,@rkey)", [empkey, wkey, rkey], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['equipmenttypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    switch (domain) {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");

            connection.query('set @key1=?;set @key2=?; set @OrganizationID=?; call usp_domainValuesByKeysAlternative(@key1,@key2,@OrganizationID)', [filter, key, OrganizationID], function (err, rows) {

                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @key=?;set @OrganizationID=?;call usp_properEmployeeList(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

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
            connection.query('set @key=?;set @OrganizationID= ?; call usp_employeeForManager(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['shifttypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['priorities', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?; set @facilitykey=?;set @OrganizationID=?; call usp_workordersViewbyRoomType(@empk,@filter,@key,@ondate,@facilitykey,@OrganizationID)", [empkey, filter, key, on_DT, facilitykey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @fkey=?; set @flkey=?;set @OrganizationID=?; call usp_getRoomByFacility_Floor(@fkey,@flkey,@OrganizationID)", [fkey, flkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fkey=?; set @flkey=?; set @OrganizationID=?;call usp_getRoomtypeByFacility_Floor(@fkey,@flkey,@OrganizationID)", [fkey, flkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var keepActive = newWOObj.keepActive;
    var IsSnapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys + " occursontime " + occursontime);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; set@keepActive=?; set @IsSnapshot=?; call usp_workordersAddSnapshot(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@keepActive,@IsSnapshot) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, keepActive, IsSnapshot], function (err, rows) {

                if (err) {
                    console.log(err);
                } else {
                    res.end(JSON.stringify(rows[22]));
                }

            });

        }
        connection.release();
    });

});



app.options('/addNewWorkorderWithSnapshot', supportCrossOriginScript);
app.post(securedpath + '/addNewWorkorderWithSnapshot', supportCrossOriginScript, function (req, res) {

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
    var keepActive = newWOObj.keepActive;
    var IsSnapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys + " occursontime " + occursontime);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; set@keepActive=?; set @IsSnapshot=?; call usp_workordersAddSnapshot(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@keepActive,@IsSnapshot) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, keepActive, IsSnapshot], function (err, rows) {

                if (err) {
                    console.log(err);
                } else {
                    res.end(JSON.stringify(rows[23]));
                }

            });

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
    var snapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys + " occursontime " + occursontime);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scheduleKey=?; set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?;set @OrganizationID=?;set @snapshot=?; call usp_BatchScheduleAdd(@scheduleKey,@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@snapshot) ', [scheduleKey, workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, snapshot], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.end(JSON.stringify(rows[24]));
                }

            });

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
    var keepActive = newWOObj.keepActive;
    var IsSnapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; set@keepActive=?; set @IsSnapshot=?; call usp_workordersAddwithEquipmentSnapshot(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@keepActive,@IsSnapshot) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, keepActive, IsSnapshot], function (err, rows) {

                if (err) {
                    console.log(err);
                }
                else {
                    res.end(JSON.stringify(rows[24]));
                }

            });

        }
        connection.release();
    });

});


app.options('/addworkorderwithEquipmentSnapshot', supportCrossOriginScript);
app.post(securedpath + '/addworkorderwithEquipmentSnapshot', supportCrossOriginScript, function (req, res) {

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
    var keepActive = newWOObj.keepActive;
    var IsSnapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; set@keepActive=?; set @IsSnapshot=? call usp_workordersAddwithEquipmentSnapshot(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@keepActive,@IsSnapshot) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, keepActive, IsSnapshot], function (err, rows) {

                if (err) {
                    console.log(err);
                }
                else {
                    res.end(JSON.stringify(rows[23]));
                }

            });

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
    var IsSnapshot = newWOObj.IsSnapshot;

    console.log("****************metaupdatedby************" + metaupdatedby + "  ZZZZZZ  " + isphoto + "  ZZZZZZ  " + roomkeys + "  ZZZZZZ  " + facilitykeys + "  ZZZZZZ  " + floorkeys + "  ZZZZZZ  " + zonekeys + "  ZZZZZZ  " + roomtypekeys);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @scheduleKey=?; set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?;set @OrganizationID=?;set @IsSnapshot=?; call usp_addworkorderSchedulewithEquipment(@scheduleKey,@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID,@IsSnapshot) ', [scheduleKey, workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID, IsSnapshot], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.end(JSON.stringify(rows[24]));
                }

            });

        }
        connection.release();
    });

});

app.post(securedpath + '/workorderByallFilters', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;  set @BatchScheduleNameKey=?; set @OrganizationID=?;  call usp_workorderByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@BatchScheduleNameKey,@OrganizationID)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, BatchScheduleNameKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[13]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/viewinspectionCountAllFilter', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);

    var workorderDate = newWOObj.workorderDate;
    console.log("server new workorderDate " + newWOObj.workorderDate);
    var workorderDate2 = newWOObj.workorderDate2;
    console.log("inside server workorderDate2= " + workorderDate2);
    var employeekey = newWOObj.employeekey;
    console.log("inside server employeekey= " + employeekey);
    var tempid = newWOObj.tempid;
    console.log("inside server tempid= " + tempid);



    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @employeekey=?; set @tempid=?;call usp_viewinspectionCountAllFilter(@manager,@workorderDate,@workorderDate2,@employeekey,@tempid)", [manager, workorderDate, workorderDate2, employeekey, tempid], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderScheduleByallFilters', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;set @batchScheduleNameKey=?;set @OrganizationID=?;call usp_workorderScheduleByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@batchScheduleNameKey,@OrganizationID)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, batchScheduleNameKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[13]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderReportByallFilters', supportCrossOriginScript, function (req, res) {

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
    var WorkorderTypeKey = newWOObj.WorkorderTypeKey;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @OrganizationID=?; set@WorkorderTypeKey=?;call usp_workorderReportByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@OrganizationID,@WorkorderTypeKey)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, OrganizationID, WorkorderTypeKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[12]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/barcodeReportByallFilters', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID=?;call usp_barcodeReportByallFilters(@manager,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [manager, facilitykey, roomTypeKey, floorKey, zoneKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/viewRoomsByallFilters', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    var facilitykey = newWOObj.facilitykey;
    var roomTypeKey = newWOObj.roomTypeKey;
    var floorKey = newWOObj.floorKey;
    var roomKey = newWOObj.roomKey;
    var zoneKey = newWOObj.zoneKey;
    var floorTypeKey = newWOObj.floorTypeKey;
    var OrganizationID = newWOObj.OrganizationID; pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @floorTypeKey=?;set @OrganizationID=?;call usp_viewRoomsByallFilters(@manager,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@floorTypeKey,@OrganizationID)", [manager, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, floorTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderEmployeeByallFilters', supportCrossOriginScript, function (req, res) {
    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);
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
    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var OrganizationID = newWOObj.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID =?;call usp_workorderEmployeeByallFilters(@manager,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [manager, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, zoneKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    console.log("****************metaupdatedby************" + metaupdatedby + "ZZZZZZ " + isphoto);
    console.log("3 VAlues are tot=16 " + isbar + " " + isphoto);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;set @workordertypekey=?;set @equipmentkey=?;set @roomkeys=?; set @employeekey=?; set @priority=?; set @fromdate=?; set @todate=?;set @intervaltype=?; set @repeatinterval=?;set @occursonday =?;set @occursontime =?;set @occurstype =?; set @workordernotes =?;set @isbar=?;set @isphoto=?;set @metaupdatedby=?; set @facilitykeys=?; set @floorkeys=?; set @zonekeys=?; set @roomtypekeys=?; set @OrganizationID=?; call usp_QuickworkorderAdd(@workorderkey,@workordertypekey,@equipmentkey,@roomkeys,@employeekey,@priority,@fromdate,@todate,@intervaltype,@repeatinterval,@occursonday,@occursontime,@occurstype,@workordernotes,@isbar,@isphoto,@metaupdatedby,@facilitykeys,@floorkeys,@zonekeys,@roomtypekeys,@OrganizationID) ', [workorderkey, workordertypekey, equipmentkey, roomkeys, employeekey, priority, fromdate, todate, intervaltype, repeatinterval, occursonday, occursontime, occurstype, workordernote, isbar, isphoto, metaupdatedby, facilitykeys, floorkeys, zonekeys, roomtypekeys, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    res.end(JSON.stringify(rows[22]));
                }

            });

        }
        connection.release();
    });

});



app.options('/addworkordertype', supportCrossOriginScript);
app.post(securedpath + '/addworkordertype', supportCrossOriginScript, function (req, res) {


    var WorkorderType = req.body.WorkorderType;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderType=?; set @employeekey=?;set @OrganizationID=?; call usp_addworkordertype(@WorkorderType,@employeekey,@OrganizationID)', [WorkorderType, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_workordersGetByEmpKey(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Printing viewworkorder");
                    console.log("ROWS" + JSON.stringify(rows[5]));
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @OrganizationID =?;call usp_findingUser(@employeekey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_managerWorkOrder(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_viewScheduledWorks(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call  usp_getBarcodeForRoom(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?;  call usp_getBarcodeForEquipment(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchEmployee =?;set @pageno=?; set @itemsPerPage=?;set @employeekey =?;set @OrganizationID =?;call usp_searchEmployeeOnTable(@searchEmployee,@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [searchEmployee, pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchRoom =?;set @employeekey =?;set @OrganizationID=?;call usp_searchRoomOnTable(@searchRoom,@employeekey,@OrganizationID)", [searchRoom, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerkey =?;call usp_workordersemployeeGetByMngKey(@managerkey)", [managerkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];



    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_workordersViewbyDomain(@empk,@filter,@key,@ondate,@ondate2,@OrganizationID)", [empkey, filter, key, on_DT, upto_DT, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

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

    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];



    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;call usp_workordersReportViewbyDomain(@empk,@filter,@key,@ondate,@ondate2)", [empkey, filter, key, on_DT, upto_DT], function (err, rows) {
                if (err) {

                }
                else {

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

    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    console.log("ZZZZZZZZZZZZZ filter and key are " + empkey + filter + " " + key + "  ");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @filter =?;set @key =?;set @empk =?;set @OrganizationID=?;call usp_roomsViewbyDomain(@filter,@key,@empk,@OrganizationID)", [filter, key, empkey, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

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

    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];



    console.log("-----------workorderByWorkorderkeyandInventory---------- " + empkey + filter + " " + key + "  " + on_DT + " " + upto_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @filter =?;set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?; call usp_workorderByWorkorderkeyandInventory(@empk,@filter,@key,@ondate,@ondate2,@OrganizationID)", [empkey, filter, key, on_DT, upto_DT, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

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


    console.log("ZZZZZZZZZZZZZ filter and key are " + WorkorderTypeKey + employeekey + " " + search_DT);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @WorkorderTypeKey =?;set @employeekey =?;set @search_DT =?;set @OrganizationID =?;call usp_viewWorkorderFilter_WorkOrderType(@WorkorderTypeKey,@employeekey,@search_DT,@OrganizationID)", [WorkorderTypeKey, employeekey, search_DT, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

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
            connection.query("set @key =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_viewinspection_Filter(@key,@ondate,@ondate2,@OrganizationID)", [key, on_DT, upto_DT, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});




app.get(securedpath + '/viewinspectionReport_FilterByDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var on_DT = url.parse(req.url, true).query['searchDT'];
    var upto_DT = url.parse(req.url, true).query['searchDT2'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @ondate =?;set @ondate2 =?;set @OrganizationID =?;call usp_viewinspectionReport_FilterByDates(@employeekey,@ondate,@ondate2,@OrganizationID)", [employeekey, on_DT, upto_DT, OrganizationID], function (err, rows) {
                if (err) {

                }
                else {

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
                if (err) {

                }
                else {

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

    var on_DT = url.parse(req.url, true).query['searchDT'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empk =?;set @managerkey =?;set @ondate =?;call usp_viewworkorderempfilter(@empk,@managerkey,@ondate)", [empkey, managerkey, on_DT], function (err, rows) {
                if (err) {

                }
                else {

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
            connection.query('set @key=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet(@key,@empkey,@OrganizationID)', [domname, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });

});
app.get(securedpath + '/allRoomList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

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

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });

});


app.get(securedpath + '/getBatchScheduleName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getBatchScheduleName(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });

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

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });

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
            connection.query('set @WorkorderFromDate=?;set @WorkorderToDate=?;set @empkey=?; set @OrganizationID=?; call usp_ViewWorkorderByDates(@WorkorderFromDate,@WorkorderToDate,@empkey,@OrganizationID)', [WorkorderFromDate, WorkorderToDate, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
                res.end();
            });
        }
        connection.release();
    });

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

                    res.end(JSON.stringify(rows[5]));
                }
                res.end();
            });
        }
        connection.release();
    });

});
app.get(securedpath + '/workorderDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderKey = url.parse(req.url, true).query['SearchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?; set @OrganizationID=?;call usp_workorderViewByWorkOrderKey_Ang6(@workorderKey,@OrganizationID)', [workorderKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?;set @OrganizationID=?;call usp_workorderScheduleDetails(@workorderKey,@OrganizationID)', [workorderKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderKey=?;set @OrganizationID=?;call usp_getRoomNameByRoomList(@workorderKey,@OrganizationID)', [workorderKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @key=?; set @OrganizationID=?; call usp_workorderCycleDetails(@key,@OrganizationID)', [wkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var workDT = url.parse(req.url, true).query['viewdate'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdate =?;call usp_workordersGetByDate(@workdate)", [workDT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @facilitykey=?; set @zone=?; set @floor=?; set @today=?; set @employeekey=?; set@OrganizationID=?; call usp_workorderViewByFacilityFloorZone(@facilitykey,@zone,@floor,@today,@employeekey,@OrganizationID)', [facilitykey, zonekey, floorkey, t_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewworkorderFilterByFacility_Ang6', function (req, res) {
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
            connection.query('set @facilitykey=?; set @zone=?; set @floor=?; set @today=?; set @employeekey=?; set@OrganizationID=?; call usp_workorderViewByFacilityFloorZone_Ang6(@facilitykey,@zone,@floor,@today,@employeekey,@OrganizationID)', [facilitykey, zonekey, floorkey, t_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @statuskey=?; set @today=?;  set @emp=?; set@OrganizationID=?; call usp_workorderFilterByStatusEmpView(@statuskey,@today,@emp,@OrganizationID)', [statuskey, t_date, emp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/workorderFilterByStatusEmpView_Ang6', function (req, res) {
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
            connection.query('set @statuskey=?; set @today=?;  set @emp=?; set@OrganizationID=?; call usp_workorderFilterByStatusEmpView_Ang6(@statuskey,@today,@emp,@OrganizationID)', [statuskey, t_date, emp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


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
            connection.query('set @key=?; set @currenttime=?; set @endtime=?;set @OrganizationID=?;call usp_workorderDeteteByScheduleKey(@key,@currenttime,@endtime,@OrganizationID)', [workschedulekey, currenttime, endtime, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @key=?; set @currenttime=?; set @endtime=?; set @OrganizationID?; call usp_DeleteWorkorderSchedulebyKey(@key,@currenttime,@endtime,@OrganizationID)', [workschedulekey, currenttime, endtime, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?; set @viewdate=?; set@OrganizationID=?; call usp_workordersGetByEmpKey_mob(@employeekey,@viewdate,@OrganizationID)', [employeekey, viewdate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewDashboardWorkorder_Ang6', function (req, res) {
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
            connection.query('set @employeekey=?; set @viewdate=?; set@OrganizationID=?; call usp_workordersGetByEmpKey_mobAng6(@employeekey,@viewdate,@OrganizationID)', [employeekey, viewdate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?;set @OrganizationID=?;call usp_routemapGet(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MYSQL " + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?; set @meetingdate=?; set @jobtitlekey=?; set @pagenumber=?; set @itemsPerPage=?;set @OrganizationID=?; call usp_GetEmployeeByShift_Jobtitle(@shiftkey,@meetingdate,@jobtitlekey,@pagenumber,@itemsPerPage,@OrganizationID)', [shiftkey, meetingdate, jobtitlekey, pagenumber, itemsPerPage, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query("set @employeekey =?;set @workdate =?;set @manager =?; set@OrganizationID=?; call usp_getWorkorderByEmployeeKeyForInspection(@employeekey,@workdate,@manager,@OrganizationID)", [empkey, workDT, managerkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_GetAllEmployees(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?;set @OrganizationID=?;call usp_getShiftDetailsByShiftKey(@shiftkey,@OrganizationID)', [shiftkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @zone=?;set @start_date=?;set @end_date=?;set @shiftTypeKey=?;set @supervisor=?;set @OrganizationID=?; call usp_getShiftDetails(@zone,@start_date,@end_date,@shiftTypeKey,@supervisor,@OrganizationID)', [zone, start_date, end_date, shiftTypeKey, supervisor, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @templateid=?;set @employeekey=?;set @inspectiondate=?;set @isRecurring=?;set @timer=?;set @roomkey=?; set @metaupdatedby=?; set @empkey=?;set @full=?; set@OrganizationID=?; call usp_inspectionorderAddwithoutWorkorders(@templateid,@employeekey,@inspectiondate,@isRecurring,@timer,@roomkey,@metaupdatedby,@empkey,@full,@OrganizationID)', [templateid, employeekey, inspectiondate, isRecurring, timer, roomkeylist, metaupdatedby, empkey, full, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @templateid=?;set @employeekey=?;set @inspectionFromDate=?;set @inspectionToDate=?;set @isRecurring=?;set @timer=?;set @roomkey=?; set @metaupdatedby=?; set @empkey=?;set @full=?; set @OrganizationID=?;  call usp_addInspectionOrderwithRecurring(@templateid,@employeekey,@inspectionFromDate,@inspectionToDate,@isRecurring,@timer,@roomkey,@metaupdatedby,@empkey,@full,@OrganizationID)', [templateid, employeekey, inspectionFromDate, inspectionToDate, isRecurring, timer, roomkeylist, metaupdatedby, empkey, full, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(" QQQQQQQQQQQQQQQ res got is " + JSON.stringify(rows[11]));
                    res.end(JSON.stringify(rows[11]));

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
            connection.query('set @inspectionorderkey=?; set@OrganizationID=?; call usp_getinspectionedDetails(@inspectionorderkey,@OrganizationID)', [inspectionorderkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?; set @workstatuskey=?; set @today=?; set @userKey=?; set@OrganizationID=?; call usp_workorderGetByStatusEmployeeKey(@employeekey,@workstatuskey,@today,@userKey,@OrganizationID)', [employeekey, workstatuskey, t_date, userKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getWorkorderByStatusEmployeeKey_Ang6', function (req, res) {
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
            connection.query('set @employeekey=?; set @workstatuskey=?; set @today=?; set @userKey=?; set@OrganizationID=?; call usp_workorderGetByStatusEmployeeKey_Ang6(@employeekey,@workstatuskey,@today,@userKey,@OrganizationID)', [employeekey, workstatuskey, t_date, userKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionorderKey=?;call usp_getInspectionorderByKey(@inspectionorderKey)', [inspectionorderKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@OrganizationID=?; call usp_getInspectionTemplateDetails(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pageno=?;set @itemsPerPage=?; set @empkey=?; set@OrganizationID=?; call usp_getTemplateDetails(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getTempDetailsForDropdown(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTemplateFilterByTemplateID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var key = url.parse(req.url, true).query['key'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?; set @OrganizationID=?;call usp_getTemplateFilterByTemplateID(@key,@OrganizationID)', [key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/deleteInspectionTemplateQuestions', supportCrossOriginScript);
app.post(securedpath + '/deleteInspectionTemplateQuestions', supportCrossOriginScript, function (req, res) {
    var newobject = {};
    newobject = req.body;
    var templateID = newobject.templateID;
    var templateQuestionID = newobject.templateQuestionID;
    var updatedBy = newobject.updatedBy;
    var OrganizationID = newobject.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?; set @templateQuestionID=?; set @updatedBy=?; set@OrganizationID=?; call usp_InspectionTemplateQuestionsRemove(@templateID,@templateQuestionID,@updatedBy,@OrganizationID)', [templateID, templateQuestionID, updatedBy, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @templateID=?; set @templateQuestionID=?;   call usp_getInspectionTemplateDetailsByIDs(@templateID,@templateQuestionID)', [templateID, templateQuestionID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var newobject = {};
    newobject = req.body;
    var templateID = newobject.templateID;
    var updatedBy = newobject.updatedBy;
    var OrganizationID = newobject.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?; set @updatedBy=?; set@OrganizationID=?;  call usp_InspectionTemplatesRemove(@templateID,@updatedBy,@OrganizationID)', [templateID, updatedBy, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    var templateID = req.body.templateID;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?;set @OrganizationID=?;   call usp_deleteSelectedTemplateQuestion(@templateID,@OrganizationID)', [templateID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderkey=?;  set @OrganizationID=?; call usp_deleteWorkCycleByKey(@workorderkey,@OrganizationID)', [workorderkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});


app.options('/deleteByWorkorderKey', supportCrossOriginScript);
app.post(securedpath + '/deleteByWorkorderKey', supportCrossOriginScript, function (req, res) {

    var workkey = req.body.workorderkey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID =?;call usp_workorderdeleteByKey(@key,@OrganizationID)', [workkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID=?;call usp_deleteWorkorderFromView(@key,@OrganizationID)', [workkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @date=?; set @todate=?;  set @jobtitles=?;set @empkey=?;set @OrganizationID=?; call usp_getTrainingDetailsByMultipleJobtitle(@date,@todate,@jobtitles,@empkey,@OrganizationID)', [ondate, todate, jobtitles, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?;set @employeekey=?;set @OrganizationID=?; call usp_viewEmployeesOfEvent(@EventKey,@employeekey,@OrganizationID)', [EventKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @empkey=?;set @pageno=?;set @itemsPerPage=?;set @OrganizationID=?;  call usp_getAllMeetingTrainingByDate(@date,@empkey,@pageno,@itemsPerPage,@OrganizationID)', [ondate, employeekey, pageno, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/viewSharedStatusButton', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @empkey=?;set @OrganizationID=?;  call usp_viewSharedStatusButton(@empkey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    console.log("from date" + search_DT + "todate" + search_DT2);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @search_DT=?;set @search_DT2=?; set @empkey=?;set @OrganizationID=?;  call usp_viewAllMeetingByDates(@search_DT,@search_DT2,@empkey,@OrganizationID)', [search_DT, search_DT2, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pageno=?;set @itemsPerPage=?; set @employeekey=?;set @OrganizationID=?; call usp_getAllDefaultEvents(@pageno,@itemsPerPage,@employeekey,@OrganizationID)', [pageno, itemsPerPage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?; call usp_getAllFacility_Pagination(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_getallWorkorderStatus(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @WorkorderStatus=?;set @OrganizationID=?; set @WorkorderStatusDescription=?; call usp_checkForNewWorkorderStatus(@WorkorderStatus,@WorkorderStatusDescription,@OrganizationID)', [WorkorderStatus, WorkorderStatusDescription, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_floorTypeGet(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_allFloorTypes(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @key=?;set @OrganizationID=?; call usp_floorvaluesByfacKey(@key,@OrganizationID)', [key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?;set @OrganizationID=?; call usp_getAllEquipmentTypes(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @zonekey=?; set @startdate=?; set @enddate=?; set @empKey=?; set @OrganizationID=?; call usp_getShiftsByZone(@zonekey,@startdate,@enddate,@empKey,@OrganizationID)', [zonekey, startdate, enddate, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @Shifttype=?; set @startdate=?; set @enddate=?; set @epmKey=?;set @OrganizationID=?; call usp_getAllShiftByShiftType(@Shifttype,@startdate,@enddate,@epmKey,@OrganizationID)', [Shifttype, startdate, enddate, epmKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @startdate=?; set @enddate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllShiftByDate(@startdate,@enddate,@empKey,@OrganizationID)', [startdate, enddate, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getAllEmployeeWithoutSupervisor(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @endDate=?; set @empKey=?;set @OrganizationID=?; call usp_getAllShiftinChargesShiftsByDate(@pagenumber,@itemsPerPage,@startDate,@endDate,@empKey,@OrganizationID)', [pagenumber, itemsPerPage, startDate, endDate, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @endDate=?;set @OrganizationID=?; call usp_getAllEmployeesShiftsByDate(@pagenumber,@itemsPerPage,@startDate,@endDate,@OrganizationID)', [pagenumber, itemsPerPage, startDate, endDate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @latitude=?; set @longitude=?; set @employeekey=?;set @curr_date=?; set@OrganizationID=?; call usp_backgroundGeoLocation(@latitude,@longitude,@employeekey,@curr_date,@OrganizationID)', [latitude, longitude, employeekey, curr_date, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.options('/gpsSnapShot', supportCrossOriginScript);
app.post(securedpath + '/gpsSnapShot', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var latitude = req.body.geolatitude;
    var longitude = req.body.geolongitude;
    var employeekey = req.body.EmployeeKey;
    var workorderkey = req.body.WorkOrderKey;
    var systime = req.body.systime;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @latitude=?; set @longitude=?; set @employeekey=?;set @workorderkey=?;  set @systime=?; set @OrganizationID=?; call usp_WorkorderStatusUpdateBySnapshot_Ang6(@latitude,@longitude,@employeekey,@workorderkey,@systime,@OrganizationID)', [latitude, longitude, employeekey, workorderkey, systime, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getFloorName(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getZoneName(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getRoomTypeName(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @empkey=?;set @OrganizationID=?;call usp_getRoomName(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @tempid=?; set @tempQid=?; set @Question=?;set@OrganizationID=?; call usp_updateQuestion(@tempid,@tempQid,@Question,@OrganizationID)', [tempid, tempQid, Question, OrganizationID], function (err, rows) {
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
            connection.query('set @TemplateName=?; set @TemplateID=?; set @ScoreTypeKey=?; set@OrganizationID=?; call usp_updateEditInspection(@TemplateName,@TemplateID,@ScoreTypeKey,@OrganizationID)', [TemplateName, TemplateID, ScoreTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftKey=?;set @OrganizationID=?;   call usp_deleteScheduleView(@ShiftKey,@OrganizationID)', [ShiftKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @ShiftKey=?;set @OrganizationID=?;call usp_editSupervisorSchedule(@ShiftKey,@OrganizationID)', [ShiftKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ShiftKey=?; set @ZoneKey=?; set @StartDate=?; set @EndDate=?; set @shiftTypeKey=?; set @SupervisorKey=?; set @employeekey=?;set @OrganizationID=?; call usp_updateSchedulingSupervisor(@ShiftKey,@ZoneKey,@StartDate,@EndDate,@shiftTypeKey,@SupervisorKey,@employeekey,@OrganizationID)', [ShiftKey, ZoneKey, StartDate, EndDate, shiftTypeKey, SupervisorKey, employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ActionType=?; set @Action=?; set @Description=?; set @ActionKey=?; set @ActionTypeKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_submitDefaultEventDetails(@ActionType,@Action,@Description,@ActionKey,@ActionTypeKey,@employeekey,@OrganizationID)', [ActionType, Action, Description, ActionKey, ActionTypeKey, employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ActionKey=?; set @ActionTypeKey=?;set @OrganizationID=?;   call usp_deleteDefaultEventDetails(@ActionKey,@ActionTypeKey,@OrganizationID)', [ActionKey, ActionTypeKey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @startDate=?; set @EmpKey=?;set @OrganizationID=?; call usp_getEmployeeScheduling(@pagenumber,@itemsPerPage,@startDate,@EmpKey,@OrganizationID)', [pagenumber, itemsPerPage, startDate, EmpKey, OrganizationID], function (err, rows) {
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
            connection.query(' set @facilityString=?;set @OrganizationID=?; call usp_getDetailsByFacility(@facilityString,@OrganizationID)', [facilityString, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @meetingDate=?; set @employee=?;set @OrganizationID=?;   call usp_getTrainingByEmployeeList(@meetingDate,@employee,@OrganizationID)', [meetingDate, employee, OrganizationID], function (err, rows) {
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
            connection.query('set @ShiftTypeKey=?; set @meetingDate=?; set @empkey=?; set @OrganizationID=?;   call usp_getTrainingByShiftKey(@ShiftTypeKey,@meetingDate,@empkey,@OrganizationID)', [ShiftTypeKey, meetingDate, employeeKey, OrganizationID], function (err, rows) {
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
            connection.query('set @EmployeeCalendarID=?; set @EmployeeKey=?;set @OrganizationID=?;   call usp_updateScheduleViewEmployeeDetails(@EmployeeCalendarID,@EmployeeKey,@OrganizationID)', [EmployeeCalendarID, EmployeeKey, OrganizationID], function (err, rows) {
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
            connection.query('set @EmployeeCalendarID=?;set @OrganizationID=?;   call usp_deleteScheduleViewEmployeeDetails(@EmployeeCalendarID,@OrganizationID)', [EmployeeCalendarID, OrganizationID], function (err, rows) {
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
            connection.query('set @EventKey=?; set @EmployeeKey=?; set @ActionKey=?;set @OrganizationID=?;  call usp_getEditViewTrainingMeetingDetails(@EventKey,@EmployeeKey,@ActionKey,@OrganizationID)', [EventKey, EmployeeKey, ActionKey, OrganizationID], function (err, rows) {
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
            connection.query('set @EventKey=?;set @OrganizationID=?;   call usp_deleteMeetingViewEmployeeDetails(@EventKey,@OrganizationID)', [EventKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query(' set @floorString=?; set @facilitykey=?;set @OrganizationID=?; call usp_getDetailsByFloor(@floorString,@facilitykey,@OrganizationID)', [floorString, facilitykey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @zoneString=?; set @facilitykey=?;set @OrganizationID=?; call usp_getDetailsByZone(@zoneString,@facilitykey,@OrganizationID)', [zoneString, facilitykey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @roomtypeString=?;set @OrganizationID=?; call usp_getDetailsByRoomType(@roomtypeString,@OrganizationID)', [roomtypeString, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @roomtypeString=?; set @facilityString=?;set @OrganizationID=?; call usp_getDetailsByRoomTypeFacility(@roomtypeString,@facilityString,@OrganizationID)', [roomtypeString, facilityString, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @roomString=?;set @OrganizationID=?;  call usp_getDetailsByRoom(@roomString,@OrganizationID)', [roomString, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @meetingDate=?; set @employeekey=?;set @OrganizationID=?; call usp_getTrainingByEmployeekey(@meetingDate,@employeekey,@OrganizationID)', [meetingDate, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @EventKey=?; set @EmployeeKey=?; set @ActionKey=?;set @OrganizationID=?; call usp_EmployeeByEventKey(@EventKey,@EmployeeKey,@ActionKey,@OrganizationID)', [EventKey, EmployeeKey, ActionKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @employeekey=?; set@OrganizationID=?; call usp_getEmployeesLocation(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(' set @EventKey=?; set @employeekey=?;set @OrganizationID=?; call usp_unAttendedTrainingChangeStatus(@EventKey,@employeekey,@OrganizationID)', [EventKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @MeetingNotes=?; set @actionKey=?;  set @eventKey=?; set @eventhost=?; set @venue=?; set @meetingDate=?; set @startTime=?; set @endTime=?; set @employeeKeyList=?; set @metaupdatedby=?;set @OrganizationID=?; call usp_updateMeetingTraining(@MeetingNotes,@actionKey,@eventKey,@eventhost,@venue,@meetingDate,@startTime,@endTime,@employeeKeyList,@metaupdatedby,@OrganizationID)', [MeetingNotes, actionKey, eventKey, eventhost, venue, meetingDate, startTime, endTime, employeeKeyList, metaupdatedby, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @EventKey=?;set @OrganizationID=?;   call usp_getEmployeeListByEventKey(@EventKey,@OrganizationID)', [EventKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


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
            connection.query('set @attendedEmployees=?; set @EventKey=?;set @OrganizationID=?; call usp_eventHasAttendedUpdated(@attendedEmployees,@EventKey,@OrganizationID)', [attendedEmployees, EventKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?;  call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID)", [wdkey, newPath, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[4][0].WorkorderStatus));
                }

            });
        }
        connection.release();
    });
});

app.options('/pho1_Ang6', supportCrossOriginScript);
app.post(securedpath + '/pho1_Ang6', supportCrossOriginScript, function (req, res) {
    var pho = req.body.Filename;
    var wdkey = req.body.Workorderkey;
    var employeekey = req.body.EmployeeKey;
    var OrganizationID = req.body.OrganizationID;
    var complete_Time = req.body.complete_Time;
    var newPath = pho;


    console.log("pho" + pho + " wdkey " + wdkey + " employeekey " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?; set @complete_Time=?; call usp_WorkorderStatusUpdateByPhoto_Ang6(@wdk,@imgname,@employeekey,@OrganizationID,@complete_Time)", [wdkey, newPath, employeekey, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[5][0].WorkorderStatus));
                }

            });
        }
        connection.release();
    });
});
app.options('/uploadImageFromSmallDevices', supportCrossOriginScript);
app.post(securedpath + '/uploadImageFromSmallDevices', supportCrossOriginScript, function (req, res) {

    uploadImageFromSmallDevices(req, res, function (err) {
        if (err) {

            return res.end("Error uploading file.");
        } else {

            res.end("File is uploaded");
        }

    });
});

var PhotostorageDevice = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, '../dist/mdb-angular-free/pho1');

    },
    filename: function (req, file, callback) {
        var fname = file.originalname;
        callback(null, fname);

    }
});
var uploadImageFromSmallDevices = multer({ storage: PhotostorageDevice }).single('file');

app.options('/uploadImageFromSmallDevices_Inspection', supportCrossOriginScript);
app.post(securedpath + '/uploadImageFromSmallDevices_Inspection', supportCrossOriginScript, function (req, res) {

    uploadImageFromSmallDevices_Inspection(req, res, function (err) {
        if (err) {

            return res.end("Error uploading file.");
        } else {

            res.end("File is uploaded");
        }

    });
});

var PhotostorageDevice_Inspection = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, '../dist/mdb-angular-free/Inspection-Upload');

    },
    filename: function (req, file, callback) {
        var fname = file.originalname;
        callback(null, fname);

    }
});
var uploadImageFromSmallDevices_Inspection = multer({ storage: PhotostorageDevice_Inspection }).single('file');

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
            connection.query('set @username=?; set @employeekey=?;set @OrganizationID=?; call usp_checkUsername(@username,@employeekey,@OrganizationID)', [username, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getManagerForEmployeeForSuperAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getManagerForEmployee(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @rolekey=?;set @OrganizationID=?; call usp_getOtherManagers(@employeekey,@rolekey,@OrganizationID)', [employeekey, rolekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitlekey=?;set @OrganizationID=?; call usp_checkForEmployeeInJobtitle(@jobtitlekey,@OrganizationID)', [jobtitlekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/setUsernamePassword', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = req.body.username;
    var password = req.body.password;
    var employeekey = req.body.employeekey;
    var updatedBy = req.body.updatedBy;
    var userRoleTypeKey = req.body.userRoleTypeKey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @password=?; set @employeekey=?; set @updatedBy=?; set @userRoleTypeKey=?; set @OrganizationID=?;call usp_setUsernamePassword(@username,@password,@employeekey,@updatedBy,@userRoleTypeKey,@OrganizationID)', [username, password, employeekey, updatedBy, userRoleTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW " + pageno + " " + itemsperpage + " " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?;call usp_getLoginDetailsForAllUsers(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_getLoginDetailsByID(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getLoginDetailsByID...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/resetPassword', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = req.body.username;
    var password = req.body.password;
    var employeekey = req.body.employeekey;
    var updatedBy = req.body.updatedBy;
    var userloginid = req.body.userloginid;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @password=?; set @employeekey=?; set @updatedBy=?; set @userloginid=?;set @OrganizationID=?; call usp_resetPassword(@username,@password,@employeekey,@updatedBy,@userloginid,@OrganizationID)', [username, password, employeekey, updatedBy, userloginid, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_userloginRemove(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;call usp_getAllUserRoleTypebyAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?; call usp_getAllUserRoleTypebySuperAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;call usp_getManagerDetails(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;call usp_getEmployeeRolerTypeKey(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @managerkey=?;set @OrganizationID=?;  call usp_viewEmpByManager(@managerkey,@OrganizationID)', [managerkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pageno=?; set @itemsPerPage=?; set @empkey=?;set @OrganizationID=?; call usp_getFormDetails(@pageno,@itemsPerPage,@empkey,@OrganizationID)', [pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
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

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("jobtitleString   " + jobtitleString);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitleString=?; set @empkey=?;set @OrganizationID=?; call usp_searchEmpByJobTitle(@jobtitleString,@empkey,@OrganizationID)', [jobtitleString, empkey, OrganizationID], function (err, rows) {
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
            connection.query('set @empkeystring=?; set @ShiftKey=?;set @OrganizationID=?;  call usp_getEmpShiftCheck(@empkeystring,@ShiftKey,@OrganizationID)', [empkeystring, ShiftKey, OrganizationID], function (err, rows) {
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
            connection.query('set @FormtypeId=?; set @employeekey=?; set @fileName=?; set @FormDesc=?; set @OrganizationID=?; call usp_uploadFormFile(@FormtypeId,@employeekey,@fileName,@FormDesc,@OrganizationID)', [FormtypeId, employeekey, fileName, FormDesc, OrganizationID], function (err, rows) {
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

app.post(securedpath + '/updateFormDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newobject = {};
    newobject = req.body;
    var FormtypeId = newobject.FormtypeId;
    var FormType = newobject.FormType;
    var empkey = newobject.empkey;
    var OrganizationID = newobject.OrganizationID;
    console.log("FormtypeId " + FormtypeId + " FormType " + FormType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @FormType=?; set @empkey=?;set @OrganizationID=?; call usp_updateFormDetails(@FormtypeId,@FormType,@empkey,@OrganizationID)', [FormtypeId, FormType, empkey, OrganizationID], function (err, rows) {
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
            connection.query('set @FormtypeId=?; set @OrganizationID=?; call usp_getEditFormDetails(@FormtypeId,@OrganizationID)', [FormtypeId, OrganizationID], function (err, rows) {
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

app.post(securedpath + '/deleteForm', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newobject = {};
    newobject = req.body;
    var FormtypeId = newobject.FormtypeId;
    var OrganizationID = newobject.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FormtypeId=?; set @OrganizationID=?;  call usp_deleteForm(@FormtypeId,@OrganizationID)', [FormtypeId, OrganizationID], function (err, rows) {
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

app.post(securedpath + '/addNewForms', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newobject = {};
    newobject = req.body;
    var newform = newobject.newform;
    var serverEmpKey = newobject.serverEmpKey;
    var OrganizationID = newobject.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @newform=?; set @serverEmpKey=?; set @OrganizationID=?; call usp_addNewForms(@newform,@serverEmpKey,@OrganizationID)', [newform, serverEmpKey, OrganizationID], function (err, rows) {
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
            connection.query('set @newform=?; set @serverEmpKey=?; set @OrganizationID=?; call usp_checkforForms(@newform,@serverEmpKey,@OrganizationID)', [newform, serverEmpKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

//Author: Prakash Code Starts for Employee Calendar Starts Here
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
    // var issupervisor = req.body.isSupervisor;
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


    // var start_sun_hour = req.body.start_sun_hour;
    // var start_sun_min = req.body.start_sun_min;
    // var start_sun_format = req.body.start_sun_format;
    // var start_mon_hour = req.body.start_mon_hour;
    // var start_mon_min = req.body.start_mon_min;
    // var start_mon_format = req.body.start_mon_format;
    // var start_tue_hour = req.body.start_tue_hour;
    // var start_tue_min = req.body.start_tue_min;
    // var start_tue_format = req.body.start_tue_format;
    // var start_wed_hour = req.body.start_wed_hour;
    // var start_wed_min = req.body.start_wed_min;
    // var start_wed_format = req.body.start_wed_format;
    // var start_thu_hour = req.body.start_thu_hour;
    // var start_thu_min = req.body.start_thu_min;
    // var start_thu_format = req.body.start_thu_format;
    // var start_fri_hour = req.body.start_fri_hour;
    // var start_fri_min = req.body.start_fri_min;
    // var start_fri_format = req.body.start_fri_format;
    // var start_sat_hour = req.body.start_sat_hour;
    // var start_sat_min = req.body.start_sat_min;
    // var start_sat_format = req.body.start_sat_format;
    // var end_sun_hour = req.body.end_sun_hour;
    // var end_sun_min = req.body.end_sun_min;
    // var end_sun_format = req.body.end_sun_format;
    // var end_mon_hour = req.body.end_mon_hour;
    // var end_mon_min = req.body.end_mon_min;
    // var end_mon_format = req.body.end_mon_format;
    // var end_tue_hour = req.body.end_tue_hour;
    // var end_tue_min = req.body.end_tue_min;
    // var end_tue_format = req.body.end_tue_format;
    // var end_wed_hour = req.body.end_wed_hour;
    // var end_wed_min = req.body.end_wed_min;
    // var end_wed_format = req.body.end_wed_format;
    // var end_thu_hour = req.body.end_thu_hour;
    // var end_thu_min = req.body.end_thu_min;
    // var end_thu_format = req.body.end_thu_format;
    // var end_fri_hour = req.body.end_fri_hour;
    // var end_fri_min = req.body.end_fri_min;
    // var end_fri_format = req.body.end_fri_format;
    // var end_sat_hour = req.body.end_sat_hour;
    // var end_sat_min = req.body.end_sat_min;
    // var end_sat_format = req.body.end_sat_format;

    // var idscheduler_exception = req.body.idscheduler_exception;

    // var idmaster_exception_weekend = req.body.idmaster_exception_weekend;
    // var idemployeegrouping = req.body.idemployeegrouping;

    // var exceptionsdate = req.body.exceptionsdate;


    // console.log("exceptionid: " + idscheduler_exception);
    // console.log("weekendid: " + idmaster_exception_weekend);

    // console.log("hour: "+start_sun_hour);
    // console.log("min: "+start_sun_min);
    // console.log("format: "+start_sun_format);
    // console.log("hour: "+start_mon_hour);
    // console.log("min: "+start_mon_min);
    // console.log("format: "+start_mon_format);
    // console.log(start_tue_hour);
    // console.log(start_tue_min);
    // console.log(start_tue_format);
    // console.log(start_wed_hour);
    // console.log(start_wed_min);
    // console.log(start_wed_format);
    // console.log(start_thu_hour);
    // console.log(start_thu_min);
    // console.log(start_thu_format);
    // console.log(start_fri_hour);
    // console.log(start_fri_min);
    // console.log(start_fri_format);
    // console.log(start_sat_hour);
    // console.log(start_sat_min);
    // console.log(start_sat_format);
    // console.log(end_sun_hour);
    // console.log(end_sun_min);
    // console.log(end_sun_format);
    // console.log(end_mon_hour);
    // console.log(end_mon_min);
    // console.log(end_mon_format);
    // console.log(end_tue_hour);
    // console.log(end_tue_min);
    // console.log(end_tue_format);
    // console.log(end_wed_hour);
    // console.log(end_wed_min);
    // console.log(end_wed_format);
    // console.log(end_thu_hour);
    // console.log(end_thu_min);
    // console.log(end_thu_format);
    // console.log(end_fri_hour);
    // console.log(end_fri_min);
    // console.log(end_fri_format);
    // console.log(end_sat_hour);
    // console.log(end_sat_min);
    // console.log(end_sat_format);



    // console.log("---------------------" + metaupdatedby + " " + employeenumber + " " + OrganizationID + " " + gender + " " + shirtSize + " " + pantSize + " " + supervisorKey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @supervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?;call usp_employeesAdd(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@supervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, supervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize], function (err, rows) {
                // set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;set @idmaster_exception_weekend=?;set @idemployeegrouping=?; set @exceptionsdate=?; 
                // @start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception, @idmaster_exception_weekend,@idemployeegrouping,@exceptionsdate                
                //  start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping, exceptionsdate        
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[30][0]));
                }
            });
        }
        connection.release();
    });
});
//Author: Prakash Code Starts for Employee Calendar Ends Here

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
            connection.query('set @employeekey=?;set @OrganizationID=?; call usp_getManagerDetailsByID(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set@OrganizationID=?;call usp_employeesOnly(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @OrganizationID=?; call usp_getTemplates(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @employeekey=?; set@OrganizationID=?; call usp_statusFilterListByWorkorderDate(@date,@employeekey,@OrganizationID)', [date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @date=?; set @employeekey=?; set @userKey=?; set@OrganizationID=?; call usp_statusFilterListByEmployeeKey(@date,@employeekey,@userKey,@OrganizationID)', [date, employeekey, userKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getStatusListByEmployeeKey...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getfacilitykeyByRoomId', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomkey = url.parse(req.url, true).query['rkey'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomkey=?; call usp_facilitykeybyroomid(@roomkey)', [roomkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @checkValue=?; set @type=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewInventory(@checkValue,@type,@employeekey,@OrganizationID)', [checkValue, type, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @FacilityKey=?; set @FloorName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewFloor(@FacilityKey,@FloorName,@employeekey,@OrganizationID)', [FacilityKey, FloorName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @bkey=?; set @employeekey=?; set @OrganizationID=?;call usp_checkForNewScheduleName(@bkey,@employeekey,@OrganizationID)', [bkey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @FacilityKey=?; set @FloorKey=?; set @ZoneName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewZone(@FacilityKey,@FloorKey,@ZoneName,@employeekey,@OrganizationID)', [FacilityKey, FloorKey, ZoneName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @FacilityKey=?; set @FloorKey=?; set @FloorTypeKey=?; set @ZoneKey=?; set @RoomTypeKey=?; set @RoomName=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewRoom(@FacilityKey,@FloorKey,@FloorTypeKey,@ZoneKey,@RoomTypeKey,@RoomName,@employeekey,@OrganizationID)', [FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @EquipmentTypeKey=?; set @EquipmentName=?; set @employeekey=?; set @OrganizationID=?; call usp_checkForNewEquipment(@EquipmentTypeKey,@EquipmentName,@employeekey,@OrganizationID)', [EquipmentTypeKey, EquipmentName, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var templateName = url.parse(req.url, true).query['templateName'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateName=?; set@OrganizationID=?; call usp_checkForTemplate(@templateName,@OrganizationID)', [templateName, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var templateid = url.parse(req.url, true).query['templateid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?; call usp_checkforInspectionOnTemplate(@templateid,@OrganizationID)', [templateid, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var templateid = url.parse(req.url, true).query['templateid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?;  call usp_getTemplateEditDetails(@templateid,@OrganizationID)', [templateid, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    var templateid = url.parse(req.url, true).query['templateid'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?; set@OrganizationID=?;  call usp_getTemplateQuestionsEditDetails(@templateid,@OrganizationID)', [templateid, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Barcode=?; set @type=?;set @OrganizationID=?;  call usp_checkForBarcodeInventory(@Barcode,@type,@OrganizationID)', [Barcode, type, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            connection.query('set @ShiftTypeName=?; set @ShiftStartTime=?; set @ShiftEndTime=?; set @empKey=?;set @OrganizationID=?; call usp_insertNewShiftType(@ShiftTypeName,@ShiftStartTime,@ShiftEndTime,@empKey,@OrganizationID)', [ShiftTypeName, ShiftStartTime, ShiftEndTime, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?;call usp_getAllShiftType_Pagination(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @ShiftTypeName=?; set @OrganizationID=?; call usp_editShiftTypeGet(@ShiftTypeName,@OrganizationID)', [ShiftTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @ShiftTypeName=?; set @ShiftStartTime=?; set @ShiftEndTime=?; set @empKey=?; set @ShiftTypeKey=?; set @OrganizationID=?; call usp_updateShiftType(@ShiftTypeName,@ShiftStartTime,@ShiftEndTime,@empKey,@ShiftTypeKey,@OrganizationID)', [ShiftTypeName, ShiftStartTime, ShiftEndTime, empKey, ShiftTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @ShiftTypeName=?;set @OrganizationID=?; call usp_checkForNewShiftType(@ShiftTypeName,@OrganizationID)', [ShiftTypeName, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @JobTitle=?; set @employeekey=?;set @OrganizationID=?; call usp_checkForNewJobTittle(@JobTitle,@employeekey,@OrganizationID)', [JobTitle, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
    var FacilityKey = url.parse(req.url, true).query['FacilityKey'];
    var FloorKey = url.parse(req.url, true).query['FloorKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @RoomName=?; set @FacilityKey=?; set @FloorKey=?;set @OrganizationID=?; call usp_checkNewRoomName(@RoomName,@FacilityKey,@FloorKey,@OrganizationID)', [RoomName, FacilityKey, FloorKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkNewRoomName...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[4]));
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
    var itemsPerPage = req.body.itemsPerPage;
    var OrganizationID = req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @JobTitle=?; set @ManagerKey=?; set @employeekey=?; set @pagenumber=?; set  @itemsPerPage=?;set @OrganizationID=?;  call usp_getEmployeeByAllFilter(@JobTitle,@ManagerKey,@employeekey,@pagenumber,@itemsPerPage,@OrganizationID)', [JobTitle, ManagerKey, employeekey, pagenumber, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @roomKey=?; set @RoomName=?; set @FacilityKey=?; set @employeekey=?; set @OrganizationID=?; call usp_checkForEditedRoomName(@roomKey,@RoomName,@FacilityKey,@employeekey,@OrganizationID)', [roomKey, RoomName, FacilityKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @employeekey=?; set@OrganizationID=?;  call usp_getEmailIdByEmp(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @inspectionOrderKey=?; set@OrganizationID=?;  call usp_getInspectionDetailsForEmail(@inspectionOrderKey,@OrganizationID)', [inspectionOrderKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @FacilityKey=?; set @OrganizationID=?;  call usp_getFloorListForRoomEdit(@FacilityKey,@OrganizationID)', [FacilityKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_getFloorTypeListForRoomEdit(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @FacilityKey=?; set @FloorKey=?;set @OrganizationID=?;  call usp_getZoneListForRoomEdit(@FacilityKey,@FloorKey,@OrganizationID)', [FacilityKey, FloorKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_getRoomTypeListForRoomEdit(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getRoomTypeListForRoomEdit...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/deleteWorkOrderBatchSchedule', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workschedulekey = req.body.workorderSchedulekey;
    var OrganizationID = req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @workschedulekey=?;set @OrganizationID=?;    call usp_deleteWorkOrderBatchSchedule(@workschedulekey,@OrganizationID)', [workschedulekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @key=?;set @OrganizationID=?;   call usp_getEmployeeForBatchScheduling(@key,@OrganizationID)', [key, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @Workorder=?; set @emp=?; set @OrganizationID=?;  call usp_delayCurrentWorkOrder(@Workorder,@emp,@OrganizationID)', [Workorder, emp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @Workorder=?; set @emp=?; set@OrganizationID=?;  call usp_continueCurrentWorkOrder(@Workorder,@emp,@OrganizationID)', [Workorder, emp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("continueCurrentWorkOrder...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/deleteWorkOrders', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var deleteWorkOrderString = newWOObj.deleteWorkOrderString;
    var employeekey = newWOObj.employeekey;
    var OrganizationID = newWOObj.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @deleteWorkOrderString=?; set @employeekey=?;set @OrganizationID=?;  call usp_deleteWorkOrders(@deleteWorkOrderString,@employeekey,@OrganizationID)', [deleteWorkOrderString, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
        } else {
            connection.query('set @WorkorderScheduleKey=?;set @OrganizationID=?;   call usp_BatchSchedule_Report(@WorkorderScheduleKey,@OrganizationID)', [WorkorderScheduleKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getTemplatesNameFor_Mob(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?; set @workDT=?; set @OrganizationID=?; call usp_managerWorkOrder_mob(@employeekey,@workDT,@OrganizationID)', [employeekey, workDT, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @employeekey=?; set @searchEmployee=?;set @OrganizationID=?;  call usp_searchEmployeeListLogin(@employeekey,@searchEmployee,@OrganizationID)', [employeekey, searchEmployee, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @SupervisorKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_empGetBySupervisor(@SupervisorKey,@employeekey,@OrganizationID)', [SupervisorKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @SupervisorKey=?; set @employeekey=?; set @JobTitleKey=?;set @OrganizationID=?;  call usp_empGetBySupervisorjobTitle(@SupervisorKey,@employeekey,@JobTitleKey,@OrganizationID)', [SupervisorKey, employeekey, JobTitleKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @BatchScheduleNameKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_roomsForCreateBatchSchedule(@BatchScheduleNameKey,@employeekey,@OrganizationID)', [BatchScheduleNameKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
    var temproomid = newWOObj.temproomidlist;
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
    var snapshot = newWOObj.snapshot;
    var keepActivCheck = newWOObj.keepActiveCheck;
    var workordertype = newWOObj.workordertype;

    var empKey = newWOObj.empKey;
    var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
    var workorderNotes = newWOObj.WorkorderNotes;
    var OrganizationID = newWOObj.OrganizationID;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;
    var scheduledTime = newWOObj.scheduleTime;
    var CreateWO = newWOObj.CreateWO;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @temproomid =?; set @roomList =?; set @frequency =?; set @monCheck =?; set @tueCheck=?; set @wedCheck=?; set @thuCheck=?; set @friCheck=?; set @satCheck=?; set @sunCheck=?; set @barCheck=?; set @photCheck=?; set @workordertype=?; set @empKey=?; set @batchScheduleNameKey=?; set @workorderNotes=?;set @OrganizationID =?; set @fromdate =?; set @todate =?;set @scheduledTime =?; set @keepActivCheck=?; set @snapshot=?; set @CreateWO=?; call usp_saveScheduleReport(@temproomid,@roomList,@frequency,@monCheck,@tueCheck,@wedCheck,@thuCheck,@friCheck,@satCheck,@sunCheck,@barCheck,@photCheck,@workordertype,@empKey,@batchScheduleNameKey,@workorderNotes,@OrganizationID,@fromdate,@todate,@scheduledTime,@keepActivCheck,@snapshot,@CreateWO)", [temproomid, roomList, frequency, monCheck, tueCheck, wedCheck, thuCheck, friCheck, satCheck, sunCheck, barCheck, photCheck, workordertype, empKey, batchScheduleNameKey, workorderNotes, OrganizationID, fromdate, todate, scheduledTime, keepActivCheck, snapshot, CreateWO], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[23]));
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
            connection.query('set @BatchScheduleNameKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_viewScheduleReport(@BatchScheduleNameKey,@employeekey,@OrganizationID)', [BatchScheduleNameKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/viewMeettingTrainingByAllFilter', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var empKey = newWOObj.empKey;
    var search_DT = newWOObj.search_DT;
    var search_DT2 = newWOObj.search_DT2;
    var employees = newWOObj.employees;
    var jobs = newWOObj.jobs;
    var OrgID = newWOObj.OrgID;
    var DeptKey = newWOObj.DeptKey;
    var Evntype = newWOObj.Evntype;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @search_DT=?; set@search_DT2=?; set@employees=?; set@jobs=?; set @empKey=?; set @DeptKey=?; set @Evntype=?;set @OrgID=?;call usp_viewMeettingTrainingByAllFilter(@search_DT,@search_DT2,@employees,@jobs,@empKey,@DeptKey,@Evntype,@OrgID)", [search_DT, search_DT2, employees, jobs, empKey, DeptKey, Evntype, OrgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/JobtitleForSuperAdmin', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_JobtitleForSuperAdmin(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @OrganizationID=?; call usp_getManagerForUpdateEmployeeDetails(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_searchBuildingList(@searchFacility,@OrganizationID)', [searchFacility, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_getSearchFloor(@searchFacility,@OrganizationID)', [searchFloor, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFacility=?; set @OrganizationID=?; call usp_searchZoneList(@searchFacility,@OrganizationID)', [searchZone, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchFloorType=?; set @OrganizationID=?; call usp_searchFloorTypeList(@searchFloorType,@OrganizationID)', [searchFloorType, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getSearchFloor...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/searchWorkorderByallFilters', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;  set @BatchScheduleNameKey=?; set @OrganizationID=?; set @searchWO=?;  call usp_searchWorkorderByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@BatchScheduleNameKey,@OrganizationID,@searchWO)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, BatchScheduleNameKey, OrganizationID, searchWO], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[14]));
                }
            });
        }
        connection.release();
    });
});




app.post(securedpath + '/searchWorkorderScheduleByallFilters', supportCrossOriginScript, function (req, res) {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;set @batchScheduleNameKey=?;set @OrganizationID=?; set@searchWO=?; call usp_searchWorkorderScheduleByallFilters(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@batchScheduleNameKey,@OrganizationID,@searchWO)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, batchScheduleNameKey, OrganizationID, searchWO], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[14]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/searchMeetingEventView', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var empKey = newWOObj.empKey;
    var search_DT = newWOObj.search_DT;
    var search_DT2 = newWOObj.search_DT2;
    var employees = newWOObj.employees;
    var jobs = newWOObj.jobs;
    var searchMeeting = newWOObj.searchMeeting;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(" set @search_DT=?; set@search_DT2=?; set@employees=?; set@jobs=?; set @empKey=?; set @searchMeeting=?;call usp_searchMeetingEventView(@search_DT,@search_DT2,@employees,@jobs,@empKey,@searchMeeting)", [search_DT, search_DT2, employees, jobs, empKey, searchMeeting], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchMytemp=?; set @OrganizationID=?; call usp_searchMytemplate(@searchMytemp,@OrganizationID)', [searchMytemp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchMytemp=?; set @OrganizationID=?; set @TemplateID=?; call usp_searchtemplateQun(@searchMytemp,@OrganizationID,@TemplateID)', [searchMytemp, OrganizationID, TemplateID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    console.log(OrganizationID + " " + searchForm);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchForm=?; set @OrganizationID=?; call usp_searchFormList(@searchForm,@OrganizationID)', [searchForm, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    console.log(OrganizationID + " " + searchForm);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchForm=?; set @OrganizationID=?; call usp_searchViewFormList(@searchForm,@OrganizationID)', [searchForm, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    console.log(OrganizationID + " " + searchEquipmentType);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @searchEquipmentType=?; set @OrganizationID=?; call usp_searchEquipmentTypeList(@searchEquipmentType,@OrganizationID)', [searchEquipmentType, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("searchEquipmentTypeList...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});





app.post(securedpath + '/myWorkOrderSearchList', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    console.log("server new manager " + manager);

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

    var zoneKey = newWOObj.zoneKey;
    console.log("inside server zoneKey= " + zoneKey);
    var OrganizationID = newWOObj.OrganizationID;
    var searchWO = newWOObj.searchWO;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchWO=?; set @manager =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?; set @roomTypeKey=?;set @floorKey=?;set @zoneKey=?;set @OrganizationID =?;call usp_myWorkOrderSearchList(@searchWO,@manager,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@zoneKey,@OrganizationID)", [searchWO, manager, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, zoneKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?;call usp_allWorkOrderTypeWithOutQuick(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

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
            connection.query('set @FacilityKey=?;set @FloorKey=?;set @OrganizationID=?; call usp_getEquipmentBuildFloor_Ang6(@FacilityKey,@FloorKey,@OrganizationID)', [FacilityKey, FloorKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @workorderkey=?;set @OrganizationID=?; call usp_getFloorKeyForEquipWorkOrder(@workorderkey,@OrganizationID)', [workorderkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @workorderSchedulekey=?;set @OrganizationID=?; call usp_getFloorKeyForEquipSchedule(@workorderSchedulekey,@OrganizationID)', [workorderSchedulekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @workorderSchedulekey=?;set @OrganizationID=?; call usp_getEquipmentNameList(@workorderSchedulekey,@OrganizationID)', [workorderSchedulekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @FacilityKey=?;set @FloorKey=?; set@EquipmentTypeKey=?; set@OrganizationID=?; call usp_getEquipmentEquTypeChange(@FacilityKey,@FloorKey,@EquipmentTypeKey,@OrganizationID)', [FacilityKey, FloorKey, EquipmentTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getEquipmentEquTypeChange...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/emailForInspectionComp', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var inspectionAssignEmp = url.parse(req.url, true).query['inspectionAssignEmp'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionAssignEmp=?;set @employeekey=?;  set@OrganizationID=?; call usp_emailForInspectionComp(@inspectionAssignEmp,@employeekey,@OrganizationID)', [inspectionAssignEmp, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("emailForInspectionComp...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
// varun code ends
app.get(securedpath + '/welcomeMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_welcomeMessage(@empkey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
    var ShiftType = url.parse(req.url, true).query['ShiftType'];
    var ShiftValue = url.parse(req.url, true).query['ShiftValue'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?;set @empkey=?;set @userkey=?;set @OrganizationID=?; set @ShiftType=?; set @ShiftValue=?; call usp_getvaluesforpie(@date,@empkey,@userkey,@OrganizationID,@ShiftType,@ShiftValue)', [date, empkey, userkey, OrganizationID, ShiftType, ShiftValue], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/welcomeMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?; call usp_welcomeMessage(@empkey)', [empKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderByfilterPie', supportCrossOriginScript, function (req, res) {

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
    var ShiftType = newWOObj.ShiftType;
    var ShiftValue = newWOObj.ShiftValue;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?; set @workorderDate =?; set @workorderDate2 =?; set @employeekey=?; set @workorderTypeKey=?;set @OrganizationID=?; set@ShiftType=?; set@ShiftValue=?;  call usp_workorderByallFiltersPie(@manager,@workorderDate,@workorderDate2,@employeekey,@workorderTypeKey,@OrganizationID,@ShiftType,@ShiftValue)", [manager, workorderDate, workorderDate2, employeekey, workorderTypeKey, OrganizationID, ShiftType, ShiftValue], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/generatedowntimeWeeklyReport', supportCrossOriginScript, function (req, res) {

    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var employeekey = req.body.employeekeyList;
    var organizationid = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fromdate=?;set @todate=?; set @employeekey=?; set @organizationid=?; call usp_reportdowntime_dateconstrained(@fromdate,@todate,@employeekey,@organizationid)", [fromdate, todate, employeekey, organizationid], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllFloorsForbuildings', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityKey = url.parse(req.url, true).query['facilityKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilityKey=?;set @OrganizationID =?; call usp_getFloorsForBuildings(@facilityKey,@OrganizationID )', [facilityKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/getAllZonebuildings', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityKey = req.body.facilityKey;
    var floorKey = req.body.FloorKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilityKey=?;set @floorKey=?;set @OrganizationID =?; call usp_getZonesForBuildings(@facilityKey,@floorKey,@OrganizationID )', [facilityKey, floorKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/getAllRoomTypebuildings', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityKey = req.body.facilityKey;
    var floorKey = req.body.FloorKey;
    var zoneKey = req.body.ZoneKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilityKey=?;set @floorKey=?;set @zoneKey=?; set @OrganizationID =?; call usp_getRoomtypesForBuildings(@facilityKey,@floorKey,@zoneKey,@OrganizationID )', [facilityKey, floorKey, zoneKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/getAllFloorTypebuildings', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityKey = req.body.facilityKey;
    var floorKey = req.body.FloorKey;
    var zoneKey = req.body.ZoneKey;
    var roomTypeKey = req.body.RoomTypeKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilityKey=?;set @floorKey=?;set @zoneKey=?;set @roomTypeKey=?;set @OrganizationID =?; call usp_getFloortypesForBuildings(@facilityKey,@floorKey,@zoneKey,@roomTypeKey,@OrganizationID )', [facilityKey, floorKey, zoneKey, roomTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/getAllRoombuildings', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilityKey = req.body.facilityKey;
    var floorKey = req.body.FloorKey;
    var zoneKey = req.body.ZoneKey;
    var roomTypeKey = req.body.RoomTypeKey;
    var floorTypeKey = req.body.FloorTypeKey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilityKey=?;set @floorKey=?;set @zoneKey=?;set @roomTypeKey=?;set @floorTypeKey=?;set @OrganizationID =?; call usp_getRoomsForBuildings(@facilityKey,@floorKey,@zoneKey,@roomTypeKey,@floorTypeKey,@OrganizationID )', [facilityKey, floorKey, zoneKey, roomTypeKey, floorTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/inventoryReportByallFilters', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var facilitykey = newWOObj.facilitykey;
    var floorKey = newWOObj.floorKey;
    var zoneKey = newWOObj.zoneKey;
    var roomTypeKey = newWOObj.roomTypeKey;
    var floorTypeKey = newWOObj.floorTypeKey;
    var roomKey = newWOObj.roomKey;
    var OrganizationID = newWOObj.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @facilitykey=?; set @floorKey=?;set @zoneKey=?;set @roomTypeKey=?;set @floorTypeKey=?;set @roomKey=?;set @OrganizationID=?;call usp_getinventoryReportByallFilters(@facilitykey,@floorKey,@zoneKey,@roomTypeKey,@floorTypeKey,@roomKey,@OrganizationID)", [facilitykey, floorKey, zoneKey, roomTypeKey, floorTypeKey, roomKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
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
    var ShiftType = newWOObj.ShiftType;
    var ShiftValue = newWOObj.ShiftValue;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @date1=?; set @empkey=?; set @managerKey=?; set @WorkorderTypeKey=?;set @OrganizationID=?; set @ShiftType=?; set@ShiftValue=?; call usp_getEmpvaluesforpie(@date,@date1,@empkey,@managerKey,@WorkorderTypeKey,@OrganizationID,@ShiftType,@ShiftValue)', [date, date1, empkey, managerKey, WorkorderTypeKey, OrganizationID, ShiftType, ShiftValue], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[8]));
                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});
//Pooja's code starts here

app.options('/addReview', supportCrossOriginScript);
app.post(securedpath + '/addReview', supportCrossOriginScript, function (request, res) {

    var Orgid = request.body.Orgid;
    var templateid = request.body.templateid;
    var Comments = request.body.Comments;
    var feedback_time = request.body.feedback_time;
    var roomKey = request.body.roomKey;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Orgid=?; set @templateid=?; set @Comments=?; set @feedback_time=?; set @roomKey=?; call usp_addReviews(@Orgid,@templateid,@Comments,@feedback_time,@roomKey)', [Orgid, templateid, Comments, feedback_time, roomKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    console.log("ROWS" + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/welcomeUpdateMessage', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_welcomeUpdateMessage(@empkey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templatename=?;set @tempEditid=?;set @OrganizationID=?;set @ScoreTypeKey=?; call usp_updateTemplateDetails(@templatename,@tempEditid,@OrganizationID,@ScoreTypeKey)', [templatename, tempEditid, OrganizationID, ScoreTypeKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchLocation=?;set @search_DT=?;set @search_DT2=?; call usp_searchInspectionOrder(@OrganizationID,@searchLocation,@search_DT,@search_DT2)', [OrganizationID, searchLocation, search_DT, search_DT2], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchRoomType=?; call usp_searchroomType(@OrganizationID,@searchRoomType)', [OrganizationID, searchRoomType], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchEquipment=?; call usp_searchequipment(@OrganizationID,@searchEquipment)', [OrganizationID, searchEquipment], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchWorkOrderType=?; call usp_searchworkOrderType(@OrganizationID,@searchWorkOrderType)', [OrganizationID, searchWorkOrderType], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchJobTitle=?; call usp_searchjobTitle(@OrganizationID,@searchJobTitle)', [OrganizationID, searchJobTitle], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchSchedule=?; call usp_searchScheduleName(@OrganizationID,@searchSchedule)', [OrganizationID, searchSchedule], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchJobTitle=?; call usp_adminsearchJobTitle(@OrganizationID,@searchJobTitle)', [OrganizationID, searchJobTitle], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchDepartment=?; call usp_adminSearchDepartment(@OrganizationID,@searchDepartment)', [OrganizationID, searchDepartment], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @OrganizationID=?;set @searchActionType=?;set @toServeremployeekey=?;set @today_DT=?; call usp_searchEmpMeetingORTraining(@OrganizationID,@searchActionType,@toServeremployeekey,@today_DT)', [OrganizationID, searchActionType, toServeremployeekey, today_DT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
    var RoomTypeKey = newWOObj.RoomTypeKey;
    var OrganizationID = newWOObj.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @FacilityKey=?;set @FloorKey=?; set @ZoneKey=?; set @RoomTypeKey=?; set @OrganizationID=?;call usp_getfloorTypeValue(@FacilityKey,@FloorKey,@ZoneKey,@RoomTypeKey,@OrganizationID)", [FacilityKey, FloorKey, ZoneKey, RoomTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/saveEmployeeShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var start_sun_hour = req.body.start_sun_hour;
    var start_sun_min = req.body.start_sun_min;
    var start_sun_format = req.body.start_sun_format;
    var start_mon_hour = req.body.start_mon_hour;
    var start_mon_min = req.body.start_mon_min;
    var start_mon_format = req.body.start_mon_format;
    var start_tue_hour = req.body.start_tue_hour;
    var start_tue_min = req.body.start_tue_min;
    var start_tue_format = req.body.start_tue_format;
    var start_wed_hour = req.body.start_wed_hour;
    var start_wed_min = req.body.start_wed_min;
    var start_wed_format = req.body.start_wed_format;
    var start_thu_hour = req.body.start_thu_hour;
    var start_thu_min = req.body.start_thu_min;
    var start_thu_format = req.body.start_thu_format;
    var start_fri_hour = req.body.start_fri_hour;
    var start_fri_min = req.body.start_fri_min;
    var start_fri_format = req.body.start_fri_format;
    var start_sat_hour = req.body.start_sat_hour;
    var start_sat_min = req.body.start_sat_min;
    var start_sat_format = req.body.start_sat_format;
    var end_sun_hour = req.body.end_sun_hour;
    var end_sun_min = req.body.end_sun_min;
    var end_sun_format = req.body.end_sun_format;
    var end_mon_hour = req.body.end_mon_hour;
    var end_mon_min = req.body.end_mon_min;
    var end_mon_format = req.body.end_mon_format;
    var end_tue_hour = req.body.end_tue_hour;
    var end_tue_min = req.body.end_tue_min;
    var end_tue_format = req.body.end_tue_format;
    var end_wed_hour = req.body.end_wed_hour;
    var end_wed_min = req.body.end_wed_min;
    var end_wed_format = req.body.end_wed_format;
    var end_thu_hour = req.body.end_thu_hour;
    var end_thu_min = req.body.end_thu_min;
    var end_thu_format = req.body.end_thu_format;
    var end_fri_hour = req.body.end_fri_hour;
    var end_fri_min = req.body.end_fri_min;
    var end_fri_format = req.body.end_fri_format;
    var end_sat_hour = req.body.end_sat_hour;
    var end_sat_min = req.body.end_sat_min;
    var end_sat_format = req.body.end_sat_format;

    var idscheduler_exception = req.body.idscheduler_exception;

    var desc = req.body.desc;
    // var abbr = req.body.abbr;
    // var publishas = req.body.publishas;
    // var time1 = req.body.time1;
    // var paidhours = req.body.paidhours;
    // var time2 = req.body.time2;
    var color = req.body.color;
    var orgid = req.body.orgid;
    var empkey = req.body.empkey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @desc=?;set @color=?; set @orgid=?; set @empkey=?;set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;call usp_createEmployeeGroup(@desc,@color,@orgid,@empkey,@start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception)", [desc, color, orgid, empkey, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception], function (err, rows) {
                // set @abbr=?; set @publishas=?; set @time1=?; set @paidhours=?; set @time2=?; set @color=?; 
                // @abbr,@publishas,@time1,@paidhours,@time2,@color,
                // abbr, publishas, time1, paidhours, time2, color,
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(JSON.stringify(rows[47]));
                    res.end(JSON.stringify(rows[47]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmployeeShifts', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var toServeremployeekey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @toServeremployeekey=?; set @OrganizationID=?; call usp_getEmployeeGroups(@toServeremployeekey,@OrganizationID)', [toServeremployeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/removeEmployeeShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var dltkey = url.parse(req.url, true).query['dltkey'];
    var toServeremployeekey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @dltkey=?;set @toServeremployeekey=?; set @OrganizationID=?; call usp_deleteEmployeeGroup(@dltkey,@toServeremployeekey,@OrganizationID)', [dltkey, toServeremployeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getShiftsforEditing', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var shiftkey = url.parse(req.url, true).query['shiftkey'];
    var OrganizationID = url.parse(req.url, true).query['OrgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?; set @OrganizationID=?; call usp_getEmployeeGroupsforEditing(@shiftkey,@OrganizationID)', [shiftkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/updateEmployeeShiftDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var start_sun_hour = req.body.start_sun_hour;
    var start_sun_min = req.body.start_sun_min;
    var start_sun_format = req.body.start_sun_format;
    var start_mon_hour = req.body.start_mon_hour;
    var start_mon_min = req.body.start_mon_min;
    var start_mon_format = req.body.start_mon_format;
    var start_tue_hour = req.body.start_tue_hour;
    var start_tue_min = req.body.start_tue_min;
    var start_tue_format = req.body.start_tue_format;
    var start_wed_hour = req.body.start_wed_hour;
    var start_wed_min = req.body.start_wed_min;
    var start_wed_format = req.body.start_wed_format;
    var start_thu_hour = req.body.start_thu_hour;
    var start_thu_min = req.body.start_thu_min;
    var start_thu_format = req.body.start_thu_format;
    var start_fri_hour = req.body.start_fri_hour;
    var start_fri_min = req.body.start_fri_min;
    var start_fri_format = req.body.start_fri_format;
    var start_sat_hour = req.body.start_sat_hour;
    var start_sat_min = req.body.start_sat_min;
    var start_sat_format = req.body.start_sat_format;
    var end_sun_hour = req.body.end_sun_hour;
    var end_sun_min = req.body.end_sun_min;
    var end_sun_format = req.body.end_sun_format;
    var end_mon_hour = req.body.end_mon_hour;
    var end_mon_min = req.body.end_mon_min;
    var end_mon_format = req.body.end_mon_format;
    var end_tue_hour = req.body.end_tue_hour;
    var end_tue_min = req.body.end_tue_min;
    var end_tue_format = req.body.end_tue_format;
    var end_wed_hour = req.body.end_wed_hour;
    var end_wed_min = req.body.end_wed_min;
    var end_wed_format = req.body.end_wed_format;
    var end_thu_hour = req.body.end_thu_hour;
    var end_thu_min = req.body.end_thu_min;
    var end_thu_format = req.body.end_thu_format;
    var end_fri_hour = req.body.end_fri_hour;
    var end_fri_min = req.body.end_fri_min;
    var end_fri_format = req.body.end_fri_format;
    var end_sat_hour = req.body.end_sat_hour;
    var end_sat_min = req.body.end_sat_min;
    var end_sat_format = req.body.end_sat_format;
    var idscheduler_exception = req.body.idscheduler_exception;
    var groupID = req.body.groupId;
    var desc = req.body.desc;
    // var abbr = req.body.abbr;
    // var publishas = req.body.publishas;
    // var time1 = req.body.time1;
    // var paidhours = req.body.paidhours;
    // var time2 = req.body.time2;
    var color = req.body.color;
    var orgid = req.body.orgid;
    var empkey = req.body.empkey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @groupID=?;set @desc=?; set @color=?; set @orgid=?; set @empkey=?;set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;call usp_updateEmployeeGroupDetails(@groupID,@desc,@color,@orgid,@empkey,@start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception)", [groupID, desc, color, orgid, empkey, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception], function (err, rows) {
                // set @abbr=?; set @publishas=?; set @time1=?; set @paidhours=?; set @time2=?; 
                // @abbr,@publishas,@time1,@paidhours,@time2,
                // abbr, publishas, time1, paidhours, time2, color,
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(JSON.stringify(rows[47]));
                    res.end(JSON.stringify(rows[47]));
                }
            });
        }
        connection.release();
    });
});
//Pooja's code ends
//Roshni's code starts


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
            connection.query('set @OrganizationID=?;set @searchDepartment=?; call usp_searchDepartmentType(@OrganizationID,@searchDepartment)', [OrganizationID, searchDepartment], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
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
            connection.query('set @searchWO=?;set @OrganizationID=?;set @toServeremployeekey=?;set @today_DT=?; call usp_searchinspection(@searchWO,@OrganizationID,@toServeremployeekey,@today_DT)', [searchWO, OrganizationID, toServeremployeekey, today_DT], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getDefaultEventDetailsForEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var actionKey = url.parse(req.url, true).query['actionKey'];
    var actiontypeKey = url.parse(req.url, true).query['actiontypeKey'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @actionKey=?;set @actiontypeKey=?; set @employeekey=?;set @OrganizationID=?; call usp_getDefaultEventDetailsForEdit(@actionKey,@actiontypeKey,@employeekey,@OrganizationID)', [actionKey, actiontypeKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
const DIR = './uploads';
let storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        if (url.parse(req.url, true).query['formtypeId']) {
            cb(null, '../dist/mdb-angular-free/uploads');
        }
        else if (url.parse(req.url, true).query['Workorderkey']) {
            cb(null, '../dist/mdb-angular-free/pho1');
        }
    },
    filename: (req, file, cb) => {
        if (url.parse(req.url, true).query['formtypeId']) {
            var formtypeId = url.parse(req.url, true).query['formtypeId'];
            var formDesc = url.parse(req.url, true).query['formDesc'];
            var empkey = url.parse(req.url, true).query['empkey'];
            var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

            var filename = file.originalname;

            console.log(" SSSSSSSSSSSSSSSSSS fid fdesc fname are  " + formtypeId + " " + formDesc + " " + filename + " " + multerUploadPath);


            pool.getConnection(function (err, connection) {
                if (err) {

                    console.log("Failed! Connection with Database spicnspan via connection pool failed");
                }
                else {
                    console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                    connection.query('set @formtypeId=?;set @empkey=?;set @fileName=?;set @formDesc=?; set @OrganizationID=?; call usp_uploadFormFile(@formtypeId,@empkey,@fileName,@formDesc,@OrganizationID)', [formtypeId, empkey, filename, formDesc, OrganizationID], function (err) {
                        if (err)
                            console.log("my error" + err);
                    });
                }
                connection.release();
            });
        }
        else if (url.parse(req.url, true).query['Workorderkey']) {
            console.log("VVVVVVVVVVVVVVVV inside storage_WOPhoto XXXXXXXXXXXXXXXXXXXXXXXXX" + multerUploadPath);

            var filename = file.originalname;
            var wdkey = url.parse(req.url, true).query['Workorderkey'];
            var employeekey = url.parse(req.url, true).query['EmployeeKey'];

            var newPath = filename;
            var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

            console.log("pho " + filename + " wdkey " + wdkey + " employeekey " + employeekey);
            console.log("path " + newPath);
            pool.getConnection(function (err, connection) {
                if (err) {

                    console.log("Failed! Connection with Database spicnspan via connection pool failed");
                }
                else {
                    console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                    connection.query(" set @wdk=?;set @imgname=?; set @employeekey=?; set @OrganizationID=?; call usp_WorkorderStatusUpdateByPhoto(@wdk,@imgname,@employeekey,@OrganizationID)", [wdkey, newPath, employeekey, OrganizationID], function (err) {
                        if (err)
                            console.log("my error" + err);
                    });
                }
                connection.release();
            });

        }
        console.log(file.name);

        cb(null, file.originalname);
    }
});

let upload1 = multer({ storage: storage1 });


app.post('/api/upload_test', upload1.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
});
//file upload in view inspection starts : @Pooja

let inspstorage1 = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, '../dist/mdb-angular-free/Inspection-Upload');


    },
    filename: (req, file, cb) => {

        var InspectionOrderKey = url.parse(req.url, true).query['IoKey'];
        var empkey = url.parse(req.url, true).query['empkey'];
        var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
        var filename = file.originalname;

        // console.log(" SSSSSSSSSSSSSSSSSS fid fdesc fname are  " + formtypeId + " " + formDesc + " " + filename + " " + multerUploadPath);


        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            }
            else {
                console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                connection.query('set @InspectionOrderKey=?;set @empkey=?;set @OrganizationID=?;set @fileName=?; call usp_uploadInspectionFile(@InspectionOrderKey,@empkey,@OrganizationID,@fileName)', [InspectionOrderKey, empkey, OrganizationID, filename], function (err) {
                    if (err)
                        console.log("my error" + err);
                });
            }
            connection.release();
        });


        console.log(file.name);

        cb(null, file.originalname);
    }
});

let inspupload1 = multer({ storage: inspstorage1 });


app.post('/api/inspection_Upload', inspupload1.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
});


//file upload in view inspection ends : @Pooja

//Scheduled Rooms by Prakash Starts here

app.post(securedpath + '/getscheduledroomsbybatchschedulename', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var batchschedulenamekey = req.body.batchschedulenamekey;
    var OrganizationID = req.body.OrganizationID;
    var build = req.body.build;
    var flr = req.body.flr;
    var zone = req.body.zone;
    var rmtype = req.body.rmtype;
    var room = req.body.room;
    var flrtyp = req.body.flrtyp;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @batchschedulenamekey=?; set @OrganizationID=?; set @build=?; set @flr=?; set @zone=?; set @rmtype=?; set @room=?; set @flrtyp=?; call usp_getscheduledroomsbybatchschedulenamekey(@batchschedulenamekey,@OrganizationID,@build,@flr,@zone,@rmtype,@room,@flrtyp)', [batchschedulenamekey, OrganizationID, build, flr, zone, rmtype, room, flrtyp], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getscheduledroomsbybatchschedulename " + JSON.stringify(rows[8]));
                    res.end(JSON.stringify(rows[8]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getScheduleRoomslistByBatchScheduleNamekey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var batchschedulenamekey = url.parse(req.url, true).query['batchschedulenamekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @batchschedulenamekey=?; set @OrganizationID=?; call usp_getroomsforSchedulebybatchschedulenamekey(@pageno,@itemsperpage,@batchschedulenamekey,@OrganizationID)', [pageno, itemsperpage, batchschedulenamekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getScheduleRoomslistByBatchScheduleNamekey " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/deleteScheduledRoomslistbyscheduleroomid', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var workorderscheduleroomid = req.body.workorderscheduleroomid;
    var OrganizationID = req.body.OrganizationID;
    var employeekey = req.body.employeekey;
    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workorderscheduleroomid=?; set @employeekey=?;set @OrganizationID=?; call usp_deleteScheduledRoombyScheduledid(@workorderscheduleroomid,@employeekey,@OrganizationID)', [workorderscheduleroomid, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteScheduledRoomslistbyscheduleroomid " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getBatchScheduleMasterDetailService', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var batchschedulenamekey = url.parse(req.url, true).query['batchschedulenamekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @batchschedulenamekey=?; set @employeekey=?;set @OrganizationID=?; call usp_getbatchschedulemasterdetailsbatchnamekey(@batchschedulenamekey,@employeekey,@OrganizationID)', [batchschedulenamekey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getBatchScheduleMasterDetailService " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/roomstempForCreateBatchSchedule', function (req, res) {
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
            connection.query('set @BatchScheduleNameKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_roomstempForCreateBatchSchedule(@BatchScheduleNameKey,@employeekey,@OrganizationID)', [BatchScheduleNameKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/viewFilterRoomsforScheduleroom', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var batchschedulenamekey = newWOObj.batchschedulenamekey;
    var searchtype = newWOObj.searchtype;
    var searchvalue = newWOObj.searchname;
    var facilitykey = newWOObj.facilitykey;
    var floorkey = newWOObj.floorkey;
    var zonekey = newWOObj.zonekey;
    var roomkey = newWOObj.roomkey;
    var roomtypekey = newWOObj.roomTypeKey;
    var floortypekey = newWOObj.floortypekey;
    var OrganizationID = newWOObj.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @batchschedulenamekey =?; set @searchtype =?; set @searchvalue =?; set @facilitykey=?; set @floorkey=?;set @zonekey=?;set @roomkey=?;set @roomtypekey=?;set @floortypekey=?;set @OrganizationID=?;call usp_getfilterroomsforSchedulebybatchschedulenamekey(@batchschedulenamekey,@searchtype,@searchvalue,@facilitykey,@floorkey,@zonekey,@roomkey,@roomtypekey,@floortypekey,@OrganizationID)", [batchschedulenamekey, searchtype, searchvalue, facilitykey, floorkey, zonekey, roomkey, roomtypekey, floortypekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[10]));
                }
            });
        }
        connection.release();
    });
});
// api for deleting inspection order starts:@Pooja

app.post(securedpath + '/deleteInspectionOrders', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var deleteInspectionOrderList = req.body.deleteInspectionOrderList;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @deleteInspectionOrderList =?; set @employeekey =?; set @OrganizationID =?; call usp_deleteInspectionOrder(@deleteInspectionOrderList,@employeekey,@OrganizationID)", [deleteInspectionOrderList, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
// api for deleting inspection order ends:@Pooja

// app.post(securedpath + '/saveScheduleReport', supportCrossOriginScript, function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//     var newWOObj = {};
//     newWOObj = req.body;
//     var temproomid = newWOObj.temproomidlist;
//     var roomList = newWOObj.roomList;
//     var frequency = newWOObj.frequency;
//     var monCheck = newWOObj.monCheck;
//     var tueCheck = newWOObj.tueCheck;
//     var wedCheck = newWOObj.wedCheck;
//     var thuCheck = newWOObj.thuCheck;
//     var friCheck = newWOObj.friCheck;
//     var satCheck = newWOObj.satCheck;
//     var sunCheck = newWOObj.sunCheck;
//     var barCheck = newWOObj.barCheck;
//     var photCheck = newWOObj.photCheck;
//     var workordertype = newWOObj.workordertype;

//     var empKey = newWOObj.empKey;
//     var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
//     var workorderNotes = newWOObj.WorkorderNotes;
//     var OrganizationID = newWOObj.OrganizationID;
//     var fromdate = newWOObj.fromdate;
//     var todate = newWOObj.todate;


//     pool.getConnection(function (err, connection) {
//         if (err) {

//             console.log("Failed! Connection with Database spicnspan via connection pool failed");
//         }
//         else {
//             console.log("Success! Connection with Database spicnspan via connection pool succeeded");
//             connection.query("set @temproomid =?; set @roomList =?; set @frequency =?; set @monCheck =?; set @tueCheck=?; set @wedCheck=?; set @thuCheck=?; set @friCheck=?; set @satCheck=?; set @sunCheck=?; set @barCheck=?; set @photCheck=?; set @workordertype=?; set @empKey=?; set @batchScheduleNameKey=?; set @workorderNotes=?;set @OrganizationID =?; set @fromdate =?; set @todate =?; call usp_saveScheduleReport(@temproomid,@roomList,@frequency,@monCheck,@tueCheck,@wedCheck,@thuCheck,@friCheck,@satCheck,@sunCheck,@barCheck,@photCheck,@workordertype,@empKey,@batchScheduleNameKey,@workorderNotes,@OrganizationID,@fromdate,@todate)", [temproomid, roomList, frequency, monCheck, tueCheck, wedCheck, thuCheck, friCheck, satCheck, sunCheck, barCheck, photCheck, workordertype, empKey, batchScheduleNameKey, workorderNotes, OrganizationID, fromdate, todate], function (err, rows) {
//                 if (err) {
//                     console.log("Problem with MySQL" + err);
//                 }
//                 else {

//                     res.end(JSON.stringify(rows[19]));
//                 }
//             });
//         }
//         connection.release();
//     });
// });

app.post(securedpath + '/updateScheduleReport', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var workorderroomid = newWOObj.workorderroomidlist;

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
    var snapshot = newWOObj.snapshot;
    var keepActivCheck = newWOObj.keepActiveCheck;
    var workordertype = newWOObj.workordertype;

    var empKey = newWOObj.empKey;
    var batchScheduleNameKey = newWOObj.batchScheduleNameKey;
    var workorderNotes = newWOObj.WorkorderNotes;
    var OrganizationID = newWOObj.OrganizationID;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;
    var scheduledTime = newWOObj.scheduleTime;

    var CreateWO = newWOObj.CreateWO;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workorderroomid =?; set @roomList =?; set @frequency =?; set @monCheck =?; set @tueCheck=?; set @wedCheck=?; set @thuCheck=?; set @friCheck=?; set @satCheck=?; set @sunCheck=?; set @barCheck=?; set @photCheck=?; set @workordertype=?; set @empKey=?; set @batchScheduleNameKey=?; set @workorderNotes=?;set @OrganizationID =?; set @fromdate =?; set @todate =?;set @scheduledTime =?;set @keepActivCheck=?;set @snapshot=?;set @CreateWO=?; call usp_updateScheduleReport(@workorderroomid,@roomList,@frequency,@monCheck,@tueCheck,@wedCheck,@thuCheck,@friCheck,@satCheck,@sunCheck,@barCheck,@photCheck,@workordertype,@empKey,@batchScheduleNameKey,@workorderNotes,@OrganizationID,@fromdate,@todate,@scheduledTime,@keepActivCheck,@snapshot,@CreateWO)", [workorderroomid, roomList, frequency, monCheck, tueCheck, wedCheck, thuCheck, friCheck, satCheck, sunCheck, barCheck, photCheck, workordertype, empKey, batchScheduleNameKey, workorderNotes, OrganizationID, fromdate, todate, scheduledTime, keepActivCheck, snapshot, CreateWO], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[23]));
                }
            });
        }
        connection.release();
    });
});


//Scheduled rooms by Prakash Ends Here

//Code for manual cronjob procedure call by Rodney starts here

//Cronjob for MST
app.get(securedpath + '/cronjobMST', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_workOrdersBatchAddByEvent()', [], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("cronjobMST " + JSON.stringify(rows[0]));
                    console.log("cronjob mst success");
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

//Cronjob for CST
app.get(securedpath + '/cronjobCST', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_workOrdersBatchAddByEvent_CST()', [], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("cronjobCST " + JSON.stringify(rows[0]));
                    console.log("cronjob cst success");
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});
//Code for manual cronjob procedure call by Rodney ends here
//CronJob Details- Rodney starts here
app.get(securedpath + '/cronjobworkorderCount', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var date1 = url.parse(req.url, true).query['date1'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date1=?;call usp_cronjob_workordersTotalcount(@date1)', [date1], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("cronjobworkorderCount " + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/cronjobunrunbatchdetailsCount', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var date1 = url.parse(req.url, true).query['date1'];
    var orgID = url.parse(req.url, true).query['OrgID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date1=?;set @orgID=?;call usp_cronjob_unrunBatchDetailedTotalcount(@date1,@orgID)', [date1, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("cronjobunrunbatchdetailsCount " + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
//CronJob Details- Rodney ends here

app.options('/employeeByJbtitleNempStatusFilter', supportCrossOriginScript);
app.post(securedpath + '/employeeByJbtitleNempStatusFilter', supportCrossOriginScript, function (req, res) {


    var jbtitlekey = req.body.JbTitlKy;
    var empstatskey = req.body.empstskey;
    var empkey = req.body.empkey;
    var orgid = req.body.orgid;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @jbtitlekey=?; set  @empstatskey=?;set  @empkey=?;set  @orgid=?; call usp_employeeFilterbyJbtitleEmpStatus(@jbtitlekey,@empstatskey,@empkey,@orgid)", [jbtitlekey, empstatskey, empkey, orgid], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

//old Sendmail Service

//App snapShot ---API

app.get(securedpath + '/barcodeRoomWithSnapshot_Ang', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];

    var workorderkey = url.parse(req.url, true).query['wkey'];
    var updatetype = url.parse(req.url, true).query['updatetype'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var complete_Time = url.parse(req.url, true).query['complete_Time'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @workdetail =?;set @barcode=?; set @empkey=?; set @updatetype=?; set @OrganizationID=?;set @complete_Time=?;call usp_WorkorderStatusUpdateByBarcodeWithSnapshot_Ang6(@workdetail,@barcode,@empkey,@updatetype,@OrganizationID,@complete_Time)", [workorderkey, barcode, employeekey, updatetype, OrganizationID, complete_Time], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.end(JSON.stringify(rows[5][0]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getEmployeesLocationWithSnapshot', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var workorderkey = url.parse(req.url, true).query['WorkOrderKey'];
    // var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @workorderkey=?; call usp_getEmployeesLocationWithSnapshot(@workorderkey)', [workorderkey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("usp_getEmployeesLocation...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

////code by aswathy starts////////

app.post(securedpath + '/generatedowntimeReport', supportCrossOriginScript, function (req, res) {

    var fromdate = req.body.fromdate;
    var employeekey = req.body.employeekey;
    var organizationid = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @fromdate=?; set @employeekey=?; set @organizationid=?; call usp_reportdowntimeemployee(@fromdate,@employeekey,@organizationid)", [fromdate, employeekey, organizationid], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
///code by aswathy ends here//

app.post(securedpath + '/sendmail', function (req, res) {
    var options = {
        service: 'Gmail',
        auth: {
            api_key: sendGridApi.ApiKey
        }
    };
    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.sendMail(req.body, function (error, info) {
        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            } else {

                console.log("nodemailer...from server..");
                res.end("Success");

            }
            connection.release();
        });

    });
});
// for profile photo upload--raima
let imgstorage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../dist/mdb-angular-free/imageupload');
    },
    filename: (req, file, cb) => {

        // var idimageupload = url.parse(req.url, true).query['imgkey'];
        var empkey = url.parse(req.url, true).query['empkey'];
        var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
        var filename = file.originalname;

        // console.log(" SSSSSSSSSSSSSSSSSS fid fdesc fname are  " + formtypeId + " " + formDesc + " " + filename + " " + multerUploadPath);


        pool.getConnection(function (err, connection) {
            if (err) {

                console.log("Failed! Connection with Database spicnspan via connection pool failed");
            }
            else {
                console.log("Success! Connection with Database spicnspan via connection pool succeeded");
                connection.query('set @empkey=?;set @OrganizationID=?;set @fileName=?; call usp_uploadimgFile(@empkey,@OrganizationID,@fileName)', [empkey, OrganizationID, filename], function (err) {
                    if (err)
                        console.log("my error" + err);
                });
            }
            connection.release();
        });


        console.log(file.name);

        cb(null, file.originalname);
    }
});

let imgupload1 = multer({ storage: imgstorage1 });


app.post(securedpath + '/imgupload', imgupload1.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
});
//for profile photo get--raima
app.post(securedpath + '/getprofileimgapi', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var employeeKey = req.body.empid;
    var OrganisationId = req.body.orgid;
    var imgid = 1;
    //var mDate = req.body.maintdate;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeeKey=?; set @OrganisationId=?; set @imgid=?;call usp_getuploadimage(@employeeKey,@OrganisationId,@imgid)', [employeeKey, OrganisationId, imgid], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteScheduledRoomslistbyscheduleroomid " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
//varun-> Azure Email Service...
// app.post(securedpath + '/sendmail', (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     sendgrid.setApiKey(config.sendGrid.ApiKey); //varun-> SendGrid Api from config.js

//   console.log(req.body.to+" "+req.body.from+" "+req.body.subject+" "+req.body.text+' '+config.sendGrid.ApiKey)
//     var email = 
//         {
//             to: req.body.to,
//             from: req.body.from,
//             subject: req.body.subject,
//             // text: req.body.text,
//              html: req.body.html ,
//     };
//     //);    

//     sendgrid.send(email, function(err, json){
//         if(err) { return console.error(err); }
//         res.status(200).json({"msg":"Email sent successfully to " + req.body.to});
//         console.log('Email sent successfully to ', req.body.to);
//     });
//   });





var rule = new scheduler.RecurrenceRule();
rule.hour = 7;
rule.minute = 00;
rule.second = 00;
rule.dayOfWeek = new scheduler.Range(0, 6);

scheduler.scheduleJob(rule, function () {


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            //            console.log("WoooooW!!!!****************************Scheduler Works");
            connection.query('call usp_workOrdersBatchAddByEvent()', [], function (err, rows) {


                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Scheduler...from server..");

                }
            });
        }
        connection.release();
    });
});

var rule1 = new scheduler.RecurrenceRule();
rule1.hour = 10;
rule1.minute = 30;
rule1.second = 00;
rule1.dayOfWeek = new scheduler.Range(0, 6);

scheduler.scheduleJob(rule1, function () {


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {

            connection.query('call usp_workOrdersBatchAddByEvent_CST()', [], function (err, rows) {


                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Scheduler...from server..");

                }
            });
        }
        connection.release();
    });
});


var rule2 = new scheduler.RecurrenceRule();
rule2.hour = 08;
rule2.minute = 30;
rule2.second = 00;
rule2.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
rule2.date = 01;

scheduler.scheduleJob(rule2, function () {


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {

            connection.query('call usp_cronjob_employee()', [], function (err, rows) {


                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Scheduler...from server..");

                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/allWorkOrderTypeWithOutQuickNew', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?;call usp_allWorkOrderTypeWithOutQuickNew(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

// photoupload for app

app.get(securedpath + '/inspectionPhotoUpload', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var InspectionOrderKey = url.parse(req.url, true).query['InspectionOrderKey'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationId'];
    var filename = url.parse(req.url, true).query['Filename'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @InspectionOrderKey=?;set @empkey=?;set @OrganizationID=?;set @filename=?; call usp_uploadInspectionFile(@InspectionOrderKey,@empkey,@OrganizationID,@filename)', [InspectionOrderKey, empkey, OrganizationID, filename], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/checkForEmpGrpDuplicate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var groupname = url.parse(req.url, true).query['groupname'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @groupname=?;set @OrganizationID=?; call usp_checkForDuplicateEmpGroupName(@groupname,@OrganizationID)', [groupname, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getShiftNameList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var employeekey = url.parse(req.url, true).query['employeeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query(' set @employeekey=?;set @OrganizationID=?; call usp_getShiftNameList(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Facility Key...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


//********Scheduler************API BY varun starts

app.get(securedpath + '/employeesForScheduler', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @empkey=?;set @OrganizationID=?; call usp_getEmployeesForScheduler(@groupID,@empkey,@OrganizationID)', [groupID, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("json " + JSON.stringify(rows[3]));
                    // res.end(JSON.stringify(rows[3]));
                    var data = rows[3];
                    var resources = [];
                    var arr = 0;
                    var tempArr = [];
                    var selectedGroup = data[0].Idemployeegrouping;// 1st group Id                   
                    tempArr[arr] = [];// creating 2D array
                    for (var i = 0; i < data.length; i++) {
                        if (selectedGroup == data[i].Idemployeegrouping) {// check for group id  
                            data[i].IsShift = 0;
                            tempArr[arr].push(data[i]);
                        }
                        else {
                            arr = arr + 1;
                            tempArr[arr] = [];// creating 2D array
                            var selectedGroup = data[i].Idemployeegrouping
                            data[i].IsShift = 0;
                            tempArr[arr].push(data[i]);
                        }
                    }

                    for (var j = 0; j <= arr; j++) {// inserting array value to scheduler tree list
                        resources.push({ name: tempArr[j][0].Description, id: tempArr[j][0].Idemployeegrouping, "expanded": false, children: tempArr[j], IsShift: 1, backColor: tempArr[j][0].backColor });

                    }
                    res.send(resources);
                }
            });
        }
        connection.release();
    });
});
app.options('/SchedulerEventCreate', supportCrossOriginScript);
app.post(securedpath + '/SchedulerEventCreate', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var resourceEmployee = req.body.resourceEmployee;
    var start = req.body.start;
    var ScheduleNameKey = req.body.ScheduleNameKey;
    var MetaEmp = req.body.MetaEmp;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @resourceEmployee=?; set @start=?; set @ScheduleNameKey=?; set @MetaEmp=?; set@OrganizationID=?; call usp_SchedulerEventCreate(@resourceEmployee,@start,@ScheduleNameKey,@MetaEmp,@OrganizationID)', [resourceEmployee, start, ScheduleNameKey, MetaEmp, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteScheduledRoomslistbyscheduleroomid " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.options('/SchedulerEventUpdate', supportCrossOriginScript);
app.post(securedpath + '/SchedulerEventUpdate', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var resourceEmployee = req.body.resourceEmployee;
    var start = req.body.start;
    var ScheduleNameKey = req.body.ScheduleNameKey;
    var MetaEmp = req.body.MetaEmp;
    var OrganizationID = req.body.OrganizationID;
    var Assignment_CalenderID = req.body.Assignment_CalenderID;
    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @resourceEmployee=?; set @start=?; set @ScheduleNameKey=?; set @MetaEmp=?; set@OrganizationID=?; set@Assignment_CalenderID=?; call usp_SchedulerEventUpdate(@resourceEmployee,@start,@ScheduleNameKey,@MetaEmp,@OrganizationID,@Assignment_CalenderID)', [resourceEmployee, start, ScheduleNameKey, MetaEmp, OrganizationID, Assignment_CalenderID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("SchedulerEventUpdate " + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/SchedulerEventDelete', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Assignment_CalenderID = url.parse(req.url, true).query['Assignment_CalenderID'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Assignment_CalenderID=?; set @empkey=?;set @OrganizationID=?; call usp_SchedulerEventDelete(@Assignment_CalenderID,@empkey,@OrganizationID)', [Assignment_CalenderID, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/scheduleEventCheckForCreate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var checkDate = url.parse(req.url, true).query['checkDate'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @checkDate=?;set @empKey=?;set @OrganizationID=?; call usp_scheduleEventCheckForCreate(@checkDate,@empKey,@OrganizationID)', [checkDate, empKey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/SchedulerEmployeeGroups', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?; set@OrganizationID=?; call usp_SchedulerEmployeeGroups(@empKey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/SchedulerTimeRangeCheck', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ScheduleNameKey = url.parse(req.url, true).query['ScheduleNameKey'];
    var Date = url.parse(req.url, true).query['Date'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ScheduleNameKey=?; set@Date=?; set @empKey=?; set@OrganizationID=?; call usp_SchedulerTimeRangeCheck(@ScheduleNameKey,@Date,@empKey,@OrganizationID)', [ScheduleNameKey, Date, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[4]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/AllEmployeeWorkingHourList', function (req, res) {
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_AllEmployeeWorkingHourList(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/searchAllEmployeeWorkingHourList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var searchEmployee = url.parse(req.url, true).query['searchEmployee'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------searchAllEmployeeWorkingHourList---------" + empkey + " " + " " + pageno + " " + itemsPerPage + " ");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchEmployee =?;set @pageno=?; set @itemsPerPage=?;set @employeekey =?;set @OrganizationID =?;call usp_searchAllEmployeeWorkingHourList(@searchEmployee,@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [searchEmployee, pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getWorkingHourListForEmployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var startDT = url.parse(req.url, true).query['startDT'];
    var endDT = url.parse(req.url, true).query['endDT'];
    var selectEmpKey = url.parse(req.url, true).query['selectEmpKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @startDT =?;set @endDT=?; set@selectEmpKey=?; set @OrganizationID=?;call usp_getWorkingHourListForEmployee(@startDT,@endDT,@selectEmpKey,@OrganizationID)", [startDT, endDT, selectEmpKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.options('/deleteWorkingHours', supportCrossOriginScript);
app.post(securedpath + '/deleteWorkingHours', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var deleteWorkingHour = req.body.deleteWorkingHour;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @deleteWorkingHour=?; set @employeekey=?; set @OrganizationID=?;  call usp_deleteWorkingHours(@deleteWorkingHour,@employeekey,@OrganizationID)', [deleteWorkingHour, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkingHours " + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.options('/workingHourDateFilter', supportCrossOriginScript);
app.post(securedpath + '/workingHourDateFilter', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var empkey = req.body.empkey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromDate=?; set @toDate=?;set@empkey=?; set @OrganizationID=?;  call usp_workingHourDateFilter(@fromDate,@toDate,@empkey,@OrganizationID)', [fromDate, toDate, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkingHours " + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});
app.options('/createEmpWorkingHour', supportCrossOriginScript);
app.post(securedpath + '/createEmpWorkingHour', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var date = req.body.date;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var CreEmp = req.body.CreEmp;
    var metaCreate = req.body.metaCreate;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @startTime=?;set@endTime=?; set @CreEmp=?; set@metaCreate=?; set@OrganizationID=?;  call usp_createEmpWorkingHour(@date,@startTime,@endTime,@CreEmp,@metaCreate,@OrganizationID)', [date, startTime, endTime, CreEmp, metaCreate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkingHours " + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/schedulingIcons', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@empKey=?; set @OrganizationID=?;call usp_schedulingIcons(@empKey,@OrganizationID)", [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/SchedulerWorkingOffCheck', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var Date = url.parse(req.url, true).query['Date'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@Date=?; set@empKey=?; set @OrganizationID=?;call usp_SchedulerWorkingOffCheck(@Date,@empKey,@OrganizationID)", [Date, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEmpSchedulerStartDate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getEmpSchedulerStartDate()", [], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});
app.options('/addUserWorkRequest', supportCrossOriginScript);
app.post(securedpath + '/addUserWorkRequest', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var Facility_Key = req.body.Facility_Key;
    var Floor_Key = req.body.Floor_Key;
    var Zone_Key = req.body.Zone_Key;
    var Orgid = req.body.Orgid;
    var roomKey = req.body.roomKey;
    var Comments = req.body.Comments;
    var Datetime = req.body.Datetime;


    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@Facility_Key=?; set@Floor_Key=?; set@Zone_Key=?;set @Orgid=?; set @roomKey=?;set@Comments=?; set @Datetime=?; call usp_addUserWorkRequest(@Facility_Key,@Floor_Key,@Zone_Key,@Orgid,@roomKey,@Comments,@Datetime)', [Facility_Key, Floor_Key, Zone_Key, Orgid, roomKey, Comments, Datetime], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkingHours " + JSON.stringify(rows[7]));
                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/workorderCreateByEmployeeBarcode', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var barcode = url.parse(req.url, true).query['barcode'];
    var Date = url.parse(req.url, true).query['Date'];
    var checkIn = url.parse(req.url, true).query['checkIn'];
    var empKey = url.parse(req.url, true).query['emp'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@barcode=?;set@Date=?;set@checkIn=?; set@empKey=?; set @OrganizationID=?;call usp_workorderCreateByEmployeeBarcode(@barcode,@Date,@checkIn,@empKey,@OrganizationID)", [barcode, Date, checkIn, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/workorderCreateByEmployeeBarcodeWorkorderType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var barcode = url.parse(req.url, true).query['barcode'];
    var Date = url.parse(req.url, true).query['Date'];
    var checkIn = url.parse(req.url, true).query['checkIn'];
    var empKey = url.parse(req.url, true).query['emp'];
    var wot = url.parse(req.url, true).query['wot'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@barcode=?;set@Date=?;set@checkIn=?; set@empKey=?; set @wot=?; set @OrganizationID=?;call usp_workorderCreateByEmployeeBarcodeWorkorderType(@barcode,@Date,@checkIn,@empKey,@wot,@OrganizationID)", [barcode, Date, checkIn, empKey, wot, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/roomDetailsFromBarcode_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var scannedBarcode = url.parse(req.url, true).query['scannedBarcode'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@empkey=?;set@OrganizationID=?;set@scannedBarcode=?; call usp_roomDetailsFromBarcode_mob(@empkey,@OrganizationID,@scannedBarcode)", [empkey, OrganizationID, scannedBarcode], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3][0]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/checkRoomWorkorderCreateByEmployeeBarcode', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var barcode = url.parse(req.url, true).query['barcode'];
    var empKey = url.parse(req.url, true).query['emp'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@barcode=?; set@empKey=?; set @OrganizationID=?;call usp_checkRoomWorkorderCreateByEmployeeBarcode(@barcode,@empKey,@OrganizationID)", [barcode, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.options('/getInspectionReportByAllFilter', supportCrossOriginScript);
app.post(securedpath + '/getInspectionReportByAllFilter', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var TemplateName = req.body.TemplateName;
    var SupervisorKey = req.body.SupervisorKey;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromdate=?; set @todate=?; set @TemplateName=?; set @SupervisorKey=?; set@employeekey=?; set@OrganizationID=?; call usp_getInspectionReportByAllFilter(@fromdate,@todate,@TemplateName,@SupervisorKey,@employeekey,@OrganizationID)', [fromdate, todate, TemplateName, SupervisorKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getInspectionReportByAllFilter " + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.options('/workorderViewsEmpByAll', supportCrossOriginScript);
app.post(securedpath + '/workorderViewsEmpByAll', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.empKey;
    var startDate = newWOObj.startDate;
    var endDate = newWOObj.endDate;
    var SearchWO = newWOObj.SearchWO;
    var RoomTypeKey = newWOObj.RoomTypeKey;
    var FloorKey = newWOObj.FloorKey;
    var ZoneKey = newWOObj.ZoneKey;
    var FacilityKey = newWOObj.FacilityKey;
    var pageNo = newWOObj.pageNo;
    var itemsPerPage = newWOObj.itemsPerPage;
    var isFiltered = newWOObj.isFiltered;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @startDate=?;set @endDate=?;set @SearchWO=?; set@RoomTypeKey=?; set@FloorKey=?; set@ZoneKey=?; set@FacilityKey=?; set@pageNo=?; set@itemsPerPage=?; set@isFiltered=?; call usp_workorderViewsEmpByAll(@OrganizationID,@employeekey,@startDate,@endDate,@SearchWO,@RoomTypeKey,@FloorKey,@ZoneKey,@FacilityKey,@pageNo,@itemsPerPage,@isFiltered)', [OrganizationID, employeekey, startDate, endDate, SearchWO, RoomTypeKey, FloorKey, ZoneKey, FacilityKey, pageNo, itemsPerPage, isFiltered], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[12]));
                }
            });
        }
        connection.release();
    });
});

app.options('/workorderViewSupervisorByAll', supportCrossOriginScript);
app.post(securedpath + '/workorderViewSupervisorByAll', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.empKey;
    var startDate = newWOObj.startDate;
    var endDate = newWOObj.endDate;
    var SearchWO = newWOObj.SearchWO;
    var RoomTypeKey = newWOObj.RoomTypeKey;
    var FloorKey = newWOObj.FloorKey;
    var ZoneKey = newWOObj.ZoneKey;
    var FacilityKey = newWOObj.FacilityKey;
    var pageNo = newWOObj.pageNo;
    var itemsPerPage = newWOObj.itemsPerPage;
    var schedulename = newWOObj.schedulename;
    var employee = newWOObj.employee;
    var isFiltered = newWOObj.isFiltered;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @startDate=?;set @endDate=?;set @SearchWO=?; set@RoomTypeKey=?; set@FloorKey=?; set@ZoneKey=?; set@FacilityKey=?; set@pageNo=?;set@schedulename=?;set@employee=?; set@itemsPerPage=?; set@isFiltered=?; call usp_workorderViewSupervisorByAll(@OrganizationID,@employeekey,@startDate,@endDate,@SearchWO,@RoomTypeKey,@FloorKey,@ZoneKey,@FacilityKey,@pageNo,@schedulename,@employee,@itemsPerPage,@isFiltered)', [OrganizationID, employeekey, startDate, endDate, SearchWO, RoomTypeKey, FloorKey, ZoneKey, FacilityKey, pageNo, schedulename, employee, itemsPerPage, isFiltered], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[14]));
                }
            });
        }
        connection.release();
    });
});

//********Scheduler************API BY varun ends

//********Scheduler************API by Rodney starts

app.get(securedpath + '/employeeCalendarDetailsForScheduler', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var dateRange = url.parse(req.url, true).query['dateRange'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @startDate=?;set @dateRange=?;set @OrganizationID=?; call usp_getEmpDetailsFromEmpCalendar(@startDate,@dateRange,@OrganizationID)', [startDate, dateRange, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/employeeCalendarDetailsForSchedulerOnlyForView', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var dateRange = url.parse(req.url, true).query['dateRange'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var endDate = url.parse(req.url, true).query['endDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @startDate=?;set@endDate=?;set @dateRange=?; set @empKey=?; set @OrganizationID=?; call usp_getEmpDetailsFromEmpCalendar_EmployeeView(@startDate,@endDate,@dateRange,@empKey,@OrganizationID)', [startDate, endDate, dateRange, empKey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/employeesViewOnlyForScheduler', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_employeesForScheduler_EmployeeView(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

// *** PTO & Trade starts...
//code by Aswathy starts/.

app.post(securedpath + '/savePTORequest', supportCrossOriginScript, function (req, res) {

    var currentdate = req.body.currentdate;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var comments = req.body.comments;
    var reason = req.body.ptoreason;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currentdate=?;set @employeekey=?;set @OrganizationID=?;set @startdate=?;set @enddate=?;set @comments=?; set @reason=?; call usp_SavePTORequest(@currentdate,@employeekey,@OrganizationID,@startdate,@enddate,@comments,@reason)", [currentdate, employeekey, OrganizationID, startdate, enddate, comments, reason], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRequestDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?;set @OrganizationID=?;call usp_getRequestDetails(@empKey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRequestDetailsforEmployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ptorequestDetailsKey = url.parse(req.url, true).query['ptorequestDetails'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ptorequestDetailsKey=?;call usp_getRequestDetailsbyIDforEmployee(@ptorequestDetailsKey)', [ptorequestDetailsKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/setEditedRequest', supportCrossOriginScript, function (req, res) {

    var currdate = req.body.currdate;
    var ptorequestID = req.body.ptorequestID;
    var StartDate = req.body.StartDate;
    var EndDate = req.body.EndDate;
    var Comments = req.body.Comments;
    var reason = req.body.Reason;
    var empKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currdate=?;set @ptorequestID=?;set @StartDate=?;set @EndDate=?;set @Comments=?;set @reason=?;set @empKey=?;call usp_setEditedRequest(@currdate,@ptorequestID,@StartDate,@EndDate,@Comments,@reason,@empKey)", [currdate, ptorequestID, StartDate, EndDate, Comments, reason, empKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/deletePTORequest', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var deleteRequestKey = url.parse(req.url, true).query['deleteRequestKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @deleteRequestKey=?;set @OrganizationID=?; call usp_deletePTORequest(@deleteRequestKey,@OrganizationID)', [deleteRequestKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getRequestdetailsforManager', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;call usp_getRequestdetailsforManager(@OrganizationID,@employeekey)', [OrganizationID, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getRequestDetailsbyID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ptorequestDetailskey = url.parse(req.url, true).query['ptorequestDetailskey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ptorequestDetailskey=?;call usp_getRequestDetailsbyID(@ptorequestDetailskey)', [ptorequestDetailskey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getassignmentdetailsbyID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ptorequestDetailskey = url.parse(req.url, true).query['ptorequestDetailskey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ptorequestDetailskey=?; call usp_getassignmentdetailsbyID(@ptorequestDetailskey)', [ptorequestDetailskey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/savePTORequestAction', supportCrossOriginScript, function (req, res) {

    var ptorequestDetails = req.body.ptorequestDetails;
    var employeekey = req.body.employeekey;
    var statuscurrentdate = req.body.statuscurrentdate;
    var approvedstartdate = req.body.approvedstartdate;
    var ApprovedEndDate = req.body.ApprovedEndDate;
    var StatusKey = req.body.StatusKey;
    var statuscomments = req.body.statuscomments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @ptorequestDetails=?;set @employeekey=?;set @statuscurrentdate=?;set @approvedstartdate=?;set @ApprovedEndDate=?;set @StatusKey=?;set @statuscomments=?; call usp_SavePTORequestAction(@ptorequestDetails,@employeekey,@statuscurrentdate,@approvedstartdate,@ApprovedEndDate,@StatusKey,@statuscomments)", [ptorequestDetails, employeekey, statuscurrentdate, approvedstartdate, ApprovedEndDate, StatusKey, statuscomments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeeNames', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @employeekey=?; call usp_getAllEmployeeNames(@OrganizationID,@employeekey)', [OrganizationID, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/saveTradeRequest', supportCrossOriginScript, function (req, res) {

    var currentdate = req.body.currentdate;
    var toServeremployeekey = req.body.toServeremployeekey;
    var OrganizationID = req.body.OrganizationID;
    var EmployeeKey = req.body.EmployeeKey;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var comments = req.body.comments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currentdate=?;set @toServeremployeekey=?;set @OrganizationID=?;set @EmployeeKey=?;set @startdate=?;set @enddate=?;set @comments=?; call usp_SaveTradeRequest(@currentdate,@toServeremployeekey,@OrganizationID,@EmployeeKey,@startdate,@enddate,@comments)", [currentdate, toServeremployeekey, OrganizationID, EmployeeKey, startdate, enddate, comments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTradeRequestDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var empKey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @empKey=?; call usp_getTradeRequestDetails(@OrganizationID,@empKey)', [OrganizationID, empKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/deleteTradeRequest', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var deleteRequestKey = url.parse(req.url, true).query['deleteRequestKey'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @deleteRequestKey=?; set @employeeKey=?; call usp_deleteTradeRequest(@deleteRequestKey,@employeeKey)', [deleteRequestKey, employeeKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getTradeRequestInfoforEmployee', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var traderequestKey = url.parse(req.url, true).query['traderequestDetails'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @traderequestKey=?; set @OrganizationID=?; call usp_getTradeRequestDetailsbyIDforEmployee(@traderequestKey,@OrganizationID)', [traderequestKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/setEditedTradeRequest', supportCrossOriginScript, function (req, res) {

    var currdate = req.body.currdate;
    var traderequestID = req.body.traderequestID;
    var OtherEmployee = req.body.OtherEmployee;
    var StartDate = req.body.StartDate;
    var EndDate = req.body.EndDate;
    var Comments = req.body.Comments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currdate=?;set @traderequestID=?; set@OtherEmployee=?; set @StartDate=?;set @EndDate=?;set @Comments=?;call usp_setEditedTradeRequest(@currdate,@traderequestID,@OtherEmployee,@StartDate,@EndDate,@Comments)", [currdate, traderequestID, OtherEmployee, StartDate, EndDate, Comments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/getTradeRequestdetailsforManager', supportCrossOriginScript, function (req, res) {

    var newWOObj = req.body;
    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.employeekey;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;
    var TradeStatuses = newWOObj.TradeStatuses;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @fromdate=?;set @todate=?;set @TradeStatuses=?;call usp_getTradeRequestdetailsforManager(@OrganizationID,@employeekey,@fromdate,@todate,@TradeStatuses)', [OrganizationID, employeekey, fromdate, todate, TradeStatuses], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTradeRequestdetailsbyID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var tradeRequestID = url.parse(req.url, true).query['tradeRequestID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @tradeRequestID=?;call usp_getTradeRequestdetailsbyID(@tradeRequestID)', [tradeRequestID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAssignmentTradebyID', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var traderequestID = url.parse(req.url, true).query['traderequestID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @traderequestID=?;call usp_getAssignmentTradebyID(@traderequestID)', [traderequestID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/saveTradeRequestAction', supportCrossOriginScript, function (req, res) {

    var tradeRequestID = req.body.tradeRequestID;
    var employeekey = req.body.employeekey;
    var statuscurrentdate = req.body.statuscurrentdate;
    var approvedstartdate = req.body.approvedstartdate;
    var ApprovedEndDate = req.body.ApprovedEndDate;
    var StatusKey = req.body.StatusKey;
    var statuscomments = req.body.statuscomments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @tradeRequestID=?;set @employeekey=?;set @statuscurrentdate=?;set @approvedstartdate=?;set @ApprovedEndDate=?;set @StatusKey=?;set @statuscomments=?; call usp_saveTradeRequestAction(@tradeRequestID,@employeekey,@statuscurrentdate,@approvedstartdate,@ApprovedEndDate,@StatusKey,@statuscomments)", [tradeRequestID, employeekey, statuscurrentdate, approvedstartdate, ApprovedEndDate, StatusKey, statuscomments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

//code by Aswathy ends...
// *** PTO & Trade ends...
app.get(securedpath + '/getAllReasonsForLeaves', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getAllReasonsForLeaves(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/saveLeaveForEmp', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var reasonID = req.body.reason;
    var fromDate = req.body.from;
    var toDate = req.body.to;
    var empKey = req.body.empkey;
    var metauserKey = req.body.metauser;
    var OrganizationID = req.body.orgid;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @reasonID=?;set @fromDate=?;set @toDate=?;set @empKey=?;set @metauserKey=?;set @OrganizationID=?;call usp_saveManualLeaveForEmp(@reasonID,@fromDate,@toDate,@empKey,@metauserKey,@OrganizationID)', [reasonID, fromDate, toDate, empKey, metauserKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log(JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/SchedulerEmployeeGroups_EmpView', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var groupID = url.parse(req.url, true).query['grpID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @groupID=?; set@OrganizationID=?; call usp_SchedulerEmployeeGroups_EmpView(@groupID,@OrganizationID)', [groupID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeesForSchedulerReport', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getAllEmployeesForSchedulerReport(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeesofGroupForSchedulerReport', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var groupID = url.parse(req.url, true).query['groupID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @groupID=?;set @OrganizationID=?;call usp_getAllEmployeesofGroupForSchedulerReport(@groupID,@OrganizationID)', [groupID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/SchedulerEmployeeGroupsForReport', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getEmployeeGroupsForSchedulerReport(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/generateSchedulerReport', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fromdate = req.body.fromDate;
    var todate = req.body.toDate;
    var groupID = req.body.groupId;
    var employeeKeys = req.body.empKey;
    var OrganizationID = req.body.organizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromdate=?;set @todate=?;set @groupID=?;set @employeeKeys=?;set @OrganizationID=?;call usp_getEmpDetailsForSchedulerReport(@fromdate,@todate,@groupID,@employeeKeys,@OrganizationID)', [fromdate, todate, groupID, employeeKeys, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log(JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[5]));

                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/getIteratedDates', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fromdate = req.body.fromdate;
    // var todate = req.body.todate;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromdate=?;call usp_getIteratedDates(@fromdate)', [fromdate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
// Review starts....
app.get(securedpath + '/getReviewQuestionDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var templateID = url.parse(req.url, true).query['templateID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateID=?;set @OrganizationID=?;call usp_getReviewQuestionDetails(@templateID,@OrganizationID)', [templateID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/addReviewDetails', supportCrossOriginScript);
app.post(securedpath + '/addReviewDetails', supportCrossOriginScript, function (request, res) {

    var Orgid = request.body.OrganizationID;
    var feedbackmasterkey = request.body.feedbackmasterkey;
    var starvalue = request.body.templateQstnValues;
    var templateid = request.body.templateid;
    var questionid = request.body.questionid;
    var feedback_time = request.body.feedback_time;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @Orgid=?; set @feedbackmasterkey=?; set @starvalue=?; set @templateid=?;set @questionid=?; set @feedback_time=?; call usp_addReviewDetails(@Orgid,@feedbackmasterkey,@starvalue,@templateid,@questionid,@feedback_time)', [Orgid, feedbackmasterkey, starvalue, templateid, questionid, feedback_time], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    console.log("ROWS" + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getReviewDetailsForReport', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fromDate = url.parse(req.url, true).query['fromDate'];
    var toDate = url.parse(req.url, true).query['toDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromDate=?;set @toDate=?;set @OrganizationID=?;call usp_getReviewDetailsForReport(@fromDate,@toDate,@OrganizationID)', [fromDate, toDate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getTemplateDetailsForFeedbackByOrgId', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getTemplateDetailsForFeedbackByOrgId(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getFeedbackTemplateQuestionsEditDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getFeedbackTemplateQuestionsEditDetails(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });

});

app.options('/deleteSelectedFeedbackQuestion', supportCrossOriginScript);
app.post(securedpath + '/deleteSelectedFeedbackQuestion', supportCrossOriginScript, function (request, res) {

    var templateQuestionID = request.body.templateQuestionID;
    var updatedBy = request.body.updatedBy;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateQuestionID=?; set @updatedBy=?; set @OrganizationID=?; call usp_deleteSelectedFeedbackQuestion(@templateQuestionID,@updatedBy,@OrganizationID)', [templateQuestionID, updatedBy, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/createMasterReviewTempalte', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @OrganizationID=?;call usp_createMasterReviewTempalte(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });

});

app.options('/insertFeedbackQuestion', supportCrossOriginScript);
app.post(securedpath + '/insertFeedbackQuestion', supportCrossOriginScript, function (request, res) {

    var templateid = request.body.templateid;
    var question = request.body.question;
    var empKey = request.body.empKey;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @templateid=?;set @question=?; set @empKey=?; set @OrganizationID=?; call usp_insertFeedbackQuestion(@templateid,@question,@empKey,@OrganizationID)', [templateid, question, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.options('/cancelWorkOrder', supportCrossOriginScript);
app.post(securedpath + '/cancelWorkOrder', supportCrossOriginScript, function (request, res) {

    var workOrderKey = request.body.workOrderKey;
    var reason = request.body.Reason;
    var updateDate = request.body.updateDate;
    var updateTime = request.body.updateTime;
    var empKey = request.body.empKey;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workOrderKey=?;set @reason=?;set @updateDate=?;set @updateTime=?; set @empKey=?; set @OrganizationID=?; call usp_cancelWorkOrder(@workOrderKey,@reason,@updateDate,@updateTime,@empKey,@OrganizationID)', [workOrderKey, reason, updateDate, updateTime, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.options('/deleteEmpFromEmpGroup', supportCrossOriginScript);
app.post(securedpath + '/deleteEmpFromEmpGroup', supportCrossOriginScript, function (request, res) {

    var empKey = request.body.empKey;
    var OrganizationID = request.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?; set @OrganizationID=?; call usp_deleteEmpFromEmpGroup(@empKey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
//Review ends...
app.get(securedpath + '/getWODetailswithStatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getWODetailswithStatus(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/getAllEmployeesofGroupForSeniorityEdit', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var groupID = url.parse(req.url, true).query['groupID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @groupID=?;set @OrganizationID=?;call usp_getAllEmployeesofGroupForSeniorityEdit(@groupID,@OrganizationID)', [groupID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/updateEmployeeSeniorityORder', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['empKey'];
    var orderVal = url.parse(req.url, true).query['orderVal'];
    var metauser = url.parse(req.url, true).query['metauser'];
    // var metaDate = url.parse(req.url, true).query['metaDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?;set @orderVal=?;set @metauser=?;set @OrganizationID=?;call usp_updateSeniorityOrderOfEmployee(@empKey,@orderVal,@metauser,@OrganizationID)', [empKey, orderVal, metauser, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getEmployeesForSchedulerReport', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getEmployeesForSchedulerReport_SuType(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});
//********Scheduler************API by Rodney ends

// ^^^^^^^ supervisor api changes By Varun starts ^^^^^^^^^^^.

app.get(securedpath + '/getAllJobTitle', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @OrganizationID=?;call usp_getAllJobTitle(@OrganizationID)", [OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getallAuditors', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_getallAuditors(@managerID,@OrganizationID)", [managerID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/mob_supervisorname', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_mob_auditorsDetails(@managerID,@OrganizationID)", [managerID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getUserRoletypeForManager', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @OrganizationID=?;call usp_getUserRoletypeForManager(@OrganizationID)", [OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/supervisorname_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var managerID = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @managerID=?;set @OrganizationID=?;call usp_auditorsDetails_SuType(@managerID,@OrganizationID)", [managerID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/mob_cancelWorkOrder', supportCrossOriginScript);
app.post(securedpath + '/mob_cancelWorkOrder', supportCrossOriginScript, function (request, res) {

    var workOrderKey = request.body.workOrderKey;
    var reason = request.body.Reason;
    var updateDate = request.body.updateDate;
    var updateTime = request.body.updateTime;
    var empKey = request.body.empKey;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workOrderKey=?;set @reason=?;set @updateDate=?;set @updateTime=?; set @empKey=?; set @OrganizationID=?; call usp_mob_cancelWorkOrder(@workOrderKey,@reason,@updateDate,@updateTime,@empKey,@OrganizationID)', [workOrderKey, reason, updateDate, updateTime, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.options('/cancelWorkOrder_SuType', supportCrossOriginScript);
app.post(securedpath + '/cancelWorkOrder_SuType', supportCrossOriginScript, function (request, res) {

    var workOrderKey = request.body.workOrderKey;
    var reason = request.body.Reason;
    var updateDate = request.body.updateDate;
    var updateTime = request.body.updateTime;
    var empKey = request.body.empKey;
    var OrganizationID = request.body.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @workOrderKey=?;set @reason=?;set @updateDate=?;set @updateTime=?; set @empKey=?; set @OrganizationID=?; call usp_cancelWorkOrder_SuType(@workOrderKey,@reason,@updateDate,@updateTime,@empKey,@OrganizationID)', [workOrderKey, reason, updateDate, updateTime, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                } else {
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_allpriority', function (req, res) {
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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_mob_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['priorities', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allpriority_SuType', function (req, res) {
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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet_SuType(@domainkey,@empkey,@OrganizationID)", ['priorities', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allequiptype_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet_SuType(@domainkey,@empkey,@OrganizationID)", ['equipmenttypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/mob_allWorkordertype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_mob_domainValuesGet(@domainkey,@empkey,@OrganizationID)", ['workordertypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/allWorkordertype_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet_SuType(@domainkey,@empkey,@OrganizationID)", ['workordertypes', empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_scoringtype', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");


    var domainkey = "scoretypes";
    var empkey = 100;
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?;call usp_mob_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) //IMPORTANT : (err,rows) this order matters.
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/scoringtype_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");


    var domainkey = "scoretypes";
    var empkey = 100;
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @domainkey=?;set @empkey=?; set@OrganizationID=?;call usp_domainValuesGet_SuType(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) //IMPORTANT : (err,rows) this order matters.
            {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/mob_allfacility', function (req, res) {
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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_mob_domainValuesGet(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });


});

app.get(securedpath + '/allfacility_SuType', function (req, res) {
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
            connection.query("set @domainkey=?;set @empkey=?;set @OrganizationID=?;call usp_domainValuesGet_SuType(@domainkey,@empkey,@OrganizationID)", [domainkey, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
                res.end();
            });
        }
        connection.release();
    });


});


app.get(securedpath + '/mob_getAllEmployeesDetailsOnly', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@OrganizationID=?;call usp_mob_employeesOnly(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("usp_employeesOnly...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.options('/mob_authenticate', supportCrossOriginScript);

app.post('/mob_authenticate', supportCrossOriginScript, function (req, res) {


    var userid = req.body.uname;

    var password = req.body.pwd;
    var tenantId = req.body.tid;

    var profile = {};

    DBPoolConnectionTry();
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @u_name=?;set @pwdd=?; set @tenantId=?; call usp_mob_userLogin(@u_name,@pwdd,@tenantId)", [userid, password, tenantId], function (err, employees) {
                if (err) {
                    console.log("INSIDE errr() condition in /authenticate " + JSON.stringify(err));
                }
                console.log("entire response  " + JSON.stringify(employees));

                if (!employees[3][0]) {// if returns a void json like '[]'

                    console.log('Wrong user or password');

                    res.end('Wrong user or password');
                    return;
                } else {
                    console.log('Employee : ' + employees[3][0]["UserName"]);

                    user_return = employees[3][0]["UserId"];
                    organization = employees[3][0]["OrganizationName"];

                    username_return = employees[3][0]["UserName"];
                    role_return = employees[3][0]["UserRole"];

                    employeekey_return = employees[3][0]["EmployeeKey"];
                    isSupervisor = employees[3][0]["IsSupervisor"];
                    organizationID = employees[3][0]["OrganizationID"];
                    isemployeecalendar = employees[3][0]["IsEmployeeCalendar"];// Author Prakash for employee Calender

                    profile = {
                        user: user_return,
                        username: username_return,
                        role: role_return,
                        employeekey: employeekey_return,
                        //            password: pass_return,
                        IsSupervisor: isSupervisor,
                        Organization: organization,
                        OrganizationID: organizationID,
                        isemployeecalendar: isemployeecalendar// Author Prakash for employee Calender
                    };
                }
                // We are sending the profile inside the token
                var jwttoken = jwt.sign(profile, jwtsecret, { expiresIn: '4h' });

                res.cookie('refresh-token', jwttoken, 'httpOnly', 'secure')   //, 'secure','httpOnly')  '1h' //use for https
                    .json({ token: jwttoken });
                console.log("jwttoken" + jwttoken);
            });
        }
        connection.release();
    });
});


app.options('/mob_authenticate', supportCrossOriginScript);

app.post('/mob_authenticate', supportCrossOriginScript, function (req, res) {


    var userid = req.body.uname;

    var password = req.body.pwd;
    var tenantId = req.body.tid;

    var profile = {};

    DBPoolConnectionTry();
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @u_name=?;set @pwdd=?; set @tenantId=?; call  usp_mob_userLogin(@u_name,@pwdd,@tenantId)", [userid, password, tenantId], function (err, employees) {
                if (err) {
                    console.log("INSIDE errr() condition in /authenticate " + JSON.stringify(err));
                }
                console.log("entire response  " + JSON.stringify(employees));

                if (!employees[3][0]) {// if returns a void json like '[]'

                    console.log('Wrong user or password');

                    res.end('Wrong user or password');
                    return;
                } else {
                    console.log('Employee : ' + employees[3][0]["UserName"]);

                    user_return = employees[3][0]["UserId"];
                    organization = employees[3][0]["OrganizationName"];

                    username_return = employees[3][0]["UserName"];
                    role_return = employees[3][0]["UserRole"];

                    employeekey_return = employees[3][0]["EmployeeKey"];
                    isSupervisor = employees[3][0]["IsSupervisor"];
                    organizationID = employees[3][0]["OrganizationID"];
                    isemployeecalendar = employees[3][0]["IsEmployeeCalendar"];// Author Prakash for employee Calender

                    profile = {
                        user: user_return,
                        username: username_return,
                        role: role_return,
                        employeekey: employeekey_return,
                        //            password: pass_return,
                        IsSupervisor: isSupervisor,
                        Organization: organization,
                        OrganizationID: organizationID,
                        isemployeecalendar: isemployeecalendar// Author Prakash for employee Calender
                    };
                }
                // We are sending the profile inside the token
                var jwttoken = jwt.sign(profile, jwtsecret, { expiresIn: '4h' });

                res.cookie('refresh-token', jwttoken, 'httpOnly', 'secure')   //, 'secure','httpOnly')  '1h' //use for https
                    .json({ token: jwttoken });
                console.log("jwttoken" + jwttoken);
            });
        }
        connection.release();
    });
});


app.options('/authenticate_SuType', supportCrossOriginScript);

app.post('/authenticate_SuType', supportCrossOriginScript, function (req, res) {


    var userid = req.body.uname;

    var password = req.body.pwd;
    var tenantId = req.body.tid;

    var profile = {};

    DBPoolConnectionTry();
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @u_name=?;set @pwdd=?; set @tenantId=?; call usp_userLogin_SuType(@u_name,@pwdd,@tenantId)", [userid, password, tenantId], function (err, employees) {
                if (err) {
                    console.log("INSIDE errr() condition in /authenticate " + JSON.stringify(err));
                }
                console.log("entire response  " + JSON.stringify(employees));

                if (!employees[3][0]) {// if returns a void json like '[]'

                    console.log('Wrong user or password');

                    res.end('Wrong user or password');
                    return;
                } else {
                    console.log('Employee : ' + employees[3][0]["UserName"]);

                    user_return = employees[3][0]["UserId"];
                    organization = employees[3][0]["OrganizationName"];

                    username_return = employees[3][0]["UserName"];
                    role_return = employees[3][0]["UserRole"];

                    employeekey_return = employees[3][0]["EmployeeKey"];
                    isSupervisor = employees[3][0]["IsSupervisor"];
                    organizationID = employees[3][0]["OrganizationID"];
                    isemployeecalendar = employees[3][0]["IsEmployeeCalendar"];// Author Prakash for employee Calender

                    profile = {
                        user: user_return,
                        username: username_return,
                        role: role_return,
                        employeekey: employeekey_return,
                        //            password: pass_return,
                        IsSupervisor: isSupervisor,
                        Organization: organization,
                        OrganizationID: organizationID,
                        isemployeecalendar: isemployeecalendar// Author Prakash for employee Calender
                    };
                }
                // We are sending the profile inside the token
                var jwttoken = jwt.sign(profile, jwtsecret, { expiresIn: '4h' });

                res.cookie('refresh-token', jwttoken, 'httpOnly', 'secure')   //, 'secure','httpOnly')  '1h' //use for https
                    .json({ token: jwttoken });
                console.log("jwttoken" + jwttoken);
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/mob_scanforWorkorder_empAng6', function (req, res) {
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
            connection.query("set @barcode =?;set @empkey =?;set @date =?; set@OrganizationID=?;call usp_mob_workorderGetByScannedBarcode_Ang6(@barcode,@empkey,@date,@OrganizationID)", [barcode, empkey, ondate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/mob_viewDashboardWorkorder_Ang6', function (req, res) {
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
            connection.query('set @employeekey=?; set @viewdate=?; set@OrganizationID=?; call usp_mob_workordersGetByEmpKey_mobAng6(@employeekey,@viewdate,@OrganizationID)', [employeekey, viewdate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/mob_allemployees', function (req, res) {//empkey

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
            connection.query('set @key=?;set @OrganizationID=?;call usp_mob_properEmployeeList(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/allemployees_SuType', function (req, res) {//empkey

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
            connection.query('set @key=?;set @OrganizationID=?;call usp_properEmployeeList_SuType(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getManagerForEmployee_SuType', function (req, res) {
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
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_getManagerForEmployee_SuType(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getManagerForEmployeeForSuperAdmin_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getManagerForEmployeeForSuperAdmin_SuType(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("checkUsername...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeeNames_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @employeekey=?; call usp_getAllEmployeeNames_SuType(@OrganizationID,@employeekey)', [OrganizationID, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});
// ^^^^^^^ supervisor api changes By Varun ends ^^^^^^^^^^^.

//Author: Prakash Code Starts for Employee Calendar Starts Here
//For Employee Scheduling Exceptions
app.get(securedpath + '/getallschedulingexception', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @OrganizationID=?;call usp_getAllschedulerexception(@OrganizationID)", [OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getallexceptionweekend', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getAllExceptionWeekend()", [], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getallmasterhour', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getAllmasterhour()", [], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getallmasterminute', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getAllmasterminute()", [], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getallemployeegrouping', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @OrganizationID=?;call usp_getallemployeegrouping(@OrganizationID)", [OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getweeklyschedulebyEmployeeGroupid', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empgroupid = url.parse(req.url, true).query['SearchKey'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empgroupid=?; call usp_getWeeklySchedulebyEmployeeGroupid(@empgroupid)", [empgroupid], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.options('/employeecreateeditweeklyschedule', supportCrossOriginScript);
app.post(securedpath + '/employeecreateeditweeklyschedule', supportCrossOriginScript, function (req, response) {

    var employeekey = req.body.EmployeeKey;
    var metaupdatedby = req.body.metaupdatekey;
    var OrganizationID = req.body.OrganizationID;

    var start_sun_hour = req.body.start_sun_hour;
    var start_sun_min = req.body.start_sun_min;
    var start_sun_format = req.body.start_sun_format;
    var start_mon_hour = req.body.start_mon_hour;
    var start_mon_min = req.body.start_mon_min;
    var start_mon_format = req.body.start_mon_format;
    var start_tue_hour = req.body.start_tue_hour;
    var start_tue_min = req.body.start_tue_min;
    var start_tue_format = req.body.start_tue_format;
    var start_wed_hour = req.body.start_wed_hour;
    var start_wed_min = req.body.start_wed_min;
    var start_wed_format = req.body.start_wed_format;
    var start_thu_hour = req.body.start_thu_hour;
    var start_thu_min = req.body.start_thu_min;
    var start_thu_format = req.body.start_thu_format;
    var start_fri_hour = req.body.start_fri_hour;
    var start_fri_min = req.body.start_fri_min;
    var start_fri_format = req.body.start_fri_format;
    var start_sat_hour = req.body.start_sat_hour;
    var start_sat_min = req.body.start_sat_min;
    var start_sat_format = req.body.start_sat_format;
    var end_sun_hour = req.body.end_sun_hour;
    var end_sun_min = req.body.end_sun_min;
    var end_sun_format = req.body.end_sun_format;
    var end_mon_hour = req.body.end_mon_hour;
    var end_mon_min = req.body.end_mon_min;
    var end_mon_format = req.body.end_mon_format;
    var end_tue_hour = req.body.end_tue_hour;
    var end_tue_min = req.body.end_tue_min;
    var end_tue_format = req.body.end_tue_format;
    var end_wed_hour = req.body.end_wed_hour;
    var end_wed_min = req.body.end_wed_min;
    var end_wed_format = req.body.end_wed_format;
    var end_thu_hour = req.body.end_thu_hour;
    var end_thu_min = req.body.end_thu_min;
    var end_thu_format = req.body.end_thu_format;
    var end_fri_hour = req.body.end_fri_hour;
    var end_fri_min = req.body.end_fri_min;
    var end_fri_format = req.body.end_fri_format;
    var end_sat_hour = req.body.end_sat_hour;
    var end_sat_min = req.body.end_sat_min;
    var end_sat_format = req.body.end_sat_format;

    var idscheduler_exception = req.body.idscheduler_exception;
    var idemployeegrouping = req.body.idemployeegrouping;
    var exceptiostartdate = req.body.exceptionstartdate;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @metaupdatedby=?; set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;set @idemployeegrouping=?;set @exceptiostartdate=?;set @organizationID=?; call usp_employeecreateeditweeklyschedule(@employeekey,@metaupdatedby,@start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception,@idemployeegrouping,@exceptiostartdate,@OrganizationID)', [employeekey, metaupdatedby, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idemployeegrouping, exceptiostartdate, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    response.end(JSON.stringify(rows[48]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/getPtoRequestdetailsforManager', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.employeekey;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;
    var ptostatus = newWOObj.ptoStatus;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @fromdate=?;set @todate=?;set @ptostatus=?;call usp_getPTORequestdetailsforManager(@OrganizationID,@employeekey,@fromdate,@todate,@ptostatus)', [OrganizationID, employeekey, fromdate, todate, ptostatus], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/getviewWorkorderservicerequest', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @fromdate=?;set @todate=?;call usp_getviewWorkorderservicerequest(@OrganizationID,@fromdate,@todate)', [OrganizationID, fromdate, todate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/generateWorkorderbyservicerequest', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.employeekey;
    var date1 = newWOObj.date1;
    var time1 = newWOObj.time1;
    var servicerequestid = newWOObj.servicerequestid;
    var CreateEmpKey = newWOObj.CreateEmpKey;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @date1=?;set @time1=?;set @servicerequestid=?; set@CreateEmpKey=?; call usp_generateWorkorderbyservicerequest(@OrganizationID,@employeekey,@date1,@time1,@servicerequestid,@CreateEmpKey)', [OrganizationID, employeekey, date1, time1, servicerequestid, CreateEmpKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
//Author: Prakash Code Starts for Employee Calendar Ends Here

app.get(securedpath + '/getRoomDetailsNamesList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomKey = url.parse(req.url, true).query['roomKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @roomKey=?; set@OrganizationID=?; call usp_getRoomDetailsNamesList(@roomKey,@OrganizationID)", [roomKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
/*************END MIGRATE CODE**********************************************************/

/*
Supervisor as usertype is added. Creating new api for backward compatibility
Coding by Rodney starts....
*/


app.get(securedpath + '/employeeForManager_SuType', function (req, res) {//empkey

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
            connection.query('set @key=?;set @OrganizationID= ?; call usp_employeeForManager_SuType(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/employeesViewOnlyForScheduler_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empkey=?;set @OrganizationID=?; call usp_employeesForScheduler_EmployeeView_SuType(@empkey,@OrganizationID)', [empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.options('/update_employee_info_SuType', supportCrossOriginScript);
app.post(securedpath + '/update_employee_info_SuType', supportCrossOriginScript, function (req, response) {

    var employeekey = req.body.EmployeeKey;
    var metaupdatedby = req.body.updatedBY;

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
    // var isSupervisor = req.body.IsSupervisor;
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

    // var start_sun_hour = req.body.start_sun_hour;
    // var start_sun_min = req.body.start_sun_min;
    // var start_sun_format = req.body.start_sun_format;
    // var start_mon_hour = req.body.start_mon_hour;
    // var start_mon_min = req.body.start_mon_min;
    // var start_mon_format = req.body.start_mon_format;
    // var start_tue_hour = req.body.start_tue_hour;
    // var start_tue_min = req.body.start_tue_min;
    // var start_tue_format = req.body.start_tue_format;
    // var start_wed_hour = req.body.start_wed_hour;
    // var start_wed_min = req.body.start_wed_min;
    // var start_wed_format = req.body.start_wed_format;
    // var start_thu_hour = req.body.start_thu_hour;
    // var start_thu_min = req.body.start_thu_min;
    // var start_thu_format = req.body.start_thu_format;
    // var start_fri_hour = req.body.start_fri_hour;
    // var start_fri_min = req.body.start_fri_min;
    // var start_fri_format = req.body.start_fri_format;
    // var start_sat_hour = req.body.start_sat_hour;
    // var start_sat_min = req.body.start_sat_min;
    // var start_sat_format = req.body.start_sat_format;
    // var end_sun_hour = req.body.end_sun_hour;
    // var end_sun_min = req.body.end_sun_min;
    // var end_sun_format = req.body.end_sun_format;
    // var end_mon_hour = req.body.end_mon_hour;
    // var end_mon_min = req.body.end_mon_min;
    // var end_mon_format = req.body.end_mon_format;
    // var end_tue_hour = req.body.end_tue_hour;
    // var end_tue_min = req.body.end_tue_min;
    // var end_tue_format = req.body.end_tue_format;
    // var end_wed_hour = req.body.end_wed_hour;
    // var end_wed_min = req.body.end_wed_min;
    // var end_wed_format = req.body.end_wed_format;
    // var end_thu_hour = req.body.end_thu_hour;
    // var end_thu_min = req.body.end_thu_min;
    // var end_thu_format = req.body.end_thu_format;
    // var end_fri_hour = req.body.end_fri_hour;
    // var end_fri_min = req.body.end_fri_min;
    // var end_fri_format = req.body.end_fri_format;
    // var end_sat_hour = req.body.end_sat_hour;
    // var end_sat_min = req.body.end_sat_min;
    // var end_sat_format = req.body.end_sat_format;

    // var idscheduler_exception = req.body.idscheduler_exception;

    // var idmaster_exception_weekend = req.body.idmaster_exception_weekend;

    // var idemployeegrouping = req.body.idemployeegrouping;

    // console.log("-----------------isSupervisor----------------" + isSupervisor + "  " + firstname + "  " + employeenumber + "birthdate" + birthdate + "hiredate" + hiredate);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @SupervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?; set @UserRoleTypeKey=?;set @EmployeeStatusKey1=?;set @Remark=?;call usp_employeesUpd_SuType(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@SupervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize,@UserRoleTypeKey,@EmployeeStatusKey1,@Remark)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, SupervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize, UserRoleTypeKey, EmployeeStatusKey1, Remark], function (err, rows) {
                //  set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;set @idmaster_exception_weekend=?;set @idemployeegrouping=?;

                // @start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception, @idmaster_exception_weekend, @idemployeegrouping

                // start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    response.end(JSON.stringify(rows[33]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getAllEmployeesofGroupForSchedulerReport_SuType', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var groupID = url.parse(req.url, true).query['groupID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @groupID=?;set @OrganizationID=?;call usp_getAllEmployeesofGroupForSchedulerReport_SuType(@groupID,@OrganizationID)', [groupID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/generateSchedulerReport_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var fromdate = req.body.fromDate;
    var todate = req.body.toDate;
    var groupID = req.body.groupId;
    var employeeKeys = req.body.empKey;
    var OrganizationID = req.body.organizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromdate=?;set @todate=?;set @groupID=?;set @employeeKeys=?;set @OrganizationID=?;call usp_getEmpDetailsForSchedulerReport_SuType(@fromdate,@todate,@groupID,@employeeKeys,@OrganizationID)', [fromdate, todate, groupID, employeeKeys, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // console.log(JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[5]));

                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/employeesForScheduler_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @empkey=?;set @OrganizationID=?; call usp_getEmployeesForScheduler_SuType(@groupID,@empkey,@OrganizationID)', [groupID, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("json " + JSON.stringify(rows[3]));
                    // res.end(JSON.stringify(rows[3]));
                    var data = rows[3];
                    var resources = [];
                    var arr = 0;
                    var tempArr = [];
                    var selectedGroup = data[0].Idemployeegrouping;// 1st group Id                   
                    tempArr[arr] = [];// creating 2D array
                    for (var i = 0; i < data.length; i++) {
                        if (selectedGroup == data[i].Idemployeegrouping) {// check for group id  
                            data[i].IsShift = 0;
                            tempArr[arr].push(data[i]);
                        }
                        else {
                            arr = arr + 1;
                            tempArr[arr] = [];// creating 2D array
                            var selectedGroup = data[i].Idemployeegrouping
                            data[i].IsShift = 0;
                            tempArr[arr].push(data[i]);
                        }
                    }

                    if (OrganizationID == 103) {
                        for (var j = 0; j <= arr; j++) {// inserting array value to scheduler tree list
                            resources.push({ name: tempArr[j][0].Description, id: tempArr[j][0].Idemployeegrouping, "expanded": false, children: tempArr[j], IsShift: 1, backColor: tempArr[j][0].backColor });

                        }
                    } else {
                        for (var j = 0; j <= arr; j++) {// inserting array value to scheduler tree list
                            resources.push({ name: tempArr[j][0].Description, id: tempArr[j][0].Idemployeegrouping, "expanded": false, children: tempArr[j], IsShift: 1, backColor: tempArr[j][0].backColor });

                        }
                    }
                    res.send(resources);
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/getPtoRequestdetailsforManager_SuType', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;

    var OrganizationID = newWOObj.OrganizationID;
    var employeekey = newWOObj.employeekey;
    var fromdate = newWOObj.fromdate;
    var todate = newWOObj.todate;
    var ptostatus = newWOObj.ptoStatus;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;set @fromdate=?;set @todate=?;set @ptostatus=?;call usp_getPTORequestdetailsforManager_SuType(@OrganizationID,@employeekey,@fromdate,@todate,@ptostatus)', [OrganizationID, employeekey, fromdate, todate, ptostatus], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRequestdetailsforManager_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;set @employeekey=?;call usp_getRequestdetailsforManager_SuType(@OrganizationID,@employeekey)', [OrganizationID, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/viewworkorder_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['employeekey'];
    var workDT = url.parse(req.url, true).query['viewdate'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------viewworkorder---------" + empkey + " " + workDT + " " + pageno + " " + itemsPerPage + " ");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @employeekey =?;set @workdate =?;set @pageno=?; set @itemsPerPage=?;set @OrganizationID=?;call usp_workordersGetByEmpKey_SuType(@employeekey,@workdate,@pageno,@itemsPerPage,@OrganizationID)", [empkey, workDT, pageno, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("Printing viewworkorder");
                    console.log("ROWS" + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/searchAllEmployeeWorkingHourList_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var searchEmployee = url.parse(req.url, true).query['searchEmployee'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------searchAllEmployeeWorkingHourList---------" + empkey + " " + " " + pageno + " " + itemsPerPage + " ");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchEmployee =?;set @pageno=?; set @itemsPerPage=?;set @employeekey =?;set @OrganizationID =?;call usp_searchAllEmployeeWorkingHourList_SuType(@searchEmployee,@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [searchEmployee, pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/searchEmpByJobTitle_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobtitleString = url.parse(req.url, true).query['jobtitleString'];

    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("jobtitleString   " + jobtitleString);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobtitleString=?; set @empkey=?;set @OrganizationID=?; call usp_searchEmpByJobTitle_SuType(@jobtitleString,@empkey,@OrganizationID)', [jobtitleString, empkey, OrganizationID], function (err, rows) {
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



app.get(securedpath + '/searchEmployeeList_SuType', function (req, res) {
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
            connection.query('set @employeekey=?; set @searchEmployee=?;set @OrganizationID=?;  call usp_searchEmployeeListLogin_SuType(@employeekey,@searchEmployee,@OrganizationID)', [employeekey, searchEmployee, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/searchEmployeeOnTable_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var searchEmployee = url.parse(req.url, true).query['searchEmployee'];
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsPerPage = url.parse(req.url, true).query['itemsPerPage'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("----------searchEmployeeOnTable---------" + empkey + " " + " " + pageno + " " + itemsPerPage + " ");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @searchEmployee =?;set @pageno=?; set @itemsPerPage=?;set @employeekey =?;set @OrganizationID =?;call usp_searchEmployeeOnTable_SuType(@searchEmployee,@pageno,@itemsPerPage,@employeekey,@OrganizationID)", [searchEmployee, pageno, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/setUsernamePassword_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var username = req.body.username;
    var password = req.body.password;
    var employeekey = req.body.employeekey;
    var updatedBy = req.body.updatedBy;
    var userRoleTypeKey = req.body.userRoleTypeKey;
    var OrganizationID = req.body.OrganizationID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @username=?; set @password=?; set @employeekey=?; set @updatedBy=?; set @userRoleTypeKey=?; set @OrganizationID=?;call usp_setUsernamePassword_SuType(@username,@password,@employeekey,@updatedBy,@userRoleTypeKey,@OrganizationID)', [username, password, employeekey, updatedBy, userRoleTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("setUsernamePassword...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getLoginDetailsForAllUsers_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var pageno = url.parse(req.url, true).query['pageno'];
    var itemsperpage = url.parse(req.url, true).query['itemsperpage'];

    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW " + pageno + " " + itemsperpage + " " + employeekey);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @pageno=?; set @itemsperpage=?; set @empkey=?; set @OrganizationID=?;call usp_getLoginDetailsForAllUsers_SuType(@pageno,@itemsperpage,@empkey,@OrganizationID)', [pageno, itemsperpage, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("usp_getLoginDetailsForAllUsers...from server.." + JSON.stringify(rows[4]));
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/AllEmployeeWorkingHourList_SuType', function (req, res) {
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_AllEmployeeWorkingHourList_SuType(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/empGetBySupervisor_SuType', function (req, res) {
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
            connection.query('set @SupervisorKey=?; set @employeekey=?;set @OrganizationID=?;  call usp_empGetBySupervisor_SuType(@SupervisorKey,@employeekey,@OrganizationID)', [SupervisorKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/empGetBySupervisorjobTitle_SuType', function (req, res) {
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
            connection.query('set @SupervisorKey=?; set @employeekey=?; set @JobTitleKey=?;set @OrganizationID=?;  call usp_empGetBySupervisorjobTitle_SuType(@SupervisorKey,@employeekey,@JobTitleKey,@OrganizationID)', [SupervisorKey, employeekey, JobTitleKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/empKey_byJobtitle_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var jobTitle = url.parse(req.url, true).query['jobTitle'];
    var empkey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @jobTitle=?;set @empkey=?;set @OrganizationID=?;call usp_employeeKeyByJobtitle_SuType(@jobTitle,@empkey,@OrganizationID)', [jobTitle, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/empDetails_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['SearchKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_employeesByIdGet_SuType(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/empSelectWithFilterInMeetCreate_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var emKey = req.body.emKey;
    var OrgID = req.body.OrgID;
    var JobT = req.body.JobT;
    var Mang = req.body.Mang;
    var DeptKey = req.body.DeptKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @emKey=?;set @OrgID=?;set @JobT=?;set @Mang=?;set @DeptKey=?; call usp_empSelectWithFilterInMeetCreate_SuType(@emKey,@OrgID,@JobT,@Mang,@DeptKey)', [emKey, OrgID, JobT, Mang, DeptKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[5]));


                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployees_SuType', function (req, res) {
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
            connection.query('set @pagenumber=?; set @itemsPerPage=?; set @empkey=?; set @OrganizationID=?;call usp_GetAllEmployees_SuType(@pagenumber,@itemsPerPage,@empkey,@OrganizationID)', [pagenumber, itemsPerPage, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllUserRoleType_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('call usp_getAllUserRoleType_SuType()', function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[0]));
                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllUserRoleType_Admin_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getAllUserRoleTypebyAdmin_SuType(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllUserRoleType_SuperAdmin_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getAllUserRoleTypebySuperAdmin_SuType(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getAllUserRoleType...from server.." + JSON.stringify(rows[1]));
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/department_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @empkey=?;set @OrganizationID=?; call usp_getDepartment_SuType(@empkey,@OrganizationID)", [empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));

                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/employeeByAllFilter_SuType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var JobTitle = req.body.JobTitleKey;
    var ManagerKey = req.body.ManagerKey;
    var employeekey = req.body.employeekey;
    var pagenumber = req.body.pagenumber;
    var itemsPerPage = req.body.itemsPerPage;
    var OrganizationID = req.body.OrganizationID;


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @JobTitle=?; set @ManagerKey=?; set @employeekey=?; set @pagenumber=?; set  @itemsPerPage=?;set @OrganizationID=?;  call usp_getEmployeeByAllFilter_SuType(@JobTitle,@ManagerKey,@employeekey,@pagenumber,@itemsPerPage,@OrganizationID)', [JobTitle, ManagerKey, employeekey, pagenumber, itemsPerPage, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("employeeByAllFilter...from server.." + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });


});
//add employee
app.options(securedpath + '/addemp_SuType', supportCrossOriginScript);
app.post(securedpath + '/addemp_SuType', supportCrossOriginScript, function (req, res) {

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
    var IsSupervisor = req.body.IsSupervisor;
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


    // var start_sun_hour = req.body.start_sun_hour;
    // var start_sun_min = req.body.start_sun_min;
    // var start_sun_format = req.body.start_sun_format;
    // var start_mon_hour = req.body.start_mon_hour;
    // var start_mon_min = req.body.start_mon_min;
    // var start_mon_format = req.body.start_mon_format;
    // var start_tue_hour = req.body.start_tue_hour;
    // var start_tue_min = req.body.start_tue_min;
    // var start_tue_format = req.body.start_tue_format;
    // var start_wed_hour = req.body.start_wed_hour;
    // var start_wed_min = req.body.start_wed_min;
    // var start_wed_format = req.body.start_wed_format;
    // var start_thu_hour = req.body.start_thu_hour;
    // var start_thu_min = req.body.start_thu_min;
    // var start_thu_format = req.body.start_thu_format;
    // var start_fri_hour = req.body.start_fri_hour;
    // var start_fri_min = req.body.start_fri_min;
    // var start_fri_format = req.body.start_fri_format;
    // var start_sat_hour = req.body.start_sat_hour;
    // var start_sat_min = req.body.start_sat_min;
    // var start_sat_format = req.body.start_sat_format;
    // var end_sun_hour = req.body.end_sun_hour;
    // var end_sun_min = req.body.end_sun_min;
    // var end_sun_format = req.body.end_sun_format;
    // var end_mon_hour = req.body.end_mon_hour;
    // var end_mon_min = req.body.end_mon_min;
    // var end_mon_format = req.body.end_mon_format;
    // var end_tue_hour = req.body.end_tue_hour;
    // var end_tue_min = req.body.end_tue_min;
    // var end_tue_format = req.body.end_tue_format;
    // var end_wed_hour = req.body.end_wed_hour;
    // var end_wed_min = req.body.end_wed_min;
    // var end_wed_format = req.body.end_wed_format;
    // var end_thu_hour = req.body.end_thu_hour;
    // var end_thu_min = req.body.end_thu_min;
    // var end_thu_format = req.body.end_thu_format;
    // var end_fri_hour = req.body.end_fri_hour;
    // var end_fri_min = req.body.end_fri_min;
    // var end_fri_format = req.body.end_fri_format;
    // var end_sat_hour = req.body.end_sat_hour;
    // var end_sat_min = req.body.end_sat_min;
    // var end_sat_format = req.body.end_sat_format;

    // var idscheduler_exception = req.body.idscheduler_exception;

    // var idmaster_exception_weekend = req.body.idmaster_exception_weekend;
    // var idemployeegrouping = req.body.idemployeegrouping;

    // var exceptionsdate = req.body.exceptionsdate;


    // console.log("exceptionid: " + idscheduler_exception);
    // console.log("weekendid: " + idmaster_exception_weekend);

    // console.log("hour: "+start_sun_hour);
    // console.log("min: "+start_sun_min);
    // console.log("format: "+start_sun_format);
    // console.log("hour: "+start_mon_hour);
    // console.log("min: "+start_mon_min);
    // console.log("format: "+start_mon_format);
    // console.log(start_tue_hour);
    // console.log(start_tue_min);
    // console.log(start_tue_format);
    // console.log(start_wed_hour);
    // console.log(start_wed_min);
    // console.log(start_wed_format);
    // console.log(start_thu_hour);
    // console.log(start_thu_min);
    // console.log(start_thu_format);
    // console.log(start_fri_hour);
    // console.log(start_fri_min);
    // console.log(start_fri_format);
    // console.log(start_sat_hour);
    // console.log(start_sat_min);
    // console.log(start_sat_format);
    // console.log(end_sun_hour);
    // console.log(end_sun_min);
    // console.log(end_sun_format);
    // console.log(end_mon_hour);
    // console.log(end_mon_min);
    // console.log(end_mon_format);
    // console.log(end_tue_hour);
    // console.log(end_tue_min);
    // console.log(end_tue_format);
    // console.log(end_wed_hour);
    // console.log(end_wed_min);
    // console.log(end_wed_format);
    // console.log(end_thu_hour);
    // console.log(end_thu_min);
    // console.log(end_thu_format);
    // console.log(end_fri_hour);
    // console.log(end_fri_min);
    // console.log(end_fri_format);
    // console.log(end_sat_hour);
    // console.log(end_sat_min);
    // console.log(end_sat_format);



    // console.log("---------------------" + metaupdatedby + " " + employeenumber + " " + OrganizationID + " " + gender + " " + shirtSize + " " + pantSize + " " + supervisorKey)
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?;set @employeenumber=?;set @firstname=?;set @middlename=?;set @lastname=?;set @jobtitlekey=?;set @managerkey=?;set @addressline1=?;set @addressline2=?;set @city=?;set @state=?;set @zipcode=?;set @country=?;set @primaryphone=?;set @alternatephone=?;set @birthdate=?;set @hiredate=?;set @lastevaluationdate=?;set @nextevaluationdate=?;set @supervisorKey=?;set @isrelieved=?;set @ishkii=?;set @isactive=?;set @departmentkey=?;set @metaupdatedby=?; set @email=?; set @OrganizationID=?;set @gender=?;set @shirtSize=?;set @pantSize=?;set @IsSupervisor=?;call usp_employeesAdd_SuType(@employeekey,@employeenumber,@firstname,@middlename,@lastname,@jobtitlekey,@managerkey,@addressline1,@addressline2,@city,@state,@zipcode,@country,@primaryphone,@alternatephone,@birthdate,@hiredate,@lastevaluationdate,@nextevaluationdate,@supervisorKey,@isrelieved,@ishkii,@isactive,@departmentkey,@metaupdatedby,@email,@OrganizationID,@gender,@shirtSize,@pantSize,@IsSupervisor)', [employeekey, employeenumber, firstname, middlename, lastname, jobtitlekey, managerkey, addressline1, addressline2, city, state, zipcode, country, primaryphone, alternatephone, birthdate, hiredate, lastevaluationdate, nextevaluationdate, supervisorKey, isrelieved, ishkii, isactive, departmentkey, metaupdatedby, email, OrganizationID, gender, shirtSize, pantSize, IsSupervisor], function (err, rows) {
                // set @start_sun_hour=?;set @start_sun_min=?;set @start_sun_format=?;set @start_mon_hour=?;set @start_mon_min=?;set @start_mon_format=?;set @start_tue_hour=?;set @start_tue_min=?;set @start_tue_format=?;set @start_wed_hour=?;set @start_wed_min=?;set @start_wed_format=?;set @start_thu_hour=?;set @start_thu_min=?;set @start_thu_format=?;set @start_fri_hour=?;set @start_fri_min=?;set @start_fri_format=?;set @start_sat_hour=?;set @start_sat_min=?;set @start_sat_format=?;set @end_sun_hour=?;set @end_sun_min=?;set @end_sun_format=?;set @end_mon_hour=?;set @end_mon_min=?;set @end_mon_format=?;set @end_tue_hour=?;set @end_tue_min=?;set @end_tue_format=?;set @end_wed_hour=?;set @end_wed_min=?;set @end_wed_format=?;set @end_thu_hour=?;set @end_thu_min=?;set @end_thu_format=?;set @end_fri_hour=?;set @end_fri_min=?;set @end_fri_format=?;set @end_sat_hour=?;set @end_sat_min=?;set @end_sat_format=?; set @idscheduler_exception=?;set @idmaster_exception_weekend=?;set @idemployeegrouping=?; set @exceptionsdate=?; 
                // @start_sun_hour,@start_sun_min,@start_sun_format,@start_mon_hour,@start_mon_min,@start_mon_format,@start_tue_hour,@start_tue_min,@start_tue_format,@start_wed_hour,@start_wed_min,@start_wed_format,@start_thu_hour,@start_thu_min,@start_thu_format,@start_fri_hour,@start_fri_min,@start_fri_format,@start_sat_hour,@start_sat_min,@start_sat_format,@end_sun_hour,@end_sun_min,@end_sun_format,@end_mon_hour,@end_mon_min,@end_mon_format,@end_tue_hour,@end_tue_min,@end_tue_format,@end_wed_hour,@end_wed_min,@end_wed_format,@end_thu_hour,@end_thu_min,@end_thu_format,@end_fri_hour,@end_fri_min,@end_fri_format,@end_sat_hour,@end_sat_min,@end_sat_format,@idscheduler_exception, @idmaster_exception_weekend,@idemployeegrouping,@exceptionsdate                
                //  start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping, exceptionsdate        
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[31][0]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllEmployeesForSchedulerReport_SuType', function (req, res) {//empkey

    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?;call usp_getAllEmployeesForSchedulerReport_SuType(@OrganizationID)', [OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[1]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForNewEventType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var eventType = url.parse(req.url, true).query['eventType'];
    var eventName = url.parse(req.url, true).query['eventName'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @eventType=?;set @eventName=?; set @OrganizationID=?;call usp_checkForNewEventType(@eventType,@eventName,@OrganizationID)', [eventType, eventName, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForDuplicateEventType', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ActionType = url.parse(req.url, true).query['ActionType'];
    var Action = url.parse(req.url, true).query['Action'];
    var ActionKey = url.parse(req.url, true).query['ActionKey'];
    var ActionTypeKey = url.parse(req.url, true).query['ActionTypeKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ActionType=?;set @Action=?; set @ActionKey=?;set @ActionTypeKey=?; set @OrganizationID=?; call usp_checkForDuplicateEventType(@ActionType,@Action,@ActionKey,@ActionTypeKey,@OrganizationID)', [ActionType, Action, ActionKey, ActionTypeKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getInspectionAuditDetailsForReport', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var from = url.parse(req.url, true).query['from'];
    var to = url.parse(req.url, true).query['to'];
    var template = url.parse(req.url, true).query['template'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @from=?;set @to=?;set @template=?;set @employeeKey=?;set @orgID=?; call usp_getInspectionAuditDetailsForReport(@from,@to,@template,@employeeKey,@orgID)', [from, to, template, employeeKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
/*
Supervisor as usertype is added. Creating new api for backward compatibility
Coding by Rodney ends....
*/
// Coding ... @Rodney starts......
app.get(securedpath + '/checkMasterShiftsForDuplicate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shiftName = url.parse(req.url, true).query['shiftName'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftName=?;set @OrganizationID=?; call usp_checkDuplicateForMasterShifts(@shiftName,@OrganizationID)', [shiftName, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/createMasterShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var shiftName = req.body.shiftName;
    var empKey = req.body.empKey;
    var orgID = req.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @shiftName=?; set  @empKey=?;set @orgID=?; call usp_createMasterShift(@shiftName,@empKey,@orgID)', [shiftName, empKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/removeMasterShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var shiftKey = req.body.shiftKey;
    var empKey = req.body.empKey;
    var orgID = req.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @shiftKey=?; set  @empKey=?;set @orgID=?; call usp_removeMasterShift(@shiftKey,@empKey,@orgID)', [shiftKey, empKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getMasterShiftDetailsForEdit', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shiftKey = url.parse(req.url, true).query['shiftKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftKey=?;set @OrganizationID=?; call usp_getMasterShiftDetailsForEdit(@shiftKey,@OrganizationID)', [shiftKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/updateMasterShift', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var shiftKey = req.body.shiftKey;
    var shiftName = req.body.shiftName;
    var empKey = req.body.empKey;
    var orgID = req.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @shiftKey=?;set @shiftName=?; set  @empKey=?;set @orgID=?; call usp_updateMasterShiftDetails(@shiftKey,@shiftName,@empKey,@orgID)', [shiftKey, shiftName, empKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/checkForDuplicateMasterShiftName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var shiftkey = url.parse(req.url, true).query['shiftkey'];
    var shiftname = url.parse(req.url, true).query['shiftname'];
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @shiftkey=?;set @shiftname=?;set @orgID=?; call usp_checkForDuplicateMasterShiftName(@shiftkey,@shiftname,@orgID)', [shiftkey, shiftname, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/createManualSchedulerCronjob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var curDate = req.body.curDate;
    var empKey = req.body.empKey;
    var orgID = req.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @curDate=?; set  @empKey=?;set @orgID=?; call usp_assignmentcronjob_manual(@curDate,@empKey,@orgID)', [curDate, empKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/deleteManualSchedulerCronjob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var curDate = req.body.curDate;
    var empKey = req.body.empKey;
    var orgID = req.body.orgID;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @curDate=?; set @empKey=?;set @orgID=?; call usp_assignmentcronjob_manualdelete(@curDate,@empKey,@orgID)', [curDate, empKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getItemCountsForDeleting', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var orgID = url.parse(req.url, true).query['orgID'];
    var curDate = url.parse(req.url, true).query['curDate'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?;set @curDate=?; call usp_getItemCountsForDeleting(@orgID,@curDate)', [orgID, curDate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getAllIntervalTypes', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var orgID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?; call usp_getAllIntervalTypes(@orgID)', [orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getIntervalTypeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var intervalid = url.parse(req.url, true).query['intervalid'];
    var orgID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @intervalid=?;set @orgID=?; call usp_getIntervalTypeDetails(@intervalid,@orgID)', [intervalid, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.post(securedpath + '/updateIntervalTypeDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    req.body.curDate
    var intervalid = req.body.intervalid;
    var color = req.body.color;
    var orgID = req.body.OrganizationID;

    console.log("hi......" + intervalid + " ... " + color + " ... " + orgID);
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @intervalid=?; set @color=?; set @orgID=?; call usp_updateIntervalTypeDetails(@intervalid, @color, @orgID)', [intervalid, color, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/allemployeesForAuditReport_SuType', function (req, res) {//empkey

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
            connection.query('set @key=?;set @OrganizationID=?;call usp_properEmployeeListForAuditReport_SuType(@key,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL in allemployees" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
                res.end();
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/workorderByallFilters_pagination', supportCrossOriginScript, function (req, res) {

    var newWOObj = {};
    newWOObj = req.body;
    var manager = newWOObj.manager;
    var workorderStatusKey = newWOObj.workorderStatusKey;
    var workorderDate = newWOObj.workorderDate;
    var workorderDate2 = newWOObj.workorderDate2;
    var facilitykey = newWOObj.facilitykey;
    var roomTypeKey = newWOObj.roomTypeKey;
    var floorKey = newWOObj.floorKey;
    var roomKey = newWOObj.roomKey;
    var zoneKey = newWOObj.zoneKey;
    var employeekey = newWOObj.employeeKey;
    var workorderTypeKey = newWOObj.workorderTypeKey;
    var BatchScheduleNameKey = newWOObj.BatchScheduleNameKey;
    var OrganizationID = newWOObj.OrganizationID;
    var SearchWO = newWOObj.SearchWO;
    var itemsPerPage = newWOObj.itemsPerPage;
    var pageNo = newWOObj.pageNo;
    var keepactive = newWOObj.keepactivef;

    // console.log("Keep Active Flag : "+keepactive);

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @manager =?;set @workorderStatusKey =?;set @workorderDate =?;set @workorderDate2 =?;set @facilitykey=?;set @roomTypeKey=?;set @floorKey=?;set @roomKey=?;set @zoneKey=?;set @employeekey=?;set @workorderTypeKey=?;set @BatchScheduleNameKey=?; set @OrganizationID=?;set @pageNo=?; set @itemsPerPage=?;set @SearchWO=?; set @keepactive=?;call usp_workorderByallFilters_Pagination(@manager,@workorderStatusKey,@workorderDate,@workorderDate2,@facilitykey,@roomTypeKey,@floorKey,@roomKey,@zoneKey,@employeekey,@workorderTypeKey,@BatchScheduleNameKey,@OrganizationID,@pageNo,@itemsPerPage,@SearchWO,@keepactive)", [manager, workorderStatusKey, workorderDate, workorderDate2, facilitykey, roomTypeKey, floorKey, roomKey, zoneKey, employeekey, workorderTypeKey, BatchScheduleNameKey, OrganizationID, pageNo, itemsPerPage, SearchWO, keepactive], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[17]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getRemainingWODetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var from = url.parse(req.url, true).query['from'];
    var to = url.parse(req.url, true).query['to'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var wotypeKey = url.parse(req.url, true).query['wotypeKey'];
    var org = url.parse(req.url, true).query['org'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @from=?;set @to=?;set @empkey=?;set @wotypeKey=?;set @org=?; call usp_getRemainingWODetails(@from,@to,@empkey,@wotypeKey,@org)', [from, to, empKey, wotypeKey, org], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});

app.options('/getInspectionDetailedReportByAllFilter', supportCrossOriginScript);
app.post(securedpath + '/getInspectionDetailedReportByAllFilter', supportCrossOriginScript, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var TemplateName = req.body.TemplateName;
    var SupervisorKey = req.body.SupervisorKey;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @fromdate=?; set @todate=?; set @TemplateName=?; set @SupervisorKey=?; set@employeekey=?; set@OrganizationID=?; call usp_getInspectionDetailedReportByAllFilter(@fromdate,@todate,@TemplateName,@SupervisorKey,@employeekey,@OrganizationID)', [fromdate, todate, TemplateName, SupervisorKey, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getInspectionDetailedReportByAllFilter " + JSON.stringify(rows[6]));
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
// Coding ... @Rodney ends......

// @Author:Prakash code starts here
app.get(securedpath + '/getCountForAssignmentManualCronjob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?; call usp_getCountForAssignmentManualCronjob(@orgID)', [orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getCountForAssignmentManualCronjobnextdate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?; call usp_getCountForAssignmentManualCronjobnextdate(@orgID)', [orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getCountForAssignmentManualcreatecheck', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var curDate = url.parse(req.url, true).query['curDate'];
    //var empKey = req.body.empKey;
    var orgID = url.parse(req.url, true).query['orgID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @curDate=?; set @orgID=?; call usp_getCountForAssignmentManualcreatecheck(@curDate,@orgID)', [curDate, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/deletebatchWorkOrders', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newWOObj = {};
    newWOObj = req.body;
    var deletebatchWorkOrderString = newWOObj.deletebatchWorkOrderString;
    var employeekey = newWOObj.employeekey;
    var OrganizationID = newWOObj.OrganizationID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        } else {
            connection.query('set @deletebatchWorkOrderString=?; set @employeekey=?;set @OrganizationID=?;  call usp_deletebatchWorkOrders(@deletebatchWorkOrderString,@employeekey,@OrganizationID)', [deletebatchWorkOrderString, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("deleteWorkOrders...from server.." + JSON.stringify(rows[3]));
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getInspectionAuditDetailsForReportSummary', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var from = url.parse(req.url, true).query['from'];
    var to = url.parse(req.url, true).query['to'];
    var template = url.parse(req.url, true).query['template'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @from=?;set @to=?;set @template=?;set @employeeKey=?;set @orgID=?; call usp_getInspectionAuditDetailsForReport_summary(@from,@to,@template,@employeeKey,@orgID)', [from, to, template, employeeKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
// @Author:Prakash code ends here
app.post(securedpath + '/getCancelledWorkorderReport', supportCrossOriginScript, function (req, res) {

    var newWOObj = req.body;

    var facilityKey = newWOObj.facilityKey;
    var floorKey = newWOObj.floorKey;
    var roomTypeKey = newWOObj.roomTypeKey;
    var zoneKey = newWOObj.zoneKey;
    var Fromdate = newWOObj.Fromdate;
    var Todate = newWOObj.Todate;
    var roomKey = newWOObj.roomKey;
    var employeeKey = newWOObj.employeeKey;
    var metauser = newWOObj.metauser;
    var OrgID = newWOObj.OrgID;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @facilityKey =?;set @floorKey =?;set @roomTypeKey =?;set @zoneKey =?;set @Fromdate=?; set @Todate=?;set @roomKey=?;set @employeeKey=?;set @metauser=?;set @OrgID=?; call usp_workorderCancelledReportByallFilters(@facilityKey,@floorKey,@roomTypeKey,@zoneKey,@Fromdate,@Todate,@roomKey,@employeeKey,@metauser,@OrgID)", [facilityKey, floorKey, roomTypeKey, zoneKey, Fromdate, Todate, roomKey, employeeKey, metauser, OrgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[10]));
                }
            });
        }
        connection.release();
    });
});

//firebase notification codes starts -----by varun


var admin = require('firebase-admin');

var serviceAccount = require("./troowork-7eef7-firebase-adminsdk-447j2-0a4fd5ae89.json"); // firebase apn file(unique in each account-- created in trooworkdev)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)  //json file need to initialize ,then only we can send FCM
});


app.get(securedpath + '/mob_sendNotification', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");


    var Date = url.parse(req.url, true).query['Date'];
    var toEmp = url.parse(req.url, true).query['toEmp'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var token;
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @toEmp=?;set @empKey=?; set @OrganizationID=?; call usp_mob_fireBaseLocationRequest(@toEmp,@empKey,@OrganizationID)', [toEmp, empkey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    // res.end(JSON.stringify(rows[3]));
                    console.log(" FirebaseGeoLocationID " + rows[3][0].FirebaseGeoLocationID);
                    var FirebaseGeoLocationID = rows[3][0].FirebaseGeoLocationID;
                    FirebaseGeoLocationID = FirebaseGeoLocationID.toString();
                    token = rows[3][0].Token;
                    if (!token) {
                        rows[3][0].FirebaseGeoLocationID = 'error';
                        res.end(JSON.stringify(rows[3]));

                    }
                    else {
                        var payload = {
                            notification: {           // app notification title & body
                                title: "TrooWork",
                                body: "Please tap to share location info."
                            },
                            data: {        // data that need to pass to device
                                Date: Date,
                                toEmp: toEmp,
                                OrganizationID: OrganizationID,
                                FirebaseGeoLocationID: FirebaseGeoLocationID
                            }
                        };
                        var options = {
                            priority: "high",
                            timeToLive: 60 * 60,
                            contentAvailable: true
                        };

                        admin.messaging().sendToDevice(token, payload, options)
                            .then(function (response) {
                                console.log("Successfully sent message:", response);
                                res.end(JSON.stringify(rows[3]));
                            })
                            .catch(function (error) {
                                console.log("Error sending message:", error);
                                rows[3][0].FirebaseGeoLocationID = 'error';
                                res.end(JSON.stringify(rows[3]));
                            });

                    }


                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/mob_fireBaseTokenInsert', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empKey = url.parse(req.url, true).query['empKey'];
    var token = url.parse(req.url, true).query['token'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?; set @token=?; set @OrganizationID=?; call usp_mob_fireBaseTokenInsert(@empKey,@token,@OrganizationID)', [empKey, token, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_sendGeoLocation', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var latitude = url.parse(req.url, true).query['latitude'];
    var longitude = url.parse(req.url, true).query['longitude'];
    var Date = url.parse(req.url, true).query['Date'];
    var FirebaseGeoLocationID = url.parse(req.url, true).query['FireBaseGeoLocationID'];
    var empKey = url.parse(req.url, true).query['empKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];



    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @latitude=?; set @longitude=?; set @Date=?; set @FirebaseGeoLocationID=?; set @empKey=?;  set @OrganizationID=?; call usp_mob_sendGeoLocation(@latitude,@longitude,@Date,@FirebaseGeoLocationID,@empKey,@OrganizationID)', [latitude, longitude, Date, FirebaseGeoLocationID, empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_getFireBaseEmployees', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empKey = url.parse(req.url, true).query['empkey'];

    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?;   set @OrganizationID=?; call usp_mob_getFireBaseEmployees(@empKey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_getFireBaseLocation', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var empKey = url.parse(req.url, true).query['empKey'];
    var FirebaseGeoLocationID = url.parse(req.url, true).query['FireBaseGeoLocationID'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?; set@FirebaseGeoLocationID=?; set @OrganizationID=?; call usp_mob_getFireBaseLocation(@empKey,@FirebaseGeoLocationID,@OrganizationID)', [empKey, FirebaseGeoLocationID, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});
//firebase notification codes ends -----by varun

app.get(securedpath + '/mob_workorderCreateByEmployeeBarcodeWorkorderType', function (req, res) { //
    res.header("Access-Control-Allow-Origin", "*");

    var barcode = url.parse(req.url, true).query['barcode'];
    var Date = url.parse(req.url, true).query['Date'];
    var isBar = url.parse(req.url, true).query['isBar'];
    var checkIn = url.parse(req.url, true).query['checkIn'];
    var empKey = url.parse(req.url, true).query['emp'];
    var wot = url.parse(req.url, true).query['wot'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];


    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set@barcode=?;set@Date=?; set@isBar=?; set@checkIn=?; set@empKey=?; set @wot=?; set @OrganizationID=?;call usp_mob_workorderCreateByEmpBarWOType(@barcode,@Date,@isBar,@checkIn,@empKey,@wot,@OrganizationID)", [barcode, Date, isBar, checkIn, empKey, wot, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});
// inspection changes starts by varun
app.get(securedpath + '/mob_getPickValuesListForInspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var orgID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?; call usp_mob_getPickValuesListForInspection(@orgID)', [orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_createInspectionByScan', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var barcode = url.parse(req.url, true).query['barcode'];
    var TemplateID = url.parse(req.url, true).query['TemplateID'];
    var SupervisorKey = url.parse(req.url, true).query['SupervisorKey'];
    var EmployeeKey = url.parse(req.url, true).query['EmployeeKey'];
    var time = url.parse(req.url, true).query['time'];
    var metaUser = url.parse(req.url, true).query['metaUser'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @barcode=?; set@TemplateID=?; set@SupervisorKey=?; set@EmployeeKey=?; set@time=?; set@metaUser=?; set@OrganizationID=?; call usp_mob_createInspectionByScan(@barcode,@TemplateID,@SupervisorKey,@EmployeeKey,@time,@metaUser,@OrganizationID)', [barcode, TemplateID, SupervisorKey, EmployeeKey, time, metaUser, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});
// inspection changes ends by varun
//Pagination COde for App By Prakash
app.get(securedpath + '/mob_page_viewDashboardWorkorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var viewdate = url.parse(req.url, true).query['viewdate'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var pageindex = url.parse(req.url, true).query['pageindex'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @viewdate=?; set @OrganizationID=?; set @pageindex=?; call usp_mob_page_workordersGetByEmpKey(@employeekey,@viewdate,@OrganizationID,@pageindex)', [employeekey, viewdate, OrganizationID, pageindex], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[4]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_page_getWorkorderByStatusEmployeeKey', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var workstatuskey = url.parse(req.url, true).query['workstatuskey'];
    var t_date = url.parse(req.url, true).query['today'];
    var userKey = url.parse(req.url, true).query['userKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var pageindex = url.parse(req.url, true).query['pageindex'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @workstatuskey=?; set @today=?; set @userKey=?; set@OrganizationID=?; set @pageindex=?; call usp_mob_page_workorderGetByStatusEmployeeKey(@employeekey,@workstatuskey,@today,@userKey,@OrganizationID,@pageindex)', [employeekey, workstatuskey, t_date, userKey, OrganizationID, pageindex], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/mob_page_scanforWorkorder', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var barcode = url.parse(req.url, true).query['barcode'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var ondate = url.parse(req.url, true).query['ondate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var pageindex = url.parse(req.url, true).query['pageindex'];
    console.log("room barcode and  empkey is " + barcode + " " + empkey);//set @employeekey =?;call tm_workorderdetail(@employeekey)         
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @barcode =?;set @empkey =?;set @date =?; set@OrganizationID=?; set @pageindex=?; call usp_mob_page_workorderGetByScannedBarcode(@barcode,@empkey,@date,@OrganizationID,@pageindex)", [barcode, empkey, ondate, OrganizationID, pageindex], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });

});

app.get(securedpath + '/mob_page_viewworkorderFilterByFacility', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var facilitykey = url.parse(req.url, true).query['facilitykey'];
    var zonekey = url.parse(req.url, true).query['zone'];
    var floorkey = url.parse(req.url, true).query['floor'];
    var t_date = url.parse(req.url, true).query['today'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var pageindex = url.parse(req.url, true).query['pageindex'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @facilitykey=?; set @zone=?; set @floor=?; set @today=?; set @employeekey=?; set@OrganizationID=?; set @pageindex=?; call usp_mob_page_workorderViewByFacilityFloorZone(@facilitykey,@zone,@floor,@today,@employeekey,@OrganizationID,@pageindex)', [facilitykey, zonekey, floorkey, t_date, employeekey, OrganizationID, pageindex], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/mob_page_workorderFilterByStatusEmpView', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var statuskey = url.parse(req.url, true).query['statuskey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var t_date = url.parse(req.url, true).query['today'];
    var emp = url.parse(req.url, true).query['employeekey'];
    var pageindex = url.parse(req.url, true).query['pageindex'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @statuskey=?; set @today=?;  set @emp=?; set@OrganizationID=?; set @pageindex=?; call usp_mob_page_workorderFilterByStatusEmpView(@statuskey,@today,@emp,@OrganizationID,@pageindex)', [statuskey, t_date, emp, OrganizationID, pageindex], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
//Pagination COde for App By Prakash
//for inspection By Prakash
app.get(securedpath + '/getTemplatesNameFor_pick_Mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set@OrganizationID=?; call usp_mob_getTemplatesNameFor_pick(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getSupervisorInspectionView_pick', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var to_date = url.parse(req.url, true).query['to_date'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @username=?; set@OrganizationID=?; call usp_mob_getSupervisorInspectionView(@date,@username,@OrganizationID)', [to_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});
//for inspection By Prakash
//Rodney Code change starts here
app.get(securedpath + '/getExpiredAssignmentList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['orgID'];
    var limit = url.parse(req.url, true).query['limit'];
    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @limit=?;set @OrganizationID=?; call usp_getExpiredAssignments(@limit,@OrganizationID)', [limit, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getExpiringAssignmentList', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['orgID'];
    var limit = url.parse(req.url, true).query['limit'];
    pool.getConnection(function (err, connection) {

        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @limit=?;set @OrganizationID=?; call usp_getExpiringAssignments(@limit,@OrganizationID)', [limit, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getPickValuesListForInspection', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var orgID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @orgID=?; call usp_getPickValuesListForInspection(@orgID)', [orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getTemplateNameForPicklistReport', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @employeekey=?; set @OrganizationID=?; call usp_getTemplatesForPicklistReport(@employeekey,@OrganizationID)', [employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getInspectionPickListReportDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var from = url.parse(req.url, true).query['from'];
    var to = url.parse(req.url, true).query['to'];
    var template = url.parse(req.url, true).query['template'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @from=?;set @to=?;set @template=?;set @employeeKey=?;set @orgID=?; call usp_getInspectionPicklisttDetailsForReport(@from,@to,@template,@employeeKey,@orgID)', [from, to, template, employeeKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("getallWorkorderStatus " + JSON.stringify(rows[5]));
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getVersionDetails', function (req, res) { //
    res.header("Access-Control-Allow-Origin", "*");

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("call usp_getWebVersionDetails()", [], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[0]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/getLastCleaningDetails', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var roomKey = url.parse(req.url, true).query['roomKey'];
    var orgID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @roomKey=?;set @orgID=?; call usp_getLastCleaningDetails(@roomKey,@orgID)', [roomKey, orgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/employeesrowFiltering', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var searchtext = url.parse(req.url, true).query['searchtext'];
    var eventsOnly = url.parse(req.url, true).query['eventsOnly'];
    var range = url.parse(req.url, true).query['range'];
    var todaydate = url.parse(req.url, true).query['todaydate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            111
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @searchtext=?;set @eventsOnly=?;set@range=?;set @todaydate=?;set @OrganizationID=?; call usp_getEmployeesForSchedulerWithrowFiltering(@groupID,@searchtext,@eventsOnly,@range,@todaydate,@OrganizationID)', [groupID, searchtext, eventsOnly, range, todaydate, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("json " + JSON.stringify(rows[6]));
                    // res.end(JSON.stringify(rows[3]));
                    var data = rows[6];
                    var resources = [];
                    var arr = 0;
                    var tempArr = [];
                    if (data.length > 0) {
                        var selectedGroup = data[0].Idemployeegrouping;// 1st group Id                   
                        tempArr[arr] = [];// creating 2D array
                        for (var i = 0; i < data.length; i++) {
                            if (selectedGroup == data[i].Idemployeegrouping) {// check for group id  
                                data[i].IsShift = 0;
                                tempArr[arr].push(data[i]);
                            }
                            else {
                                arr = arr + 1;
                                tempArr[arr] = [];// creating 2D array
                                var selectedGroup = data[i].Idemployeegrouping
                                data[i].IsShift = 0;
                                tempArr[arr].push(data[i]);
                            }
                        }
                    }
                    if (tempArr.length > 0) {
                        if (OrganizationID == 103) {
                            for (var j = 0; j <= arr; j++) {// inserting array value to scheduler tree list
                                resources.push({ name: tempArr[j][0].Description, id: tempArr[j][0].Idemployeegrouping, "expanded": false, children: tempArr[j], IsShift: 1, backColor: tempArr[j][0].backColor });

                            }
                        } else {
                            for (var j = 0; j <= arr; j++) {// inserting array value to scheduler tree list
                                resources.push({ name: tempArr[j][0].Description, id: tempArr[j][0].Idemployeegrouping, "expanded": false, children: tempArr[j], IsShift: 1, backColor: tempArr[j][0].backColor });

                            }
                        }
                    }
                    res.send(resources);
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getSupervisorInspectionView_WEB', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var to_date = url.parse(req.url, true).query['to_date'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @date=?; set @username=?; set@OrganizationID=?; call usp_getSupervisorInspectionView_web(@date,@username,@OrganizationID)', [to_date, employeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));

                }
            });
        }
        connection.release();
    });

});
//Rodney Code change Ends here
//
app.options('/mobsaveinspectedQuestions', supportCrossOriginScript);
app.post(securedpath + '/mobsaveinspectedQuestions', supportCrossOriginScript, function (req, res) {
    var inspectionnotes = req.body.inspectionnotes;
    var templateQstnValues = req.body.templateQstnValues;
    var templateid = req.body.templateid;
    var inspectionkey = req.body.inspectionkey;
    var questionid = req.body.questionid;
    var metaupdatedby = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;

    var ObservationDeficiency = req.body.ObservationDeficiency;
    var CorrectiveAction = req.body.CorrectiveAction;
    var CompletedDate = req.body.CompletedDate;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @inspectionnotes=?; set @templateQstnValues=?; set @templateid=?; set @inspectionkey=?; set @questionid=?; set @metaupdatedby=?; set @OrganizationID=?; set @ObservationDeficiency=?; set @CorrectiveAction=?; set @CompletedDate=?;call usp_mob_saveInspectedValues(@inspectionnotes,@templateQstnValues,@templateid,@inspectionkey,@questionid,@metaupdatedby,@OrganizationID,@ObservationDeficiency,@CorrectiveAction,@CompletedDate)', [inspectionnotes, templateQstnValues, templateid, inspectionkey, questionid, metaupdatedby, OrganizationID, ObservationDeficiency, CorrectiveAction, CompletedDate], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[10]));
                }
            });
        }
        connection.release();
    });
});

// @Rodney starts...

app.get(securedpath + '/employeesForScheduler_SuType_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @empkey=?;set @OrganizationID=?; call usp_getEmployeesForScheduler_SuType_mob(@groupID,@empkey,@OrganizationID)', [groupID, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/employeeCalendarDetailsForScheduler_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var dateRange = url.parse(req.url, true).query['dateRange'];
    var startDate = url.parse(req.url, true).query['startDate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @startDate=?;set @dateRange=?;set @OrganizationID=?; call usp_getEmpDetailsFromEmpCalendar_mob(@startDate,@dateRange,@OrganizationID)', [startDate, dateRange, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

app.post(securedpath + '/cancelPTORequest', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var ptorequestID = req.body.ptorequestID;
    var EmpKey = req.body.EmpKey;
    var OrgID = req.body.OrgID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @ptorequestID=?;set @EmpKey=?;set @OrgID=?;call usp_cancelPTORequest(@todayDate,@ptorequestID,@EmpKey,@OrgID)", [todayDate, ptorequestID, EmpKey, OrgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/employeesrowFiltering_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var searchtext = url.parse(req.url, true).query['searchtext'];
    var range = url.parse(req.url, true).query['range'];
    var todaydate = url.parse(req.url, true).query['todaydate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            111
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @searchtext=?;set@range=?;set @todaydate=?;set @OrganizationID=?; call usp_getEmployeesForSchedulerWithrowFiltering_mob(@groupID,@searchtext,@range,@todaydate,@OrganizationID)', [groupID, searchtext, range, todaydate, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/employeesrowFiltering_group_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var searchtext = url.parse(req.url, true).query['searchtext'];
    var range = url.parse(req.url, true).query['range'];
    var todaydate = url.parse(req.url, true).query['todaydate'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            111
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @searchtext=?;set@range=?;set @todaydate=?;set @OrganizationID=?; call usp_getEmployeesForSchedulerWithrowFiltering_Group_mob(@groupID,@searchtext,@range,@todaydate,@OrganizationID)', [groupID, searchtext, range, todaydate, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[5]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/requestForTradeCancel', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var traderequestID = req.body.traderequestID;
    var EmpKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @traderequestID=?;set @EmpKey=?;call usp_requestForTradeCancel(@todayDate,@traderequestID,@EmpKey)", [todayDate, traderequestID, EmpKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/tradeCancelApprove', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var traderequestID = req.body.traderequestID;
    var EmpKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @traderequestID=?;set @EmpKey=?;call usp_tradeCancelApprove(@todayDate,@traderequestID,@EmpKey)", [todayDate, traderequestID, EmpKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTradeStatus', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var OrganizationID = url.parse(req.url, true).query['orgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            111
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; call usp_getTradeStatus(@OrganizationID)', [OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[1]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getEmployeeGroupsforscheduler_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var toServeremployeekey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrgID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @toServeremployeekey=?; set @OrganizationID=?; call usp_getEmployeeGroupsForScheduler_mob(@toServeremployeekey,@OrganizationID)', [toServeremployeekey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    console.log("welcomeMessage...from server.." + JSON.stringify(rows[2]));
                    res.end(JSON.stringify(rows[2]));
                }
            });
        }
        connection.release();
    });
});
// PTO for mobile starts.


app.get(securedpath + '/getPTORequestDetails_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var empKey = url.parse(req.url, true).query['employeekey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @empKey=?;set @OrganizationID=?;call usp_mob_getPTORequestDetails(@empKey,@OrganizationID)', [empKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});



app.post(securedpath + '/savePTORequest_mob', supportCrossOriginScript, function (req, res) {

    var currentdate = req.body.currentdate;
    var employeekey = req.body.employeekey;
    var OrganizationID = req.body.OrganizationID;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var comments = req.body.comments;
    var reason = req.body.ptoreason;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currentdate=?;set @employeekey=?;set @OrganizationID=?;set @startdate=?;set @enddate=?;set @comments=?; set @reason=?; call usp_mob_SavePTORequest(@currentdate,@employeekey,@OrganizationID,@startdate,@enddate,@comments,@reason)", [currentdate, employeekey, OrganizationID, startdate, enddate, comments, reason], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});

app.get(securedpath + '/getPTORequestDetailsforEmployee_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var ptorequestDetailsKey = url.parse(req.url, true).query['ptorequestDetails'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @ptorequestDetailsKey=?;call usp_mob_getPTORequestDetailsbyIDforEmployee(@ptorequestDetailsKey)', [ptorequestDetailsKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/setEditedPTORequest_mob', supportCrossOriginScript, function (req, res) {

    var currdate = req.body.currdate;
    var ptorequestID = req.body.ptorequestID;
    var StartDate = req.body.StartDate;
    var EndDate = req.body.EndDate;
    var Comments = req.body.Comments;
    var reason = req.body.ptoreason;
    var empKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currdate=?;set @ptorequestID=?;set @StartDate=?;set @EndDate=?;set @Comments=?;set @reason=?;set @empKey=?;call usp_mob_setEditedPTORequest(@currdate,@ptorequestID,@StartDate,@EndDate,@Comments,@reason,@empKey)", [currdate, ptorequestID, StartDate, EndDate, Comments, reason, empKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/cancelPTORequest_mob', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var ptorequestID = req.body.ptorequestID;
    var EmpKey = req.body.EmpKey;
    var OrgID = req.body.OrgID;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @ptorequestID=?;set @EmpKey=?;set @OrgID=?;call usp_mob_cancelPTORequest(@todayDate,@ptorequestID,@EmpKey,@OrgID)", [todayDate, ptorequestID, EmpKey, OrgID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/deletePTORequest_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var deleteRequestKey = url.parse(req.url, true).query['deleteRequestKey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @deleteRequestKey=?;set @OrganizationID=?; call usp_mob_deletePTORequest(@deleteRequestKey,@OrganizationID)', [deleteRequestKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});

// PTO for mobile ends.

app.get(securedpath + '/employeesForSchedulerDropdown', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var groupID = url.parse(req.url, true).query['groupID'];
    var empkey = url.parse(req.url, true).query['empkey'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set@groupID=?;set @empkey=?;set @OrganizationID=?; call usp_getEmployeesForSchedulerDropdown(@groupID,@empkey,@OrganizationID)', [groupID, empkey, OrganizationID], function (err, rows) {//IMPORTANT : (err,rows) this order matters.
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {
                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});

// trade starts


app.get(securedpath + '/getAllEmployeeNames_SuType_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var employeekey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @employeekey=?; call usp_mob_getAllEmployeeNames_SuType(@OrganizationID,@employeekey)', [OrganizationID, employeekey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});



app.post(securedpath + '/saveTradeRequest_mob', supportCrossOriginScript, function (req, res) {

    var currentdate = req.body.currentdate;
    var toServeremployeekey = req.body.toServeremployeekey;
    var OrganizationID = req.body.OrganizationID;
    var EmployeeKey = req.body.EmployeeKey;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var comments = req.body.comments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currentdate=?;set @toServeremployeekey=?;set @OrganizationID=?;set @EmployeeKey=?;set @startdate=?;set @enddate=?;set @comments=?; call usp_mob_SaveTradeRequest(@currentdate,@toServeremployeekey,@OrganizationID,@EmployeeKey,@startdate,@enddate,@comments)", [currentdate, toServeremployeekey, OrganizationID, EmployeeKey, startdate, enddate, comments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});



app.get(securedpath + '/getTradeRequestDetails_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    var empKey = url.parse(req.url, true).query['employeekey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @OrganizationID=?; set @empKey=?; call usp_mob_getTradeRequestDetails(@OrganizationID,@empKey)', [OrganizationID, empKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});




-

app.get(securedpath + '/getAssignmentTradebyID_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var traderequestID = url.parse(req.url, true).query['traderequestID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @traderequestID=?;call usp_mob_getAssignmentTradebyID(@traderequestID)', [traderequestID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[1]));


                }
            });
        }
        connection.release();
    });
});




app.post(securedpath + '/setEditedTradeRequest_mob', supportCrossOriginScript, function (req, res) {

    var currdate = req.body.currdate;
    var traderequestID = req.body.traderequestID;
    var OtherEmployee = req.body.OtherEmployee;
    var StartDate = req.body.StartDate;
    var EndDate = req.body.EndDate;
    var Comments = req.body.Comments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @currdate=?;set @traderequestID=?; set@OtherEmployee=?; set @StartDate=?;set @EndDate=?;set @Comments=?;call usp_mob_setEditedTradeRequest(@currdate,@traderequestID,@OtherEmployee,@StartDate,@EndDate,@Comments)", [currdate, traderequestID, OtherEmployee, StartDate, EndDate, Comments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[6]));
                }
            });
        }
        connection.release();
    });
});


app.get(securedpath + '/getTradeRequestInfoforEmployee_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var traderequestKey = url.parse(req.url, true).query['traderequestDetails'];
    var OrganizationID = url.parse(req.url, true).query['OrganizationID'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @traderequestKey=?; set @OrganizationID=?; call usp_mob_getTradeRequestDetailsbyIDforEmployee(@traderequestKey,@OrganizationID)', [traderequestKey, OrganizationID], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});







app.post(securedpath + '/requestForTradeCancel_mob', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var traderequestID = req.body.traderequestID;
    var EmpKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @traderequestID=?;set @EmpKey=?;call usp_mob_requestForTradeCancel(@todayDate,@traderequestID,@EmpKey)", [todayDate, traderequestID, EmpKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});





app.post(securedpath + '/tradeCancelApprove_mob', supportCrossOriginScript, function (req, res) {

    var todayDate = req.body.todayDate;
    var traderequestID = req.body.traderequestID;
    var EmpKey = req.body.EmpKey;
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @todayDate=?;set @traderequestID=?;set @EmpKey=?;call usp_mob_tradeCancelApprove(@todayDate,@traderequestID,@EmpKey)", [todayDate, traderequestID, EmpKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[3]));
                }
            });
        }
        connection.release();
    });
});




app.get(securedpath + '/deleteTradeRequest_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var deleteRequestKey = url.parse(req.url, true).query['deleteRequestKey'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @deleteRequestKey=?; set @employeeKey=?; call usp_mob_deleteTradeRequest(@deleteRequestKey,@employeeKey)', [deleteRequestKey, employeeKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});


app.post(securedpath + '/saveTradeRequestAction_mob', supportCrossOriginScript, function (req, res) {

    var tradeRequestID = req.body.tradeRequestID;
    var employeekey = req.body.employeekey;
    var statuscurrentdate = req.body.statuscurrentdate;
    var approvedstartdate = req.body.approvedstartdate;
    var ApprovedEndDate = req.body.ApprovedEndDate;
    var StatusKey = req.body.StatusKey;
    var statuscomments = req.body.statuscomments;

    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query("set @tradeRequestID=?;set @employeekey=?;set @statuscurrentdate=?;set @approvedstartdate=?;set @ApprovedEndDate=?;set @StatusKey=?;set @statuscomments=?; call usp_mob_saveTradeRequestAction(@tradeRequestID,@employeekey,@statuscurrentdate,@approvedstartdate,@ApprovedEndDate,@StatusKey,@statuscomments)", [tradeRequestID, employeekey, statuscurrentdate, approvedstartdate, ApprovedEndDate, StatusKey, statuscomments], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {

                    res.end(JSON.stringify(rows[7]));
                }
            });
        }
        connection.release();
    });
});
app.get(securedpath + '/logoutRequest_mob', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var logoutRequestKey = url.parse(req.url, true).query['logoutRequestKey'];
    var employeeKey = url.parse(req.url, true).query['employeeKey'];
    pool.getConnection(function (err, connection) {
        if (err) {

            console.log("Failed! Connection with Database spicnspan via connection pool failed");
        }
        else {
            console.log("Success! Connection with Database spicnspan via connection pool succeeded");
            connection.query('set @logoutRequestKey=?; set @employeeKey=?; call usp_mob_logoutRequest(@logoutRequestKey,@employeeKey)', [logoutRequestKey, employeeKey], function (err, rows) {
                if (err) {
                    console.log("Problem with MySQL" + err);
                }
                else {


                    res.end(JSON.stringify(rows[2]));


                }
            });
        }
        connection.release();
    });
});


// trade ends

// @Rodney ends...

//handle generic exceptions
//catch all other resource routes that are not defined above
app.get(securedpath + '/*', function (req, res) {
    res.json({ "code": 403, "status": "Requested resource not available" });
});

app.use(errorHandler);

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({ "code": 100, "status": "Error in establishing database connection" });
}
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(0);
    res.json({ err });
}
module.exports = app;
