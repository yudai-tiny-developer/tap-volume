(() => {
    function update_class(remove_class, add_target_class, add_value) {
        if (area) {
            for (const button of area.querySelectorAll('button._tap_volume_button')) {
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
    }

    function activate(value) {
        update_class('_tap_volume_active', '_tap_volume_button_' + value, '_tap_volume_active');
    }

    function onVolumeChange(e) {
        activate(e.volume);
    }

    const app = document.querySelector('ytd-app') ?? document.body; // YouTube.com or Embedded Player

    let player;
    let area;

    document.addEventListener('_tap_volume_loaded', () => {
        player = player ?? document.querySelector('div#movie_player');
        if (player) {
            activate(player.getVolume());
        }
    });

    document.addEventListener('_tap_volume', e => {
        if (player) {
            if (e.detail === 0) {
                player.mute();
            } else {
                player.setVolume(e.detail);
                if (player.isMuted()) {
                    player.unMute();
                }
            }
            setTimeout(() => player.dispatchEvent(new MouseEvent('mouseout')), 500);
        }
    });

    setInterval(() => {
        const player_c = app.querySelector('div#movie_player');
        if (!player_c || player_c === player) {
            return;
        }
        player = player_c;

        area = player.querySelector('span.ytp-volume-area');
        if (!area) {
            return;
        }

        player.addEventListener('onVolumeChange', onVolumeChange);

        document.dispatchEvent(new CustomEvent('_tap_volume_init'));
    }, 1000);
})();