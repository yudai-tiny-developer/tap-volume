import(chrome.runtime.getURL('common.js')).then(common =>
    main(common)
);

function main(common) {
    new MutationObserver((mutations, observer) => {
        for (const m of mutations) {
            if (m.target.nodeName === 'DIV' && m.target.id === 'container' && m.target.classList.contains('ytd-player')) {
                apply_settings();
                return;
            }
        }
    }).observe(document, {
        childList: true,
        subtree: true,
    });

    if (document.querySelector('div#container.ytd-player')) {
        apply_settings();
    }

    chrome.storage.onChanged.addListener(() => {
        document.querySelectorAll('button._tap_volume_button').forEach(b => b.remove());
        apply_settings(true);
    });

    function apply_settings(force = false) {
        chrome.storage.local.get(common.storage, data => {
            create_volume_buttons(data, force);
            set_slider_display(data);
        });
    }

    function create_volume_buttons(data, force) {
        const volume_area = document.querySelector('span.ytp-volume-area');
        if (volume_area && (force || !volume_area.getAttribute('_tap_volume'))) {
            volume_area.setAttribute('_tap_volume', true);
            const panel = volume_area.querySelector('div.ytp-volume-panel');

            if (common.value(data.v1_enabled, common.default_v1_enabled)) { create_volume_button(common.value(data.v1, common.default_v1), volume_area, panel); }
            if (common.value(data.v2_enabled, common.default_v2_enabled)) { create_volume_button(common.value(data.v2, common.default_v2), volume_area, panel); }
            if (common.value(data.v3_enabled, common.default_v3_enabled)) { create_volume_button(common.value(data.v3, common.default_v3), volume_area, panel); }
            if (common.value(data.v4_enabled, common.default_v4_enabled)) { create_volume_button(common.value(data.v4, common.default_v4), volume_area, panel); }
            if (common.value(data.v5_enabled, common.default_v5_enabled)) { create_volume_button(common.value(data.v5, common.default_v5), volume_area, panel); }
        }
    }

    function set_slider_display(data) {
        if (common.value(data.hide_slider, common.default_hide_slider)) {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'none');
        } else {
            document.documentElement.style.setProperty('--tap-volume-slider-display', 'block');
        }
    }

    function create_volume_button(volume, volume_area, panel) {
        const volume_button = document.createElement('button');
        volume_button.title = volume + '%';
        volume_button.innerText = volume_button.title;
        volume_button.classList.add('_tap_volume_button', 'ytp-button');
        volume_button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: volume }));
        });
        volume_area.insertBefore(volume_button, panel);
    }

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}