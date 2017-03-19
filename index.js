(function () {
    'use strict';

    var env = require('jsdom').env;
    var fs = require('fs');
    var _ = require('lodash');

    // Read website resource & initial data ================================================================================================
    var html = 'http://www.espn.com/nba/playbyplay?gameId=400900372';
    var selectedQuarter = 'gp-quarter-1';
    var initMemeber = ['Richard Jefferson', 'LeBron James', 'Tristan Thompson', 'Kyrie Irving', 'Iman Shumpert',
        'Aaron Gordon', 'Terrence Ross', 'Nikola Vucevic', 'Elfrid Payton', 'Evan Fournier'];
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
    // Read website resource & initial data ================================================================================================

    // first argument can be html string, filename, or url
    env(html, function (errors, window) {
        if (errors)
            console.log(errors);

        var $ = require('jquery')(window);
        var gpQquarter = $('#' + selectedQuarter + '').find('tbody tr');

        var dataStr = '';
        var dataLine = '';

        for (var i = 0; i < gpQquarter.length; i++) {
            var dataArr = $(gpQquarter[i]).find('td'); // All data will store to this array
            // 1. Add moment
            dataLine += $(dataArr[0]).html() + ',';

            if ($(dataArr[1]).find('img').attr('src').indexOf('orl') > -1) {
                // 2. Add actions
                dataLine += actionsFilter(actions, $(dataArr[2]).html()) + ',';
                // 3. Add the certain action actor = player
                dataLine += playersFilter(magicMembers, $(dataArr[2]).html()) + ',';
                // 4. Add player home
                dataLine += 'Magic' + ',';
                // 5. Add score
                dataLine += '@' + $(dataArr[3]).html() + ',';
            }

            if ($(dataArr[1]).find('img').attr('src').indexOf('cle') > -1) {
                // 2. Add actions
                dataLine += actionsFilter(actions, $(dataArr[2]).html()) + ',';
                // 3. Add the certain action actor = player
                dataLine += playersFilter(cavaliersMembers, $(dataArr[2]).html()) + ',';
                // 4. Add player home
                dataLine += 'Cavaliers' + ',';
                // 5. Add score
                dataLine += '@' + $(dataArr[3]).html() + ',';
            }

            // 6. Add players who on the ground
            if ($(dataArr[2]).html().indexOf('enters the game for') > -1) {
                var memberTempArr = _.split($(dataArr[2]).html(), 'enters the game for', 2);
                for (var j = 0; j < initMemeber.length; j++) {
                    if (initMemeber[j] == _.trim(memberTempArr[1]))
                        initMemeber[j] = _.trim(memberTempArr[0])
                }
                console.log('#' + memberTempArr[0] + '# enters the game for #' + memberTempArr[1] + '#');
                dataLine += initMemeber.toString(';');;
            } else {
                dataLine += initMemeber.toString(';');
            }

            // Append to the last line
            dataStr += dataLine + '\n';
            dataLine = '';
        }
        console.log('data========================================================start');
        // console.log(dataStr);
        console.log('data========================================================ending');

        // Write to file
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