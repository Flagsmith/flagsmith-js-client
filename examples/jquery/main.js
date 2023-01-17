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

function logout () {
    flagsmith.logout();
};
function evaluateConfig () {
    alert(flagsmith.getValue("font_size"));
};
function evaluateFlag () {
    alert(flagsmith.hasFeature("flag")? "true":"false");
};

$("#js-login").on("click", login);
$("#js-evaluate-config").on("click", evaluateConfig);
$("#js-evaluate-flag").on("click", evaluateFlag);
$("#js-logout").on("click", logout);
$("#js-toggle-trait").on("click", toggleTrait);

//Intialise Flagsmith
flagsmith.init({
    environmentID: environmentID,
    cacheFlags: true,
    enableLogs: true,
    enableAnalytics:true,
    cacheOptions: {skipAPI:true,ttl:5000},
    defaultFlags: {
        font_size: {value: 10, enabled:true}
    },
    onChange: function() {
        $("#loaded").removeClass("hidden")
        $("#loading").addClass("hidden")

        if (flagsmith.identity) {
            $("#logged-in").removeClass("hidden")
            $("#logged-out").addClass("hidden")
            $("#js-example-trait").text(flagsmith.getTrait("example_trait") + "");
            if (flagsmith.getSegments()) {
                $("#js-segments").text(Object.keys(flagsmith.getSegments() ).join(", "));
            }
        } else {
            $("#logged-out").removeClass("hidden")
            $("#logged-in").addClass("hidden")
        }
        $("#js-data").text(JSON.stringify(flagsmith.getAllFlags(), null, 2));
    }
});
