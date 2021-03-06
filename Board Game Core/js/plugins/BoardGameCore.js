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
 * @param DEBUG
 * @desc Boolean to check for DEBUG Mode (shows debug messages, allows touch input for movement)
 * @default false
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
	    this._regionId = 0;
	};

	Board_Space.prototype.setXY = function(x,y) {
		this._xCoord = x;
		this._yCoord = y;
	};

	Board_Space.prototype.setRegionId = function(regionId) {
		this._regionId = regionId;
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

	//Returns the index of the boardSpaces, return -1 if x,y not found in board model
	Board_Model.prototype.getIndexOfSpace = function(x,y) {
		for(var i = 0; i < this._boardSpaces.length; i++){
			if (this._boardSpaces[i]._xCoord === x && this._boardSpaces[i]._yCoord === y) {
				return i;
			}
		}

		return -1;
	};

	Board_Model.prototype.addSpaces = function(spaces) {
		for(var i = 0; i < spaces.length; i++){
			this.addSpace(spaces[i]);
		}
	};

	Board_Model.prototype.isSpaceAlreadyInModel = function(x,y) {
		for(var i = 0; i < this._boardSpaces.length; i++){
			if (this._boardSpaces[i]._xCoord === x && this._boardSpaces[i]._yCoord === y) {
				return true;
			}
		}

		return false;
	};

	//Finds the starting space on the board map (First space with region ID 1)
	Board_Model.prototype.findStartingSpace = function() {
		var width = $gameMap.width();
		var height = $gameMap.height();
		var startingSpaceFound = false;

		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				if($gameMap.regionId(x,y) === 1) { 
					console.log("Found starting space at (" + x + "," + y + ")");
					//TODO DEBUG MESSAGE (also debug if starting space not found)
					var startingSpace = new Board_Space();
    				startingSpace.setXY(x,y);
    				startingSpace.setRegionId(1);
    				this._boardSpaces.push(startingSpace);
    				startingSpaceFound = true;
    				break;
				}
			}
			if(startingSpaceFound) break;
		}
	};

	//Will generate the Board Model from the starting space, should be used after findStartingSpace function();
	Board_Model.prototype.generateBoard = function() {
		var currentSpace = this._boardSpaces[0];
		var nextSpace = null;
		var nextX = 0;
		var nextY = 0;

		while (true) {
			//Going clockwise start at the top direction
			nextX = currentSpace._xCoord;
			nextY = currentSpace._yCoord - 1;
			nextSpace = this.addSpaceIfNotStartingSpace(nextX, nextY);
			if (nextSpace !== null) {
				currentSpace = nextSpace;
				continue;
			}

			//Going clockwise next try the right direction
			nextX = currentSpace._xCoord + 1;
			nextY = currentSpace._yCoord;
			nextSpace = this.addSpaceIfNotStartingSpace(nextX, nextY);
			if (nextSpace !== null) {
				currentSpace = nextSpace;
				continue;
			}

			//Going clockwise try bottom direction
			nextX = currentSpace._xCoord;
			nextY = currentSpace._yCoord + 1;
			nextSpace = this.addSpaceIfNotStartingSpace(nextX, nextY);
			if (nextSpace !== null) {
				currentSpace = nextSpace;
				continue;
			}

			//Going clockwise try left direction
			nextX = currentSpace._xCoord - 1;
			nextY = currentSpace._yCoord;
			nextSpace = this.addSpaceIfNotStartingSpace(nextX, nextY);
			if (nextSpace !== null) {
				currentSpace = nextSpace;
				continue;			
			}

			//If none found end saying couldn't loop back as DEBUG TODO
			break;
		} 
		

	};

	Board_Model.prototype.addSpaceIfNotStartingSpace = function(nextX, nextY) {
		var regionId = $gameMap.regionId(nextX, nextY); 
		var nextSpace = null;

		if(regionId > 0 && regionId !== 1 && !this.isSpaceAlreadyInModel(nextX, nextY)) {
			nextSpace = new Board_Space();
			nextSpace.setXY(nextX,nextY);
			nextSpace.setRegionId(regionId);
			this._boardSpaces.push(nextSpace);
		}

		return nextSpace;
	};

/* End Board Data Model */

//Setup Board Map Data Model - Global Var
var $boardMap = new Board_Model();

