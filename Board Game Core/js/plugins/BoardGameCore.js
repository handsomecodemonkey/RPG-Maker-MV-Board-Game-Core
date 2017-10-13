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
    
    /* Setup */

    //Get parameters from plugin manager
    var parameters = PluginManager.parameters('BoardGameCore');
    var test = String(parameters['test']);

    //setupBoardGame
    function setupBoardGame() {
    	$gameSystem.disableEncounter();
    	//Game_Player.prototype.canMove = function() { return false; };
    }

    //TODO: Load saved data
    
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
    	_DataManager_setupNewGame.call(this);
    	//Load extra save stat data
	};

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
    	_Scene_Map_onMapLoaded.call(this);
    	setupBoardGame();
	};

    /* Helper functions */

    //Setup Plugin commands
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
    	_Game_Interpreter_pluginCommand.call(this, command, args);

    	showBoardGameActionMenu();
	};

	//Shows game menu action choices for board game
	function showBoardGameActionMenu() {
		$gameMessage.clear();
		var choice = ["Roll Die", "Use Item", "Look at Board"];

		$gameMessage.setChoices(choice, 0, 0);
		$gameMessage.setChoiceCallback(function(n){
			switch (n) {
				case 0: //Roll Die
					movementDieRoll();
					break;
				case 1: //Use item
					break;
				case 2: //Look at board
					break;
				default:
					break;
			}
		});
	}

	function movementDieRoll() {
		var result = rollSixSidedDie();
		var x = 0;
		var y = $gamePlayer._realY - result;

		for (var i = 0; i < result; i++) {
			var direction = $gamePlayer.findDirectionTo(x, y);
            $gamePlayer.executeMove(direction);
		}
	}

    //Helper function to do random die number generation (from = minNumber, to = maxNumber)
    function rollSixSidedDie() {
    	var result = diceRoll(1,6);
    	console.log(result);
    	return result;
    }

    function diceRoll(from, to) {
        return Math.floor(to * Math.random()) + from;
    }

})();