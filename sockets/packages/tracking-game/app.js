'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var TrackingGame = new Module('tracking-game');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
TrackingGame.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    TrackingGame.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    TrackingGame.menus.add({
        title: 'trackingGame example page',
        link: 'trackingGame example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    TrackingGame.aggregateAsset('js','tracking.js', {global:true});
    TrackingGame.aggregateAsset('js','tracking/color.js', {global:true});

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    TrackingGame.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    TrackingGame.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    TrackingGame.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return TrackingGame;
});
