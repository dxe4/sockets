'use strict';

// The Package is past automatically as first parameter
module.exports = function(TrackingGame, app, auth, database) {

    app.get('/trackingGame/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/trackingGame/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/trackingGame/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/trackingGame/example/render', function(req, res, next) {
        TrackingGame.render('index', {
            package: 'tracking-game'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
