var CardDiv = function(cardObject /* Card */) {
	"use strict";
	
	// FIELDS
		this.card = cardObject;
	
	// GETTERS
		this.getRank = function() /* -> int */ {
			return this.card.getRank();
		};

		this.getSuit = function() /* -> Card.Suit */ {
			return this.card.getSuit();
		};
		
		this.getEquals = function(otherCard /* Card */) /* -> boolean */ {
			return this.card.getEquals(otherCard);
		};
		
		this.getPointValue = function() /* -> int */ {
			return this.card.getPointValue();
		};
};