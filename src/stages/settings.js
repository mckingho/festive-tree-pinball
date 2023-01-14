import settings from './settings.json' assert { type: "json" };

function getConfig(stage) {
    const stageKey = settings.index[stage];
    return { ...settings.config['general'], ...settings.config[stageKey] };
}

export {
    getConfig,
}
