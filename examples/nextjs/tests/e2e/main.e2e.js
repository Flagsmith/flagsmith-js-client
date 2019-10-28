const url = `http://localhost:${process.env.PORT || 3000}`;

module.exports = {
    '[Main Tests] - Register': (browser) => {
        browser
            .url(url) // visit the url
            .waitForElementVisible('.container'); // wait for the sign up fields to show
    },
};
