void function() {
	var audio = document.querySelectorAll('audio');
	var song = audio.item(0);

	if (audio.length !== 1 || !(song.closest && song.matches && song.classList && Array.prototype.find)) {
		return;
	}

	var state = {
		PLAYING: 1,
		PAUSED:  2,
		STOPPED: 3,
	};
	var currentState = 0;
	var className = {
		play:  'playing',
		pause: 'paused',
	}
	var song = audio.item(0);
	var controlsContainer = document.querySelector('.line-up tbody');
	var handlers = [function() {}, onRecord, onPlay, onPause, onStop];

	song.addEventListener('play', setPlayState, false);
	song.addEventListener('playing', setPlayState, false);
	song.addEventListener('pause', setPauseState, false);
	song.addEventListener('ended', setStopState, false);
	controlsContainer.addEventListener('click', onClick, false);
	controlsContainer.classList.add('is-js-enhanced');

	/**
	 * @desc    Handle clicks on the line-up icons.
	 * @param   {Event} event - Event data
	 */
	function onClick(event) {
		var target = event.target.closest('th');
		var parent = target && target.matches('th') ? target.parentElement : null;

		if (parent) {
			(handlers.find(matchElement) || handlers[0])(event);
		}

		/**
		 * @desc    Check whether parent matches the given handler.
		 * @param   {Function} handler - Event handler
		 * @param   {number}   n       - Index
		 * @returns {boolean}            Whether parent matches the given handler
		 */
		function matchElement(handler, n) {
			return parent.matches('tr:nth-child(' + n + ')');
		}
	}

	/**
	 * @desc    Handle clicking the record control.
	 */
	function onRecord() {
		var mailLink = document.querySelector('.contact a[href^="mailto:"]');
		var msg = '"Please leave an email after this note…"';

		if (mailLink && confirm(msg)) {
			location.href = mailLink.href;
		}
	}

	/**
	 * @desc    Handle clicking the play control.
	 */
	function onPlay() {
		song.play();
	}

	/**
	 * @desc    Handle clicking the pause control.
	 */
	function onPause() {
		if (song.paused) {
			if (currentState === state.PAUSED) {
				song.play();
			}
		} else {
			song.pause();
		}
	}

	/**
	 * @desc    Handle clicking the stop control.
	 */
	function onStop() {
		setStopState();
		song.pause();
		song.currentTime = 0;
	}

	/**
	 * @desc    Set play state.
	 */
	function setPlayState() {
		currentState = state.PLAYING;
		controlsContainer.classList.add(className.play);
		controlsContainer.classList.remove(className.pause);
	}

	/**
	 * @desc    Set pause state.
	 */
	function setPauseState() {
		if (currentState === state.STOPPED) {
			controlsContainer.classList.remove(className.pause);
		} else {
			currentState = state.PAUSED;
			controlsContainer.classList.add(className.pause);
		}
		controlsContainer.classList.remove(className.play);
	}

	/**
	 * @desc    Set stop state.
	 */
	function setStopState() {
		currentState = state.STOPPED;
		setPauseState();
	}
}();