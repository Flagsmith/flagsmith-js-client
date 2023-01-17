var environmentID = 'QjgYur4LQTwe5HpvbvhpzK'

function identify() {
    flagsmith.identify("flagsmith_sample_user")
}

function toggleTrait () {
    flagsmith.setTrait('example_trait', "Some value " + Math.floor(Math.random() * 10)+"");
}

function login () {
    flagsmith.identify("flagsmith_sample_user");
};

function loginWithTraits () {
    flagsmith.identify("flagsmith_sample_user", {button_clicks:99});
};

function logout () {
    flagsmith.logout();
};

document.getElementById("js-login").addEventListener("click", login);
document.getElementById("js-login-with-traits").addEventListener("click", loginWithTraits);
document.getElementById("js-logout").addEventListener("click", logout);
document.getElementById("js-toggle-trait").addEventListener("click", toggleTrait);

//Intialise Flagsmith
flagsmith.init({
    cacheFlags: true,
    enableLogs: true,
    enableAnalytics:true,
    environmentID: environmentID,
    defaultFlags: {
        font_size: { value:10, enabled:true }
    },
    onChange: function() {
        document.getElementById("loaded").classList.remove("hidden")
        document.getElementById("loading").classList.add("hidden")

        console.log("Received flags", flagsmith.getAllFlags())

        if (flagsmith.identity) {
            document.getElementById("logged-in").classList.remove("hidden")
            document.getElementById("logged-out").classList.add("hidden")
            document.getElementById("js-example-trait").innerText = flagsmith.getTrait("example_trait") + "";
        } else {
            document.getElementById("logged-out").classList.remove("hidden")
            document.getElementById("logged-in").classList.add("hidden")
        }
        document.getElementById("js-data").innerText = JSON.stringify(flagsmith.getAllFlags());
    }
});
