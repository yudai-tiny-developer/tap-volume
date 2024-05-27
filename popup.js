import(chrome.runtime.getURL('common.js')).then(common =>
    import(chrome.runtime.getURL('settings.js')).then(settings =>
        import(chrome.runtime.getURL('progress.js')).then(progress =>
            chrome.storage.local.get(common.storage, data =>
                main(common, settings, progress, data)
            )
        )
    )
);

function main(common, settings, progress, data) {
    const row_class = 'row';
    const cell_class = 'cell';
    const toggle_class = 'toggle';
    const label_class = 'switch';
    const input_class = 'rate';
    const progress_class = 'progress';
    const done_class = 'done';

    const container = document.querySelector('div#container');
    const reset_button = document.querySelector('input#reset');
    const progress_div = document.querySelector('div#reset_progress');

    {
        const row = settings.createRow(row_class);
        row.appendChild(settings.createLabel(cell_class, 'Volume'));
        row.appendChild(settings.createNumberStepInput(cell_class, input_class, 'v1', data.v1, common.default_v1, common.min_volume, common.max_volume, common.step_volume, common.limitValue));
        container.appendChild(row);
    } {
        const row = settings.createRow(row_class);
        row.appendChild(settings.createLabel(cell_class, ''));
        row.appendChild(settings.createNumberStepInput(cell_class, input_class, 'v2', data.v2, common.default_v2, common.min_volume, common.max_volume, common.step_volume, common.limitValue));
        container.appendChild(row);
    } {
        const row = settings.createRow(row_class);
        row.appendChild(settings.createLabel(cell_class, ''));
        row.appendChild(settings.createNumberStepInput(cell_class, input_class, 'v3', data.v3, common.default_v3, common.min_volume, common.max_volume, common.step_volume, common.limitValue));
        container.appendChild(row);
    } {
        const row = settings.createRow(row_class);
        row.appendChild(settings.createLabel(cell_class, ''));
        row.appendChild(settings.createNumberStepInput(cell_class, input_class, 'v4', data.v4, common.default_v4, common.min_volume, common.max_volume, common.step_volume, common.limitValue));
        container.appendChild(row);
    }

    settings.registerResetButton(reset_button, progress_div, progress_class, done_class, toggle_class, input_class, progress);
}