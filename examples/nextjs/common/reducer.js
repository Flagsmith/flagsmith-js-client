function defaultReducer(
    state = {
        isConnected: true,
    },
    action,
)
{
    if (typeof window === 'undefined') {
        console.log('SERVER', action.type);
    } else {
        // API.log('DISPATCHER', action.type);
    }
    switch (action.type) {
        case Actions.STARTUP_LOADED:
            return { ...state, ...action.data };
        case Actions.CONFIG_LOADED:
            return { ...state, config:action.data };
        default:
            return state;
    }
}

export default (state, action) => {
    return defaultReducer(state, action);
};
