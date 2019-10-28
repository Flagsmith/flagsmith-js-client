module.exports = ({
    body,
    method,
    path,
    requestBody = null,
    state = 'Default',
    status = 200,
    uponReceiving,
}) => {
    const interaction = {
        state,
        uponReceiving,
        withRequest: {
            method: method.toUpperCase(),
            path,
        },
        willRespondWith: {
            status,
            body,
        },
    };
    if (requestBody) {
        interaction.withRequest.headers = {
            'Content-Type': 'application/json',
        };

        interaction.willRespondWith.headers = {
            'Content-Type': 'application/json',
        };

        interaction.withRequest.body = requestBody;
    }
    return pact.addInteraction(interaction);
};
