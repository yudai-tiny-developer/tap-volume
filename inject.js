(() => {
    function update_class(remove_class, add_target_class, add_value) {
        for (const button of document.getElementsByClassName('_tap_volume_button')) {
            const oldToken = button.classList.contains(remove_class) ? remove_class : undefined;
            const newToken = button.classList.contains(add_target_class) ? add_value : undefined;
            if (oldToken && newToken) {
                button.classList.replace(oldToken, newToken);
            } else if (oldToken) {
                button.classList.remove(oldToken);
            } else if (newToken) {
                button.classList.add(newToken);
            }
        }
    }

    function activate(value) {
        update_class('_tap_volume_active', '_tap_volume_button_' + value, '_tap_volume_active');
    }

    function onVolumeChange(e) {
        if (e.muted) {
            activate(0);
        } else {
            activate(e.volume);
        }
    }

    let player;

    document.addEventListener('_tap_volume_loaded', () => {
        activate(player.getVolume());
    });

    document.addEventListener('_tap_volume', e => {
        if (e.detail === 0) {
            player.mute();
        } else {
            player.setVolume(e.detail);
            if (player.isMuted()) {
                player.unMute();
            }
        }
    });

    const detect_interval = setInterval(() => {
        player = document.getElementById("movie_player");
        if (!player) return;

        clearInterval(detect_interval);

        player.addEventListener('onVolumeChange', onVolumeChange);

        document.dispatchEvent(new CustomEvent('_tap_volume_init'));
    }, 500);
})();