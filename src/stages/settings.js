import settings from './settings.json' assert { type: "json" };

function getConfig(stage) {
    const stageKey = settings.index[stage];
    return { ...settings.config['general'], ...settings.config[stageKey] };
}

function getIndices() {
    return settings.index;
}

export {
    getConfig,
    getIndices,
}
