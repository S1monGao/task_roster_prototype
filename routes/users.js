var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/editprofile', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE profile SET name=?,age=?,gender=?,company=?,capability=?,avail_from=?,avail_to=? WHERE user_id=?";
        connection.query(query, [sanitizeHtml(req.body.name),sanitizeHtml(req.body.age),sanitizeHtml(req.body.gender),sanitizeHtml(req.body.company),sanitizeHtml(req.body.capability),sanitizeHtml(req.body.availfr),sanitizeHtml(req.body.availto),sanitizeHtml(req.session.userdata.id)], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.redirect('/profile.html');
        });
    });
});

router.post('/edittask', function(req, res, next) {
    if (req.session.userdata){
        //change status to boolean
        if (req.body.status&&req.body.status==='on')
            req.body.status=1;
        else
            req.body.status=0;
        //db operation
        req.pool.getConnection(function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            if(req.body.tid&&req.session.userdata.ismanager){
                var query0 = "UPDATE task SET title=?,note=?,deadline=?,status=? WHERE id=?;";
                connection.query(query0, [sanitizeHtml(req.body.title),sanitizeHtml(req.body.note),sanitizeHtml(req.body.deadline),sanitizeHtml(req.body.status),sanitizeHtml(parseInt(req.body.tid))], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    res.redirect('/index.html');
                });}
            else if(req.body.tid){
                var query1 = "UPDATE task SET status=? WHERE id=?;";
                connection.query(query1, [sanitizeHtml(req.body.status),sanitizeHtml(parseInt(req.body.tid))], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {

                        res.sendStatus(500);
                        return;
                    }
                    res.redirect('/index.html');
                });

            }else if (req.session.userdata.ismanager){
                var query = "INSERT INTO task (title,note,deadline,status) VALUES (?,?,?,?);";
                connection.query(query, [sanitizeHtml(req.body.title),sanitizeHtml(req.body.note),sanitizeHtml(req.body.deadline),sanitizeHtml(req.body.status)], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    res.redirect('/index.html');
                });
            }
        });
    }
    else
        res.redirect('/login.html');
});

router.post('/deletetask', function(req, res, next) {

    if (req.session.userdata.ismanager){
        req.pool.getConnection(function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = "DELETE FROM task WHERE id=?;";
            connection.query(query, [req.body.id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        });
    }
});


router.get('/username', function(req, res, next) {

    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT username FROM users WHERE email = ?";
        connection.query(query, [req.session.user], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            if(rows[0]){
                res.send(rows[0].username);
            } else {
                res.send('');
            }
        });
    });

});



module.exports = router;
