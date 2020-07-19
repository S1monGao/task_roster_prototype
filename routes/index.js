var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');
var argon2 = require('argon2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tasks.json', function(req, res, next) {
    if (req.session.user)
    {
        req.pool.getConnection(function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = "select id,title,note,DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,status from task ";
            connection.query(query, function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.json(rows);
            });
        });
    }else
        res.json(null);
});



router.get('/members.json', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select username,id from users";
        connection.query(query, function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json({marr:rows});
        });
    });
});

router.get('/profile.json', function(req, res, next) {
    if(req.session.userdata){
        req.pool.getConnection(function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = "select user_id,name,age,gender,company,capability,DATE_FORMAT(avail_from, '%Y-%m-%d') AS avail_from,DATE_FORMAT(avail_to, '%Y-%m-%d') AS avail_to from profile where user_id=?";
            connection.query(query,[req.session.userdata.id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                    res.json(rows[0]);
            });

        });
    }
    else{
        res.json({id:"",name:"",age:"",gender:"",company:"",capability:"",avail_from:"",avail_to:""});
    }

});


router.post('/login',  function(req, res, next) {

    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT * FROM users WHERE email = ?";
        connection.query(query, [req.body.email], async function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            if(rows[0]){
                try {
                    if (await argon2.verify(rows[0].password, req.body.pwd)) {
                        // password match
                        // add code here for when user successfully logged in
                        req.session.user = rows[0].email;
                        req.session.userdata = rows[0];
                        res.end();

                    } else {
                        // password did not match
                        // add code here for when user login fails

                        res.sendStatus(401);
                        return;
                    }
                } catch (err) {
                    // internal failure
                    res.sendStatus(500);
                    return;
                }
            } else {
                res.sendStatus(401);
            }
        });
    });




});

router.post('/register',async function(req, res, next) {
    var hashed_pwd;
    try {
        hashed_pwd = await argon2.hash(req.body.pwd);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "INSERT INTO users (username,password,email,ismanager) VALUES (?,?,?,?)";
        connection.query(query, [sanitizeHtml(req.body.user),hashed_pwd,sanitizeHtml(req.body.email),req.body.ismanager], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });


});

router.post('/logout', function(req, res, next) {
    delete req.session.user;
    delete req.session.userdata;
    res.end();
});

router.get('/getuserinfo', function(req, res, next) {
    var info = {ismanager:0,isthisuser:0,isloggedin:0};
    if (req.session.userdata)
        {
            info.isloggedin=1;
            info.isthisuser=1;
            if(req.session.userdata.ismanager)
                info.ismanager=1;
            res.json(info);
        }
    else
        res.json(info);
});


module.exports = router;


