document.addEventListener('_tap_volume', e => {
    const player = document.body.querySelector('div#movie_player');
    if (e.detail === 0) {
        player.mute();
    } else {
        player.setVolume(e.detail);
        player.unMute();
    }
});