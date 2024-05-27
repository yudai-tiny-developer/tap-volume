import(chrome.runtime.getURL('common.js')).then(common =>
    main(common)
);

function main(common) {
    new MutationObserver((mutations, observer) => {
        for (const m of mutations) {
            if (m.target.nodeName === 'DIV' && m.target.id === 'container' && m.target.classList.contains('ytd-player')) {
                create_volume_buttons();
                return;
            }
        }
    }).observe(document, {
        childList: true,
        subtree: true,
    });

    if (document.querySelector('div#container.ytd-player')) {
        create_volume_buttons();
    }

    chrome.storage.onChanged.addListener(() => {
        document.querySelectorAll('button._tap_volume_button').forEach(b => b.remove());
        create_volume_buttons(true);
    });

    function create_volume_buttons(force = false) {
        const volume_area = document.querySelector('span.ytp-volume-area');
        if (volume_area && (force || !volume_area.getAttribute('_tap_volume'))) {
            volume_area.setAttribute('_tap_volume', true);
            const panel = volume_area.querySelector('div.ytp-volume-panel');
            chrome.storage.local.get(common.storage, data => {
                create_volume_button(data.v1 === undefined ? common.default_v1 : data.v1, volume_area, panel);
                create_volume_button(data.v2 === undefined ? common.default_v2 : data.v2, volume_area, panel);
                create_volume_button(data.v3 === undefined ? common.default_v3 : data.v3, volume_area, panel);
                create_volume_button(data.v4 === undefined ? common.default_v4 : data.v4, volume_area, panel);
            });
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