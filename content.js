import(chrome.runtime.getURL('common.js')).then(common => {
    if (!common.isLiveChat(location.href)) {
        main(document.querySelector('ytd-app') ?? document.body, common);
    }
});

function main(app, common) {
    function loadSettings() {
        chrome.storage.local.get(common.storage, data => {
            settings = data;
            update_buttons();
            update_slider();
            document.dispatchEvent(new CustomEvent('_tap_volume_loaded'));
        });
    }

    function update_buttons() {
        if (settings) {
            update_button(button_v1, settings.v1, common.default_v1, settings.v1_enabled, common.default_v1_enabled);
            update_button(button_v2, settings.v2, common.default_v2, settings.v2_enabled, common.default_v2_enabled);
            update_button(button_v3, settings.v3, common.default_v3, settings.v3_enabled, common.default_v3_enabled);
            update_button(button_v4, settings.v4, common.default_v4, settings.v4_enabled, common.default_v4_enabled);
            update_button(button_v5, settings.v5, common.default_v5, settings.v5_enabled, common.default_v5_enabled);
        }
    }

    function update_button(button, value, default_value, enabled, default_enabled) {
        const detail = common.value(value, default_value);
        button.style.display = common.value(enabled, default_enabled) ? '' : 'none';
        button.classList.add('_tap_volume_button', '_tap_volume_button_' + detail, 'ytp-button');
        if (new_style) {
            button.innerHTML = `<svg width="75%" height="75%" viewBox="0 0 72 72"><text font-size="20" x="35%" y="45%" text-anchor="middle">${detail}%</text></svg>`;
        } else {
            button.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 72 72"><text font-size="20" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">${detail}%</text></svg>`;
        }
        button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: detail }));
        });
    }

    function update_slider() {
        if (settings) {
            document.documentElement.style.setProperty('--tap-volume-slider-display', common.value(settings.hide_slider, common.default_hide_slider) ? 'none' : 'block');
        }
    }

    function create_button() {
        const button = document.createElement('button');
        button.style.display = 'none';
        return button;
    }

    const shortcut_command = command => {
        if (settings) {
            let value;
            switch (command) {
                case 'v1':
                    value = common.value(data.v1, common.default_v1);
                    break;
                case 'v2':
                    value = common.value(data.v2, common.default_v2);
                    break;
                case 'v3':
                    value = common.value(data.v3, common.default_v3);
                    break;
                case 'v4':
                    value = common.value(data.v4, common.default_v4);
                    break;
                case 'v5':
                    value = common.value(data.v5, common.default_v5);
                    break;
                default:
                    return;
            }
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: value }));
        }
    };

    const button_v1 = create_button();
    const button_v2 = create_button();
    const button_v3 = create_button();
    const button_v4 = create_button();
    const button_v5 = create_button();

    let settings;
    let area;
    let panel;
    let new_style;

    chrome.runtime.onMessage.addListener(shortcut_command);

    chrome.storage.onChanged.addListener(loadSettings);

    document.addEventListener('_tap_volume_init', e => {
        const detect_interval = setInterval(() => {
            const player = app.querySelector('div#movie_player');
            if (!player) {
                return;
            }

            area = player.querySelector('div.ytp-right-controls-left'); // new style
            if (!area) {
                area = player.querySelector('span.ytp-volume-area'); // old style
                if (!area) {
                    return;
                } else {
                    new_style = false;
                }
            } else {
                new_style = true;
            }

            if (new_style) {
                panel = area.querySelector('div.ytp-mute-button');
            } else {
                panel = area.querySelector('div.ytp-volume-panel');
            }
            if (!panel) {
                return;
            }

            clearInterval(detect_interval);

            area.insertBefore(button_v5, panel.nextSibling);
            area.insertBefore(button_v4, button_v5);
            area.insertBefore(button_v3, button_v4);
            area.insertBefore(button_v2, button_v3);
            area.insertBefore(button_v1, button_v2);

            loadSettings();
        }, 500);
    });

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}