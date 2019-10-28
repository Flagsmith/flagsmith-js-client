module.exports = {
    clearDown(browser, done) {
        done();
    },
    byTestID: id => `[data-test="${id}"]`,
    waitAndSet(id, val) {
        return this.waitForElementVisible(id)
            .setValue(id, val);
    },
    waitAndClick(id) {
        return this.waitForElementVisible(id)
            .click(id);
    },
};
