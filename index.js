(function () {
    'use strict';

    var env = require('jsdom').env;
    var fs = require('fs');
    var _ = require('lodash');
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

        var cavaliersMembers = ['LeBron James', 'Kyrie Irving', 'Kevin Love', 'Kyle Korver', 'Channing Frye', 'J.R. Smith', 'Derrick Williams',
            'Tristan Thompson', 'Iman Shumpert', 'Deron Williams', 'Richard Jefferson', 'Mike Dunleavy', 'Jordan McRae', 'Kay Felder',
            'James Jones', 'DeAndre Liggins', 'Chris Andersen', 'Andrew Bogut', 'Larry Sanders'];
        var magicMembers = ['Evan Fournier', 'Serge Ibaka', 'Nikola Vucevic', 'Elfrid Payton', 'Aaron Gordon', 'Terrence Ross', 'Jeff Green',
            'Jodie Meeks', 'D.J. Augustin', 'Bismack Biyombo', 'C.J. Watson', 'Mario Hezonja', 'Anthony Brown', 'Damjan Rudez', 'Stephen Zimmerman',
            'CJ Wilcox', 'Arinze Onuaku'];
        var actions = ['two point shot', 'jumper', 'free throw 1 of 2', 'free throw 2 of 2', 'free throw 1 of 3',
            'free throw 2 of 3', 'free throw 3 of 3', 'driving layup', 'layup', 'shot', 'tip shot', 'jumpshot', 'finger roll layup',
            'hook shot', 'three point jumper', 'three point shot', 'defensive rebound', 'offensive rebound', 'defensive team rebound',
            'offensive team rebound', 'assists', 'traveling', 'blocks', 'official timeout', 'full timeout', 'offensive Charge',
            'shooting foul', 'personal foul', 'shooting block foul', 'lost ball', 'bad pass', 'steals'];

        // var orl cle

        for (var i = 0; i < gpQquarter1.length; i++) {
            // Add moment
            dataLine += $($(gpQquarter1[i]).find('td')[0]).html() + ';';


            if ($($(gpQquarter1[i]).find('td')[1]).find('img').attr('src').indexOf('orl') > -1) {
                // Add actions
                dataLine += actionsFilter(actions, $($(gpQquarter1[i]).find('td')[2]).html()) + ';';
                // Add the certain action actor = player
                dataLine += playersFilter(magicMembers, $($(gpQquarter1[i]).find('td')[2]).html()) + ';';
                // Add player home
                dataLine += 'Magic' + ';';
                // Add score
                dataLine += $($(gpQquarter1[i]).find('td')[3]).html();
            }

            if ($($(gpQquarter1[i]).find('td')[1]).find('img').attr('src').indexOf('cle') > -1) {
                // Add actions
                dataLine += actionsFilter(actions, $($(gpQquarter1[i]).find('td')[2]).html()) + ';';
                // Add the certain action actor = player
                dataLine += playersFilter(cavaliersMembers, $($(gpQquarter1[i]).find('td')[2]).html()) + ';';

                // Add player home
                dataLine += $($(gpQquarter1[i]).find('td')[3]).html();
            }


            // dataLine = $($(gpQquarter1[i]).find('td')[0]).html() + ';' + $($(gpQquarter1[i]).find('td')[2]).html() + ';'
            //     + $($(gpQquarter1[i]).find('td')[3]).html() + '\n';



            // Append to the last line
            dataStr += dataLine + '\n';
            dataLine = '';
        }
        console.log('data========================================================start');
        console.log(dataStr);
        console.log('data========================================================ending');

        fs.writeFile('data.csv', dataStr, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });

    /**
     * actionsFilter
     */
    function actionsFilter(actionsArr, text) {
        var avtionTerm = null;
        for (var i = 0; i < actionsArr.length; i++) {
            if (text.indexOf(actionsArr[i]) > -1)
                avtionTerm = actionsArr[i];
        }
        return (!avtionTerm) ? 'No Action' : avtionTerm
    }

    /**
     * playersFilter
     */
    function playersFilter(playersArr, text) {
        var playerTerm = null;
        for (var i = 0; i < playersArr.length; i++) {
            if (text.indexOf(playersArr[i]) > -1)
                playerTerm = playersArr[i];
        }
        return (!playerTerm) ? 'No Player' : playerTerm
    }
}());