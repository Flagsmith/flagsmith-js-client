const BaseConstants = {
    'STARTUP'           : 'STARTUP',
    'STARTUP_LOADED'    : 'STARTUP_LOADED',
    'STARTUP_ERROR'     : 'STARTUP_ERROR',
    'CONFIG_LOADED'    : 'CONFIG_LOADED',
};

const BaseActions = {
    // STARTUP
    startup(data, callbacks) {
        return {
            type: Actions.STARTUP,
            data,
            ...callbacks,
        };
    },
    configLoaded(data) {
        return {
            type: Actions.CONFIG_LOADED,
            data,
        };
    },
};

global.Actions = Object.assign({}, BaseConstants, {

});

global.AppActions = Object.assign({}, BaseActions, {
});
