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
        document.querySelectorAll('span._tap_volume_button').forEach(b => b.remove());
        apply_settings(true);
    });

    function apply_settings(force = false) {
        chrome.storage.local.get(common.storage, data => {
            create_buttons(data, force);
            set_slider_display(data);
        });
    }

    function create_buttons(data, force) {
        const area = document.querySelector('span.ytp-volume-area');
        if (area && (force || !area.getAttribute('_tap_volume'))) {
            area.setAttribute('_tap_volume', true);
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
        button.title = value + '%';
        button.innerText = button.title;
        button.classList.add('_tap_volume_button', 'ytp-button');
        button.setAttribute('tabindex', '-1');
        button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('_tap_volume', { detail: value }));
            button.blur();
        });

        const span = document.createElement('span');
        span.classList.add('_tap_volume_button', 'ytp-button');
        span.appendChild(button);

        area.insertBefore(span, panel);
    }

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}