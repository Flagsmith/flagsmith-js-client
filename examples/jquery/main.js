var environmentID = 'uCDQzKWgejrutqSYYsKWen'

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

function increment (value) {
    flagsmith.incrementTrait("button_clicks", value)
};

$("#js-login").on("click", login);
$("#js-logout").on("click", logout);
$("#js-toggle-trait").on("click", toggleTrait);
$("#js-increment").on("click", function (){
    increment(1)
});
$("#js-decrement").on("click", function (){
    increment(-1)
});

//Intialise Bullet Train
flagsmith.init({
    environmentID: environmentID,
    cacheFlags: true,
    enableLogs: true,
    defaultFlags: {
        font_size: 10
    },
    onChange: function() {
        $("#loaded").removeClass("hidden")
        $("#loading").addClass("hidden")

        if (flagsmith.identity) {
            $("#logged-in").removeClass("hidden")
            $("#logged-out").addClass("hidden")
            $("#js-button-clicks").text(flagsmith.getTrait("button_clicks"));
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
