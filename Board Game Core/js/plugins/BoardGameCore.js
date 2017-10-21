/*:
 * @plugindesc Board Game
 * @author Erick Kusnadi
 *
 * @help This plugin adds Board Game functionality to RPG Maker
 *
 * @param numPlayers
 * @desc Number of players meant to be played on the map
 * @default 2
 *
 * @param minDieRoll
 * @desc The minimum number for the dice roll on one die
 * @default 1
 *
 * @param maxDieRoll
 * @desc The maximum number for the dice roll
 * @default 6
 *
 * @param playerSpeed
 * @desc How fast the player moves
 * @default 3
 * 
 * @param tileLength
 * @desc How big one space or tile is on the map (lenght of the tile square) 
 * @default 1
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
    var numPlayers = Number(parameters['numPlayers']);
    var minDieRoll = Number(parameters['minDieRoll']);
    var maxDieRoll = Number(parameters['maxDieRoll']);
    var playerSpeed = Number(parameters['playerSpeed']);
    var tileLength = Number(parameters['tileLength']);

    //setupBoardGame
    var $boardMap = new Board_Model();

    function setupBoardGame() {
    	$gameSystem.disableEncounter();
    	$gamePlayer.setMoveSpeed(playerSpeed);
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
		var result = diceRoll(minDieRoll, maxDieRoll);
		var x = 0;
		var y = $gamePlayer._realY - result;

		//$gameMessage.clear();
		//var choice = ["OK"];

		/*
		$gameMessage.setChoices(choice, 0, 0);
		$gameMessage.setChoiceCallback(function(n){
			//TODO: reroll function
			
		});
		*/

		$gameTemp.setDestination(x,y);

		//$gameMessage.add("You rolled a " + result);
	}

    //Helper function to do random die number generation (from = minNumber, to = maxNumber)
    function diceRoll(from, to) {
    	var result = Math.floor(to * Math.random()) + from;
    	console.log(result);
        return result;
    }
	
})();