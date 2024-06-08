function _tap_volume_remove_class(selector, value) {
    for (const button of document.body.querySelectorAll(selector)) {
        button.classList.remove(value);
    }
}

function _tap_volume_add_class(selector, value) {
    for (const button of document.body.querySelectorAll(selector)) {
        button.classList.add(value);
    }
}

function _tap_volume_activate(value) {
    _tap_volume_remove_class('button._tap_volume_active', '_tap_volume_active');
    _tap_volume_add_class('button._tap_volume_button_' + value, '_tap_volume_active');

    if (!document.body.querySelector('button._tap_volume_active')) {
        _tap_volume_add_class('button._tap_volume_tap', '_tap_volume_active');
    }
}

document.addEventListener('_tap_volume', e => {
    _tap_volume_remove_class('button._tap_volume_tap', '_tap_volume_tap');
    _tap_volume_add_class('button._tap_volume_button_' + e.detail, '_tap_volume_tap');

    const player = document.body.querySelector('div#movie_player');
    if (e.detail === 0) {
        player.mute();
    } else {
        player.setVolume(e.detail);
        player.unMute();
    }
    _tap_volume_activate(player.getVolume());
});

document.addEventListener('_tap_volume_init', e => {
    const player = document.body.querySelector('div#movie_player');
    _tap_volume_activate(player.getVolume());
    player.addEventListener('onVolumeChange', e => {
        _tap_volume_activate(e.volume);
    });
});

document.addEventListener('_tap_volume_update', e => {
    const player = document.body.querySelector('div#movie_player');
    _tap_volume_activate(player.getVolume());
});