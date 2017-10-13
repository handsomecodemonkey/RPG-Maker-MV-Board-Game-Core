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

 /* Board Data Model */

    //-----------------------------------------------------------------------------
	// Board_Space
	//
	// A representation of a space on the board
	
	function Board_Space() {
	    this.initialize.apply(this, arguments);
	}

	Board_Space.prototype.initialize = function() {
	    this.initMembers();
	};
	
	Board_Space.prototype.initMembers = function() {
	    this._xCoord = 0;
	    this._yCoord = 0;
	    this._directionsToNextSpace = [];
	};

	Board_Space.prototype.setXY = function(x,y) {
		this._xCoord = x;
		this._yCoord = y;
	};

	//-----------------------------------------------------------------------------
	// Board_Model
	//
	// A representation of a space on the board
 
	function Board_Model() {
	    this.initialize.apply(this, arguments);
	}

	Board_Model.prototype.initialize = function() {
	    this.initMembers();
	};

	Board_Model.prototype.initMembers = function() {
	    this._boardSpaces = [];
	};

	Board_Model.prototype.addSpace = function(space) {
		this._boardSpaces.push(space);
	};

	Board_Model.prototype.addSpaces = function(spaces) {
		for(var i = 0; i < spaces.length; i++){
			this.addSpace(spaces[i]);
		}
	};

/* End Board Data Model */
    

/* Main Plugin Function */
(function() {
    /* Setup */

    //Get parameters from plugin manager
    var parameters = PluginManager.parameters('BoardGameCore');
    var test = String(parameters['test']);

    //setupBoardGame
    var $boardMap = new Board_Model();

    function setupBoardGame() {
    	$gameSystem.disableEncounter();
    	//Game_Player.prototype.canMove = function() { return false; };

    	//Test map
    	
    	for(var i = 8; i != 0; i--) {
    		var newSpace = new Board_Space();
    		newSpace.setXY(0,i);
    		$boardMap.addSpace(newSpace);
    	}
    	
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