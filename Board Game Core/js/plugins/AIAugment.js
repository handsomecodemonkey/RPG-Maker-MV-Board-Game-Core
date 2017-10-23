/*
 * This function will calculate and compare the combat values of a base or fort in reference to the current player party
 */
function calculateCombat( playerParty, baseParty) {
	var deductionValue = 0;
	
	var totalPlayerPartyHp = 0;
	var totalPlayerPartyAtk = 0;
	var totalPlayerPartyAgi = 0;
	var totalPlayerPartyDef = 0;

	var totalBasePartyHp = 0;
	var totalBasePartyAtk = 0;
	var totalBasePartyAgi = 0;
	var totalBasePartyDef = 0;
		
	for (var partyMember : playerParty) {
		totalPlayerPartyHp += partyMember.getHp();
		totalPlayerPartyAtk += partyMember.getAtk();
		totalPlayerPartyAgi += partyMember.getAgi();
		totalPlayerPartyDef += partyMember.getDef();
	}
	
	for (var partyMember : BaseParty) {
		totalBasePartyHp += partyMember.getHp();
		totalBasePartyAtk += partyMember.getAtk();
		totalBasePartyAgi += partyMember.getAgi();
		totalBasePartyDef += partyMember.getDef();
	}
	
	if(totalBasePartyHp > totalPlayerPartyHp) {
		deductionValue += 1;
	}
	
	if(totalBasePartyAtk > totalPlayerPartyAtk) {
		deductionValue += 1;
	}
	
	if(totalBasePartyAgi > totalPlayerPartyAgi) {
		deductionValue += 1;
	}
	
	if(totalBasePartyDef > totalPlayerPartyDef) {
		deductionValue += 1;
	}
	return deductionValue;
}

function calculateUseSpeedPotion() {
	var baseSpaceList ={1,2,3,4,5,6};
	var augmentSpaceList ={7,8,9,10,11,12};
	
	var totalBaseValues = 0;
	var totalAugmentValues = 0;
	var aiStyleMod = 1;
	
	if(this.getAiStyle() == "Aggressive") {
		aiStyleMod = 2;
	} else if (this.getAiStyle() == "Passive") {
		aiStyleMod = .5;
	}
	
	for(item : baseSpaceList) {
		// Check for owner. If unowned, check if you can build and adjust accordingly. Space value is 10.
		var currentValue = 10;
		if(item.getOwner() == null) {
			var itemCount = this.getResourceCount("Wood");
			if (itemCount < 3) {
				currentValue -= 3;
			} else { 
				currentValue -= 1;
			}
		} else if (item.getOwner() == this.getName()) {
			// If owner is the player, compare player resouces to see if they require the resource
			var itemCount = this.getResourceCount(item.getType());
			if (itemCount < 3) {
				currentValue -= 1;
			} else {
				currentValue -= 3;
			}
		} else if (item.getOwner() != this.getName()) {
			// If owner is not the player, compare combat stats of the player and the enemy
			currentValue -= (calculateCombat(this.getParty(), item.getParty())/aiStyleMod);
		}
		totalBaseValues += currentValue;
	}
	
	for(item : augmentSpaceList) {
		// Check for owner. If unowned, check if you can build and adjust accordingly. Space value is 10.
		var currentValue = 10;
		if(item.getOwner() == null) {
			var itemCount = this.getResourceCount("Wood");
			if (itemCount < 3) {
				currentValue -= 3;
			} else { 
				currentValue -= 1;
			}
		} else if (item.getOwner() == this.getName()) {
			// If owner is the player, compare player resouces to see if they require the resource
			var itemCount = this.getResourceCount(item.getType());
			if (itemCount < 3) {
				currentValue -= 1;
			} else {
				currentValue -= 3;
			}
		} else if (item.getOwner() != this.getName()) {
			// If owner is not the player, compare combat stats of the player and the enemy
			currentValue -= (calculateCombat(this.getParty(), item.getParty())/aiStyleMod);
		}
		totalAugmentValues += currentValue;
	}
	
	if (totalAugmentValues > totalBaseValues) {
		return true;
	} else {
		return false;
	}
}

