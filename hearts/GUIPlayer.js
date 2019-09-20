var GUIPlayer = function(name /*string*/) {
	"use strict";
	
	// FIELDS
		var match /* HeartsMatch */ = null;
		var position /* string */ = "";
		var currentGame /* Hearts */ = null;
		var playerKey /* string */ = "";
		var cardDivsInHand /* jQuery objects */ = [];
		var selectedCardDivs = [];
		var playedCards = [];
		var playedZIndex = 100;
		var playerHasGone = false;
		var westScore = 0;
		var northScore = 0;
		var eastScore = 0;
		var southScore = 0;
		var westTrickX = 0;
		var northTrickX = 0;
		var eastTrickX = 0;
		var southTrickX = 0;
		var westTrickY = 0;
		var northTrickY = 0;
		var eastTrickY = 0;
		var southTrickY = 0;
	
	// GETTERS
		this.getName = function() /* -> string */ {
			return name;
		};
	
	// MATCH SETUP METHODS
		this.setupMatch = function(match_object, pos) {
			// This method will be called by the HeartsMatch object once in order to provide to your player object a reference to the match object (the first parameter) and the position associated with your player (one of "North", "East", "South", or "West").
			match = match_object;
			position = pos;
		};
		this.setupNextGame = function(next_game, player_key) {
			// This method will be called by the HeartsMatch object just before each hearts game is played. The first parameter will be a reference to the GameOfHearts object that models the hearts game that is about to be played and the second parameter will be your player's "key" which is necessary to retrieve and interact with your player's hand and to execute certain methods on the game object.
			if (currentGame !== null) {
				
			}
			
			westTrickX = 0;
			northTrickX = 0;
			eastTrickX = 0;
			southTrickX = 0;
			westTrickY = 0;
			northTrickY = 0;
			eastTrickY = 0;
			southTrickY = 0;
			
			currentGame = next_game;
			playerKey = player_key;
			// Hearts.ALL_EVENTS | Hearts.GAME_OVER_EVENT | Hearts.GAME_STARTED_EVENT | Hearts.TRICK_START_EVENT | Hearts.TRICK_CONTINUE_EVENT
			// Hearts.TRICK_COMPLETE_EVENT | Hearts.CARD_PLAYED_EVENT | Hearts.PASSING_COMPLETE_EVENT
			$(cardDivsInHand).each(function(num, elem) {
				$(this).unbind();
				$(this).off();
			});
			cardDivsInHand = [];
			selectedCardDivs = [];
			$(".playingMat__card").off();
			$(".playingMat__card").unbind();
			$(".playingMat__card").removeClass("playingMat__card__inactive");
			$(".playingMat__card").removeClass("playingMat__card__active");
			$(".playingMat__card").removeClass("playingMat__card__disabled");
			$(".playingMat__card").addClass("playingMat__card__inactive");
			$(".playingMat__card").css("display", "block");
			$(".playingMat__card").css("z-index", "10");
			$(".playingMat__card").css("left", "360px");
			$(".playingMat__card").css("top", "350px");
			currentGame.registerEventHandler(Hearts.GAME_OVER_EVENT, this.gameOverEvent);
			currentGame.registerEventHandler(Hearts.GAME_STARTED_EVENT, this.gameStartedEvent);
			currentGame.registerEventHandler(Hearts.TRICK_START_EVENT, this.trickStartEvent);
			currentGame.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, this.trickContinueEvent);
			currentGame.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, this.trickCompleteEvent);
			currentGame.registerEventHandler(Hearts.CARD_PLAYED_EVENT, this.cardPlayedEvent);
			currentGame.registerEventHandler(Hearts.PASSING_COMPLETE_EVENT, this.passingCompleteEvent);
		};
		
	// GAME EVENT HANDLERS
		this.gameOverEvent = function(event) {
			// event.event_type
			// event.game
			
			// UPDATE AND DISPLAY SCORES
			westScore += currentGame.getScore(Hearts.WEST);
			northScore += currentGame.getScore(Hearts.NORTH);
			eastScore += currentGame.getScore(Hearts.EAST);
			southScore += currentGame.getScore(Hearts.SOUTH);
			$(".scoreTable__west__score__text").text(westScore);
			$(".scoreTable__north__score__text").text(northScore);
			$(".scoreTable__east__score__text").text(eastScore);
			$(".scoreTable__south__score__text").text(southScore);
			
			if (westScore >= 100 || northScore >= 100 || eastScore >= 100 || southScore >= 100) {
				var min = 200;
				var winner = "Match over, West wins!";
				if (westScore < min) {
					min = westScore;
				}
				if (northScore < min) {
					min = northScore;
					winner = "Match over, North wins!";
				}
				if (eastScore < min) {
					min = eastScore;
					winner = "Match over, East wins!";
				}
				if (southScore < min) {
					min = southScore;
					winner = "Match over, "+$(".scoreTable__south__header__text").text()+" wins!";
				}
				$(".messageBox__text").text(winner);
			}
			
		};
		this.gameStartedEvent = function(event) {
			cardDivsInHand = [];
			$(".playingMat__card").css("display", "none");
			// event.event_type
			// event.game
			// getPassType()	Reports what kind of passing is required. One of Hearts.PASS_LEFT, Hearts.PASS_RIGHT, Hearts.PASS_ACROSS, or Hearts.PASS_NONE
			var passMessage = event.getPassType() === Hearts.PASS_LEFT ? "Select three cards to pass left." :
							  event.getPassType() === Hearts.PASS_RIGHT ? "Select three cards to pass right." :
							  event.getPassType() === Hearts.PASS_ACROSS ? "Select three cards to pass across." :
							  "No cards to pass this game.";
			$(".messageBox__text").text("Beginning of game. " + passMessage);
			
			var hand = currentGame.getHand(playerKey);
			var dealtCards = hand.getDealtCards(playerKey);
			
			// alert("Dealt Cards # = "+dealtCards.length);
			dealtCards.forEach(function (card, num) {
				var suit = card.getSuit();
				var rank = card.getRank();
				cardDivsInHand.push($(".playingMat__card__"+suit+"-"+rank));
				var div = $(".playingMat__card__"+suit+"-"+rank);
				div.associatedCard = card;
				div.removeClass("playingMat__card__disabled");
				div.removeClass("playingMat__card__active");
				div.addClass("playingMat__card__inactive");
				div.css("display", "block");
				
				
				
				div.css("z-index", (50 + suit*100 + rank));
				// console.log("Suit: "+suit+", Rank: "+rank+", suit*100 + rank = "+(suit*100 + rank));
				div.hover(function (inE) {
					if (selectedCardDivs.indexOf(div) > -1) {
						return;
					}
					$(this).addClass("playingMat__card__active");
					$(this).removeClass("playingMat__card__inactive");
					$(this).animate({top: "-=10px"}, 100);
				},
					function (outE) {
					if (selectedCardDivs.indexOf(div) > -1) {
						return;
					}
					$(this).addClass("playingMat__card__inactive");
					$(this).removeClass("playingMat__card__active");
					$(this).animate({top: "+=10px"}, 100);
				});
				div.click(function (e) {
					if (selectedCardDivs.indexOf(div) > -1) {
						$(this).addClass("playingMat__card__inactive");
						$(this).removeClass("playingMat__card__active");
						$(this).animate({top: "+=20px"}, 100);
						selectedCardDivs.splice(selectedCardDivs.indexOf(div), 1);
						$(".messageBox__passButton").remove();
						$(".scoreTable").animate({right: 0}, 80);
					} else {
						if (selectedCardDivs.length > 2) {
							return;
						}
						selectedCardDivs.push(div);
						$(this).addClass("playingMat__card__active");
						$(this).removeClass("playingMat__card__inactive");
						$(this).animate({top: "-=20px"}, 100);
						if (selectedCardDivs.length > 2) {
							$(".messageBox").append(
								$(document.createElement('button'))
									.addClass('messageBox__passButton')
									.text('Pass')
									.click(function() {
										var cards = [];
										selectedCardDivs.forEach(function(div) {
											cards.push(div.associatedCard);
											$(div).off();
											$(div).unbind();
											$(div).removeClass("playingMat__card__inactive");
											$(div).removeClass("playingMat__card__active");
											$(div).removeClass("playingMat__card__disabled");
											$(div).addClass("playingMat__card__inactive");
											$(div).css("display", "block");
											$(div).css("z-index", "10");
											$(div).css("left", "360px");
											$(div).css("top", "350px");
										});
										currentGame.passCards(cards, playerKey);
										$(".scoreTable").animate({right: 0}, 80);
									})
							);
							
							$(".scoreTable").animate({right: 50}, 200);
						}
					}
				});
			});
			
			cardDivsInHand.sort(function(a, b) {
				return $(a).css("z-index") - $(b).css("z-index");
			});
			var firstX = $(".playingMat").width() / 2.0 - $(".playingMat__card").width() * (13 / 2.0 + 0.5) / 2.0;
				
			$(cardDivsInHand).each(function(num, obj) {
				var left = firstX + num * $(this).width() / 2.0;
				var top = 640;
				$(this).animate({left: left, top: top}, 35*num);
			});
					
				
		};
	
		this.trickStartEvent = function(event) {
			$(".playingMat__card").off();
			$(".playingMat__card").unbind();
			
			cardDivsInHand = [];
			// alert("Trick starting with player "+event.getStartPos());
			// event.event_type
			// event.game
			// getStartPos()	Reports which position is expected to play a card in order to start the next trick.
			if (event.getStartPos() === position) {
				$(".messageBox__text").text("Click a card to start the trick.");
			} else {
				$(".messageBox__text").text("New trick started...");
			}
			
			if (true) {
				
				var hand = currentGame.getHand(playerKey);
				
				var unplayedCards = hand.getUnplayedCards(playerKey);
				unplayedCards.forEach(function (card, num) {
					var suit = card.getSuit();
					var rank = card.getRank();
					cardDivsInHand.push($(".playingMat__card__"+suit+"-"+rank));
					var div = $(".playingMat__card__"+suit+"-"+rank);
					div.associatedCard = card;
					div.playable = hand.getPlayableCards(playerKey).indexOf(card) > -1;
					div.css("display", "block");

					if (!div.playable) {
						div.addClass("playingMat__card__disabled");
						div.removeClass("playingMat__card__inactive");
						div.removeClass("playingMat__card__active");
					} else {
						div.addClass("playingMat__card__inactive");
						div.removeClass("playingMat__card__active");
						div.removeClass("playingMat__card__disabled");
					}

					div.css("z-index", (50 + suit*100 + rank));

					div.hover(function (inE) {
						if (!div.playable) {
							$(".messageBox__text").text("Card isn't playable.");
						} else {
							$(".messageBox__text").text("Click to play card.");
							$(this).addClass("playingMat__card__active");
							$(this).removeClass("playingMat__card__inactive");
							$(this).animate({top: "-=10px"}, 100);
						}
					},
						function (outE) {
						$(".messageBox__text").text("Click a card to start the trick.");
						if (div.playable) {
							$(this).addClass("playingMat__card__inactive");
							$(this).removeClass("playingMat__card__active");
							$(this).animate({top: "+=10px"}, 100);
						}
					});

					div.click(function (e) {
						if (div.playable) {
							currentGame.playCard(div.associatedCard, playerKey);
							//$(this).css("display", "none");
						}
					});
				});

				cardDivsInHand.sort(function(a, b) {
					return $(a).css("z-index") - $(b).css("z-index");
				});
				var firstX = $(".playingMat").width() / 2.0 - $(".playingMat__card").width() * (13 / 2.0 + 0.5) / 2.0;

				$(cardDivsInHand).each(function(num, obj) {
					var left = firstX + num * $(this).width() / 2.0;
					var top = 640;
					//$(this).css("background-color", "rgba(157,144,189,0.00)");
					$(this).animate({left: left, top: top}, 35*num, function (){
						//$(this).css("background-color", "rgba(64,51,96,1.00)");
					});
				});
			}
			
		};
	
		this.trickContinueEvent = function(event) {
			$(".playingMat__card").off();
			$(".playingMat__card").unbind();
			cardDivsInHand = [];
			// alert("Trick continuing for player "+event.getNextPos());
			// event.event_type
			// event.game
			// getNextPos()		Reports which position is expected to play a card in order to continue the current trick.
			if (event.getNextPos() === position) {
				$(".messageBox__text").text("Your turn. Click on a card to play.");
				var hand = currentGame.getHand(playerKey);
				
				var unplayedCards = hand.getUnplayedCards(playerKey);
				unplayedCards.forEach(function (card, num) {
					var suit = card.getSuit();
					var rank = card.getRank();
					cardDivsInHand.push($(".playingMat__card__"+suit+"-"+rank));
					var div = $(".playingMat__card__"+suit+"-"+rank);
					div.associatedCard = card;
					div.playable = hand.getPlayableCards(playerKey).indexOf(card) > -1;
					div.css("display", "block");

					if (!div.playable) {
						div.addClass("playingMat__card__disabled");
						div.removeClass("playingMat__card__inactive");
						div.removeClass("playingMat__card__active");
					} else {
						div.addClass("playingMat__card__inactive");
						div.removeClass("playingMat__card__active");
						div.removeClass("playingMat__card__disabled");
					}

					div.css("z-index", (50 + suit*100 + rank));

					div.hover(function (inE) {
						if (!div.playable) {
							$(".messageBox__text").text("Card isn't playable.");
						} else {
							$(".messageBox__text").text("Click to play card.");
							$(this).addClass("playingMat__card__active");
							$(this).removeClass("playingMat__card__inactive");
							$(this).animate({top: "-=10px"}, 100);
						}
					},
						function (outE) {
						$(".messageBox__text").text("Your turn. Click on a card to play.");
						if (div.playable) {
							$(this).addClass("playingMat__card__inactive");
							$(this).removeClass("playingMat__card__active");
							$(this).animate({top: "+=10px"}, 100);
						}
					});

					div.click(function (e) {
						if (div.playable) {
							$(".messageBox__text").text("Card played...trick continuing.");
							currentGame.playCard(div.associatedCard, playerKey);
							//$(this).css("display", "none");
						}
					});
				});

				cardDivsInHand.sort(function(a, b) {
					return $(a).css("z-index") - $(b).css("z-index");
				});
				var firstX = $(".playingMat").width() / 2.0 - $(".playingMat__card").width() * (13 / 2.0 + 0.5) / 2.0;

				$(cardDivsInHand).each(function(num, obj) {
					var left = firstX + num * $(this).width() / 2.0;
					var top = 640;
					//$(this).css("background-color", "rgba(157,144,189,0.00)");
					$(this).animate({left: left, top: top}, 35*num, function (){
						//$(this).css("background-color", "rgba(64,51,96,1.00)");
					});
				});
			} else {
				$(".messageBox__text").text(event.getNextPos()+"'s turn...");
			}
		};
	
		this.trickCompleteEvent = function(event) {
			// event.event_type
			// event.game
			// getTrick()		Returns a Trick object that represents the just completed trick.
			// alert("Trick over!");
			playerHasGone = false;
			
			if (event.getTrick().getWinner() === Hearts.WEST) {
				$(".messageBox__text").text("West won the trick!");
			}
			if (event.getTrick().getWinner() === Hearts.NORTH) {
				$(".messageBox__text").text("North won the trick!");
			}
			if (event.getTrick().getWinner() === Hearts.EAST) {
				$(".messageBox__text").text("East won the trick!");
			}
			if (event.getTrick().getWinner() === Hearts.SOUTH) {
				$(".messageBox__text").text($(".scoreTable__south__header__text").text()+" won the trick!");
			}
			
			var leftX = event.getTrick().getWinner() === Hearts.WEST ? 120 + westTrickX :
						event.getTrick().getWinner() === Hearts.EAST ? 600 + eastTrickX :
						event.getTrick().getWinner() === Hearts.SOUTH ? 465 + southTrickX :
						465 + northTrickX;
			var topY = event.getTrick().getWinner() === Hearts.NORTH ? 180 + northTrickY :
					   event.getTrick().getWinner() === Hearts.SOUTH ? 510 + southTrickY :
					   event.getTrick().getWinner() === Hearts.EAST ? 300 + eastTrickY :
					   300 + westTrickY;
						
			$(playedCards).each(function(num, obj) {
				$(this).animate({left: leftX, top: topY}, 300, function (){
					
				});
				$(this).removeClass("playingMat__card__active");
				$(this).removeClass("playingMat__card__inactive");
				$(this).addClass("playingMat__card__disabled");
			});
			playedCards = [];
			
			$(cardDivsInHand).each(function(num, elem) {
				$(this).unbind();
				$(this).off();
			});
			cardDivsInHand = [];
			
			//alert("trick complete");
			
			if (event.getTrick().getWinner() === Hearts.WEST) {
				westTrickX -= 8;
				westTrickY -= 3;
			}
			if (event.getTrick().getWinner() === Hearts.NORTH) {
				northTrickX += 8;
				northTrickY -= 3;
			}
			if (event.getTrick().getWinner() === Hearts.EAST) {
				eastTrickX += 8;
				eastTrickY -= 3;
			}
			if (event.getTrick().getWinner() === Hearts.SOUTH) {
				southTrickX += 8;
				southTrickY += 3;
			}
			
		};
		this.cardPlayedEvent = function(event) {
			var turn = playedZIndex % 4 + 1;
			
			playedZIndex++;
			// event.event_type
			// event.game
			// getPosition()	Returns the position of the player that played the card.
			// getCard()		Returns the Card object of the card that was played.
			// alert("card played from position"+event.getPosition());
			var card = event.getCard();
			var pos = event.getPosition();
			var suit = card.getSuit();
			var rank = card.getRank();
			// console.log(".playingMat__card__"+suit+"-"+rank);
			var div = $(".playingMat__card__"+suit+"-"+rank);
			div.css("z-index", playedZIndex+"");
			div.css("display", "block");
			// console.log(div);
			playedCards.push(div);
			if (pos === Hearts.EAST) {
				// console.log(pos);
				var topE = 350;
				var leftE = 470;
				div.animate({left: leftE, top: topE}, 100, function (){
				});
				
			} else if (pos === Hearts.NORTH) {
				// console.log(pos);
				var topN = 200;
				var leftN = 360;
				div.animate({left: leftN, top: topN}, 100, function (){
				});
			} else if (pos === Hearts.WEST) {
				// console.log(pos);
				var topW = 350;
				var leftW = 250;
				div.animate({left: leftW, top: topW}, 100, function (){
				});
			} else if (pos === Hearts.SOUTH) {
				// console.log(pos);
				var topS = 490;
				var leftS = 360;
				div.animate({left: leftS, top: topS}, 100, function (){
				});
				playerHasGone = true;
			}
		};
	
		this.passingCompleteEvent = function(event) {
			// event.event_type
			// event.game
			$(".messageBox__passButton").remove();
			selectedCardDivs = [];
			$(".playingMat__card").off();
			$(".playingMat__card").unbind();
			$(".playingMat__card").css("display", "none");
		};
		
};