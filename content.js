import(chrome.runtime.getURL('common.js')).then(common => {
    if (!common.isLiveChat(location.href)) {
        main(document.querySelector('ytd-app') ?? document.body, common);
    }
});

function main(app, common) {
    function loadSettings() {
        chrome.storage.local.get(common.storage, data => {
            create_buttons(data);
            set_slider_display(data);
            document.dispatchEvent(new CustomEvent('_tap_volume_loaded'));
        });
    }

    function create_buttons(data) {
        const area = app.querySelector('span.ytp-volume-area');
        if (area) {
            area.querySelectorAll('button._tap_volume_button').forEach(b => b.remove());
            const panel = area.querySelector('div.ytp-volume-panel');

            if (common.value(data.v1_enabled, common.default_v1_enabled)) { create_button(common.value(data.v1, common.default_v1), area, panel); }
            if (common.value(data.v2_enabled, common.default_v2_enabled)) { create_button(common.value(data.v2, common.default_v2), area, panel); }
            if (common.value(data.v3_enabled, common.default_v3_enabled)) { create_button(common.value(data.v3, common.default_v3), area, panel); }
            if (common.value(data.v4_enabled, common.default_v4_enabled)) { create_button(common.value(data.v4, common.default_v4), area, panel); }
            if (common.value(data.v5_enabled, common.default_v5_enabled)) { create_button(common.value(data.v5, common.default_v5), area, panel); }
        }
    }

    function set_slider_display(data) {
        if (common.value(data.hide_slider, common.default_hide_slider)) {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'none');
        } else {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'block');
        }
    }

    function create_button(value, area, panel) {
        const button = document.createElement('button');
        button.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 72 72"><text font-size="20" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${value}%</text></svg>`;
        button.classList.add('_tap_volume_button', '_tap_volume_button_' + value, 'ytp-button');
        button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: value }));
            button.blur();
        });
        area.insertBefore(button, panel);
    }

    document.addEventListener('_tap_volume_init', e => {
        new MutationObserver((mutations, observer) => {
            if (app.querySelector('span.ytp-volume-area')) {
                loadSettings();
            }
        }).observe(app, { childList: true, subtree: true });
        loadSettings();
    });

    chrome.storage.onChanged.addListener(() => {
        loadSettings();
    });

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}