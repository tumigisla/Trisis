var blade = {
	wesley : new Audio("sound/Blade-Vampire_Dance_Club_Theme.mp3"),
	isSnipes : true
};

blade.bringTheSnipe = function() {
	if (!this.isSnipes) {
		this.isSnipes = true;
		this.wesley.play();
	}
};

blade.dontCallThisFunctionIfYouWannaHaveFun = function() {
	if (this.isSnipes) {
		this.isSnipes = false;
		this.wesley.pause();
	}
};