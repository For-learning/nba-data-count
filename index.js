(function () {
    'use strict';

    var env = require('jsdom').env;
    var fs = require('fs');
    // Read website resource
    var html = 'http://www.espn.com/nba/playbyplay?gameId=400900372';

    // first argument can be html string, filename, or url
    env(html, function (errors, window) {
        if (errors)
            console.log(errors);

        var $ = require('jquery')(window);

        // console.log($('#gp-quarter-1').find('tbody tr'));
        var dataStr = '';
        var dataLine = '';
        var gpQquarter1 = $('#gp-quarter-1').find('tbody tr');

        for (var i = 0; i < gpQquarter1.length; i++) {
            dataLine = $($(gpQquarter1[i]).find('td')[0]).html() + ';' + $($(gpQquarter1[i]).find('td')[2]).html() + ';'
                + $($(gpQquarter1[i]).find('td')[3]).html() + '\n';
            

             
            // Append to the last line
            dataStr += dataLine;
        }
        console.log('data========================================================start');
        console.log(dataStr);
        console.log('data========================================================ending');
    });
}());