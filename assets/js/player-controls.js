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
    var classNames = {
        play:         'playing',
        pause:        'paused',
        showBackdrop: 'show-backdrop',
        showModal:    'show-modal',
    }
    var body = document.body;
    var song = audio.item(0);
    var controlsContainer = document.querySelector('.line-up tbody');
    var handlers = [function() {}, onRecord, onPlay, onPause, onStop];
    var mailLink = document.querySelector('.contact a[href^="mailto:"]');
    var scrollPosition = 0;

    if (mailLink) {
        insertModal(classNames);
    }
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
        scrollPosition = window.pageYOffset;
        body.style.top = -scrollPosition + 'px';
        body.classList.add(classNames.showModal, classNames.showBackdrop);
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
        controlsContainer.classList.add(classNames.play);
        controlsContainer.classList.remove(classNames.pause);
    }

    /**
     * @desc    Set pause state.
     */
    function setPauseState() {
        if (currentState === state.STOPPED) {
            controlsContainer.classList.remove(classNames.pause);
        } else {
            currentState = state.PAUSED;
            controlsContainer.classList.add(classNames.pause);
        }
        controlsContainer.classList.remove(classNames.play);
    }

    /**
     * @desc    Set stop state.
     */
    function setStopState() {
        currentState = state.STOPPED;
        setPauseState();
    }

    /**
     * @desc    Insert 'Leave a message' modal.
     * @param   {Object} classNames - Class names
     */
    function insertModal(classNames) {
        var head = document.querySelector('head');
        var stylesheet = getStylesheet();

        stylesheet.addEventListener('load', onLoad, false);
        head.appendChild(stylesheet);

        /**
         * @desc    Get stylesheet element.
         * @returns {HTMLLinkElement} Link element
         */
        function getStylesheet() {
            var stylesheet = document.createElement('link');

            stylesheet.setAttribute('rel', 'stylesheet');
            stylesheet.setAttribute('href', 'assets/css/player-controls.css');
            return stylesheet;
        }

        /**
         * @desc    Handle stylesheet being loaded.
         */
        function onLoad() {
            var backdrop = getBackdrop();

            backdrop.addEventListener('click', close, false);
            body.appendChild(backdrop);
            body.appendChild(getAnsweringMachine());
        }

        /**
         * @desc    Follow mailto link.
         */
        function leaveMessage() {
            close();
            location.href = mailLink.href;
        }

        /**
         * @desc    Close modal.
         */
        function close() {
            body.classList.remove(classNames.showModal, classNames.showBackdrop);
            window.scrollTo(0, scrollPosition);
            body.style.top = 0;
        }

        /**
         * @desc    Get backdrop element.
         * @returns {HTMLDivElement} Div element
         */
        function getBackdrop() {
            var backdrop = document.createElement('div');

            backdrop.classList.add('backdrop');
            return backdrop;
        }

        /**
         * @desc    Get answering machine element.
         * @returns {HTMLElement} Section element
         */
        function getAnsweringMachine() {
            var answeringMachine = document.createElement('section');

            answeringMachine.classList.add('answering-machine');
            answeringMachine.appendChild(getModal());
            return answeringMachine;
        }

        /**
         * @desc    Get modal element.
         * @returns {HTMLDivElement} Div element
         */
        function getModal() {
            var modal = document.createElement('div');
            var cancelButton = getButton('cancel');
            var okButton = getButton('ok');

            modal.classList.add('modal');
            modal.appendChild(getRecordIcon());
            modal.appendChild(getHeader());
            cancelButton.addEventListener('click', close, false);
            okButton.addEventListener('click', leaveMessage, false);
            modal.appendChild(cancelButton);
            modal.appendChild(okButton);
            return modal;
        }

        /**
         * @desc    Get record icon element.
         * @returns {SVGElement} Svg element
         */
        function getRecordIcon() {
            var svg = document.querySelector('.line-up tbody tr:first-child svg');

            return svg.cloneNode(true);
        }

        /**
         * @desc    Get header element.
         * @returns {HTMLHeadingElement} H2 element
         */
        function getHeader() {
            var header = document.createElement('h2');

            header.appendChild(document.createTextNode('Please leave an email'));
            header.appendChild(document.createElement('br'));
            header.appendChild(document.createTextNode(' after this note…'));
            return header;
        }

        /**
         * @desc    Get button element.
         * @returns {HTMLButtonElement} Button element
         */
        function getButton(type) {
            var data = {
                cancel: {
                    className: 'cancel',
                    label:     'Cancel',
                },
                ok: {
                    className: 'ok',
                    label:     'OK',
                },
            }[type];
            var button = document.createElement('button');

            button.setAttribute('type', 'button');
            button.classList.add(data.className);
            button.appendChild(document.createTextNode(data.label));
            return button;
        }
    }
}();