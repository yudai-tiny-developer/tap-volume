import(chrome.runtime.getURL('common.js')).then(common => {
    if (!common.isLiveChat(location.href)) {
        main(document.querySelector('ytd-app') ?? document.body, common);
    }
});

function main(app, common) {
    function applySettings(force) {
        if (settings) {
            update_buttons(settings, force);
            update_slider(settings);
            update_shortcut_command(settings);
            document.dispatchEvent(new CustomEvent('_tap_volume_loaded'));
        } else {
            loadSettings();
        }
    }

    function loadSettings() {
        chrome.storage.local.get(common.storage, data => {
            settings = data;
            applySettings(true);
        });
    }

    function update_buttons(data, force) {
        const area = app.querySelector('span.ytp-volume-area');
        if (area) {
            const buttons = area.querySelectorAll('button._tap_volume_button');
            if (buttons.length === 0 || force) {
                const buttonsSet = new Set(buttons);

                let panel = area.querySelector('button.ytp-settings-button');
                panel = update_button(data.v5, common.default_v5, area, panel, data.v5_enabled, common.default_v5_enabled); buttonsSet.delete(panel);
                panel = update_button(data.v4, common.default_v4, area, panel, data.v4_enabled, common.default_v4_enabled); buttonsSet.delete(panel);
                panel = update_button(data.v3, common.default_v3, area, panel, data.v3_enabled, common.default_v3_enabled); buttonsSet.delete(panel);
                panel = update_button(data.v2, common.default_v2, area, panel, data.v2_enabled, common.default_v2_enabled); buttonsSet.delete(panel);
                panel = update_button(data.v1, common.default_v1, area, panel, data.v1_enabled, common.default_v1_enabled); buttonsSet.delete(panel);

                for (const button of buttonsSet) {
                    button.remove();
                }
            }
        }
    }

    function update_slider(data) {
        if (common.value(data.hide_slider, common.default_hide_slider)) {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'none');
        } else {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'block');
        }
    }

    function update_button(data, default_value, area, panel, enabled, default_enabled) {
        const value = common.value(data, default_value);
        const button = area.querySelector('button._tap_volume_button_' + value) ?? create_button(common.value(data, default_value), area, panel);
        button.style.display = common.value(enabled, default_enabled) ? '' : 'none';
        return button;
    }

    function create_button(value, area, panel) {
        const button = document.createElement('button');
        button.style.display = 'none';
        button.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 72 72"><text font-size="20" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${value}%</text></svg>`;
        button.classList.add('_tap_volume_button', '_tap_volume_button_' + value, 'ytp-button');
        button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: value }));
        });
        area.insertBefore(button, panel);
        return button;
    }

    function update_shortcut_command(data) {
        shortcut_command = command => {
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
        };
    }

    let settings;
    let observer;
    let shortcut_command;

    document.addEventListener('_tap_volume_init', e => {
        loadSettings();
        observer?.disconnect();
        observer = new MutationObserver(() => applySettings());
        observer.observe(app, { childList: true, subtree: true });
    });

    chrome.storage.onChanged.addListener(() => {
        loadSettings();
    });

    chrome.runtime.onMessage.addListener(command => {
        shortcut_command(command);
    });

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}