/*:
 * @plugindesc Board Game
 * @author Erick Kusnadi
 *
 * @help This plugin adds Board Game functionality to RPG Maker
 *
* @param test
 * @desc test
 * @default true
 *
 */

(function() {
    
    function diceRoll(from, to) {
        return Math.floor(to * Math.random()) + from
    }

})();