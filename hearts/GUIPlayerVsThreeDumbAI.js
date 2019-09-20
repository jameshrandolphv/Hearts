$(document).ready(function() {
	"use strict";
	
	$(".nameInput__button").click(function(e) {
		e.preventDefault;
		var westPlayer /* DumbAI */ = new DumbAI("Amy");
		var northPlayer /* DumbAI */ = new DumbAI("Bill");
		var eastPlayer /* DumbAI */ = new DumbAI("Cat");
		var name /* string */ = $(".nameInput__input").val() !== "" ? $(".nameInput__input").val() : "You";
		
		var southPlayer /* GUIPlayer */ = new GUIPlayer(name);

		var match /* HeartsMatch */ = new HeartsMatch(northPlayer, eastPlayer, southPlayer, westPlayer);

		match.run();
		$(".nameInput").css("display", "none");
		if (name.length > 5) {
			name = name.substring(0, 5) + "...";
		}
		$(".scoreTable__south__header__text").text(name);
	});
	
});