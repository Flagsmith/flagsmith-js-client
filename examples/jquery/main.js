var environmentID = 'uCDQzKWgejrutqSYYsKWen'

function identify() {
    bulletTrain.identify("bullet_train_sample_user")
}

function toggleTrait () {
    bulletTrain.setTrait('example_trait', "Some value " + Math.floor(Math.random() * 10)+"");
}

function login () {
    bulletTrain.identify("bullet_train_sample_user");
};

function logout () {
    bulletTrain.logout();
};

function increment (value) {
    bulletTrain.incrementTrait("button_clicks", value)
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
bulletTrain.init({
    environmentID: environmentID,
    cacheFlags: true,
    enableLogs: true,
    defaultFlags: {
        font_size: 10
    },
    onChange: function() {
        $("#loaded").removeClass("hidden")
        $("#loading").addClass("hidden")

        if (bulletTrain.identity) {
            $("#logged-in").removeClass("hidden")
            $("#logged-out").addClass("hidden")
            $("#js-button-clicks").text(bulletTrain.getTrait("button_clicks"));
            $("#js-example-trait").text(bulletTrain.getTrait("example_trait") + "");
            if (bulletTrain.getSegments()) {
                $("#js-segments").text(Object.keys(bulletTrain.getSegments() ).join(", "));
            }
        } else {
            $("#logged-out").removeClass("hidden")
            $("#logged-in").addClass("hidden")
        }
        $("#js-data").text(JSON.stringify(bulletTrain.getAllFlags(), null, 2));
    }
});
