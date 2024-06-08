function _tap_volume_update_class(remove_class, add_target_class, add_value) {
    for (const button of document.body.querySelectorAll('button._tap_volume_button')) {
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

function _tap_volume_activate(value) {
    _tap_volume_update_class('_tap_volume_active', '_tap_volume_button_' + value, '_tap_volume_active');
}

function _tap_volume_onChange(e) {
    _tap_volume_activate(e.volume);
}

document.addEventListener('_tap_volume_init', e => {
    const player = document.body.querySelector('div#movie_player');
    _tap_volume_activate(player.getVolume());
    player.addEventListener('onVolumeChange', _tap_volume_onChange);
});

document.addEventListener('_tap_volume', e => {
    const player = document.body.querySelector('div#movie_player');
    if (e.detail === 0) {
        player.mute();
    } else {
        player.setVolume(e.detail);
        player.unMute();
    }
});