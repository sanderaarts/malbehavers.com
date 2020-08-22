void function() {
    var body = document.body;

    if (!(body.matches && body.classList && body.insertAdjacentElement)) {
        return;
    }

    var hideAttribute = 'data-hide';
    var hasVideoClassName = 'has-video';
    var youtubeReady = false;
    var videos = {
        youtube: {
            elements: {},
            initIds:  [],
            players:  {},
        },
    };

    document.querySelectorAll('[data-youtube-id]').forEach(initVideo);

    /**
     * @desc    Initialize video.
     * @param   {HTMLElement} element - Element to swap video with
     */
    function initVideo(element) {
        var poster = element.matches('img') ? element : element.querySelector('img');
        var youtubeId = element.getAttribute('data-youtube-id');

        if (!poster || !youtubeId) {
            return;
        }

        var stylesheet = document.createElement('link');

        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('href', 'assets/css/video.css');
        document.querySelector('head').appendChild(stylesheet);
        element.classList.add(hasVideoClassName);
        element.setAttribute('title', 'Play video');
        poster.insertAdjacentElement('afterend', document.querySelector('.play-icon').cloneNode(true));
        poster.addEventListener('click', onClick, false);
        poster.tabIndex = 0;

        /**
         * @desc    Handle clicking the postef.
         * @param   {Event} event - Event data
         */
        function onClick(event) {
            if (event.target === poster) {
                swapToYoutubeVideo(element, getYoutubeVideo(youtubeId, startYoutubePlayer));
            }
        }

        /**
         * @desc    (Re)start YouTube player.
         * @param   {string} id - Id
         */
        function startYoutubePlayer(id) {
            var player = videos.youtube.players[id];

            if (!player) {
                player = new YT.Player(id, {
                    events: {
                        onReady:       onReady,
                        onStateChange: onStateChange,
                    },
                });
                videos.youtube.players[id] = player;
            } else {
                player.playVideo();
            }

            /**
             * @desc    Handle player being ready.
             * @param   {Event} event - Event data
             */
            function onReady(event) {
                player.playVideo();
            }

            /**
             * @desc    Handle state changes.
             * @param   {Event} event - Event data
             */
            function onStateChange(event) {
                var iframe = videos.youtube.elements[id];

                if (event.data === YT.PlayerState.ENDED) {
                    element.removeAttribute(hideAttribute);
                    iframe.setAttribute(hideAttribute, '');
                    player.stopVideo();
                }
            }
        }
    }

    /**
     * @desc    Get YouTube video element.
     * @param   {string}   videoId            - Video id
     * @param   {Function} startYoutubePlayer - Callback to (re)start TouTube player
     */
    function getYoutubeVideo(videoId, startYoutubePlayer) {
        var id = 'youtube-' + videoId;
        var iframe = videos.youtube.elements[id];

        if (iframe) {
            startYoutubePlayer(id);
            return iframe;
        }
        if (!window.onYouTubeIframeAPIReady) {
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            insertYoutubeApiScript();
        }

        var origin = location.origin && location.origin !== 'null' ? location.origin : (location.protocol + '//' + location.hostname);

        iframe = document.createElement('iframe');
        iframe.setAttribute('id', id);
        iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&enablejsapi=1&color=white&rel=0&origin=' + origin);
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        videos.youtube.elements[id] = iframe;
        if (youtubeReady) {
            startYoutubePlayer(id);
        } else {
            videos.youtube.initIds.push(id);
        }
        return iframe;

        /**
         * @desc    Insert YouTube iframe API script.
         */
        function insertYoutubeApiScript() {
            var script = document.createElement('script');

            script.setAttribute('src', 'https://www.youtube.com/iframe_api');
            body.appendChild(script);
        }

        /**
         * @desc    Handle YouTube iframe API being ready.
         */
        function onYouTubeIframeAPIReady() {
            youtubeReady = true;
            videos.youtube.initIds.forEach(startYoutubePlayer);
        }
    }

    /**
     * @desc    Swap to YouTube video.
     * @param   {HTMLElement}       element - Element
     * @param   {HTMLIFrameElement} video   - Video iframe
     */
    function swapToYoutubeVideo(element, video) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;

        video.style = 'width:' + (width ? width + 'px;' : '100%;') + 'height:' + (height ? height + 'px;' : 'auto;');
        if (!video.parentNode) {
            video.className = element.className;
            video.classList.remove(hasVideoClassName);
            element.insertAdjacentElement('afterend', video);
        } else {
            video.removeAttribute(hideAttribute);
        }
        element.setAttribute(hideAttribute, '');
    }
}();