/* Main Plugin Function */
(function() {

	//Get parameters from plugin manager
    var parameters = PluginManager.parameters('BoardGameCore');
    var numPlayers = Number(parameters['numPlayers']);
    var minDieRoll = Number(parameters['minDieRoll']);
    var maxDieRoll = Number(parameters['maxDieRoll']);
    var playerSpeed = Number(parameters['playerSpeed']);
    var tileLength = Number(parameters['tileLength']);
    var DEBUG = parameters['DEBUG'] == "true" ? true : false;

    var setupComplete = false;
    var allowPlayerMovement = false;

    /* Setup */
    function setupBoardGame() {
    	$gameSystem.disableEncounter();
    	//$gamePlayer.setMoveSpeed(playerSpeed);
    	$boardMap._boardSpaces = [];
    	$boardMap.findStartingSpace();  	
    	$boardMap.generateBoard();
    	setupComplete = true;
    }

    //TODO: Load saved data
    
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
    	_DataManager_setupNewGame.call(this);
    	//Load extra save stat data
	};

	Scene_Map.prototype.processMapTouch = function() {
	    if (TouchInput.isTriggered() || this._touchCount > 0) {
	        if (TouchInput.isPressed()) {
	            if (this._touchCount === 0 || this._touchCount >= 15) {
	            	if(allowPlayerMovement) {
	            		var x = $gameMap.canvasToMapX(TouchInput.x);
	               		var y = $gameMap.canvasToMapY(TouchInput.y);
	                	$gameTemp.setDestination(x, y);
	            	}
	            }
	            this._touchCount++;
	        } else {
	            this._touchCount = 0;
	        }
	    }
	};
	
	Game_Player.prototype.getInputDirection = function() {
		if(allowPlayerMovement) {
			return Input.dir4;
		} else {
			return 0;
		}
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

    	if(command === "showMovementMenu") {
    		showBoardGameActionMenu();
    	} else if (command === "allowPlayerMovement") {
    		var arg = args[0] === "true" ? true : false;
    		allowPlayerMovement = arg;
    	}
    	
	};

	//Shows game menu action choices for board game
	function showBoardGameActionMenu() {
		var message = "";

		var day = $gameVariables.value(1); //Day
		var timeOfDay = $gameVariables.value(2); //Time of day

		switch (timeOfDay) {
			case 1:
				message += "Afternoon of ";
				break;
			case 2:
				message += "Night of ";
				break;
			default:
				message += "Morning of ";
				break;
		} 

		message += "Day " + String(day) + ".\n";

		message += "How many spaces would you like to travel?";		

		$gameMessage.clear();
		$gameMessage.add(message);
		var choices = ["1", "2", "3"];

		$gameMessage.setChoices(choices, 0, 0);
		$gameMessage.setChoiceCallback(function(n){
			switch (n) {
				case 0: 
					moveCharacterXSpaces(1);
					break;
				case 1: 
					moveCharacterXSpaces(2);
					break;
				case 2: 
					moveCharacterXSpaces(3);
					break;
				default:
					break;
			}
		});
	}

	//Helper function to move a character a specific number of spaces
	function moveCharacterXSpaces(numSpaces) {
		var newIndex = ($boardMap.getIndexOfSpace($gamePlayer._realX, $gamePlayer._realY) + numSpaces) % $boardMap._boardSpaces.length;
		$gameTemp.setDestination($boardMap._boardSpaces[newIndex]._xCoord, $boardMap._boardSpaces[newIndex]._yCoord);

		//Set X/Y of character on board
		$gameVariables.setValue(3,$boardMap._boardSpaces[newIndex]._xCoord);
		$gameVariables.setValue(4,$boardMap._boardSpaces[newIndex]._yCoord);
	}

	function movementDieRoll() {
		var result = diceRoll(minDieRoll, maxDieRoll);
		var newIndex = ($boardMap.getIndexOfSpace($gamePlayer._realX, $gamePlayer._realY) + result) % $boardMap._boardSpaces.length;
		$gameTemp.setDestination($boardMap._boardSpaces[newIndex]._xCoord, $boardMap._boardSpaces[newIndex]._yCoord);
	}

    //Helper function to do random die number generation (from = minNumber, to = maxNumber)
    function diceRoll(from, to) {
    	var result = Math.floor(to * Math.random()) + from;
    	console.log(result);
        return result;
    }
	
})();