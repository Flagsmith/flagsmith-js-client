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

document.getElementById("js-login").addEventListener("click", login);
document.getElementById("js-logout").addEventListener("click", logout);
document.getElementById("js-toggle-trait").addEventListener("click", toggleTrait);
document.getElementById("js-increment").addEventListener("click", function (){
    increment(1)
});
document.getElementById("js-decrement").addEventListener("click", function (){
    increment(-1)
});

//Intialise Bullet Train
flagsmith.init({
    cacheFlags: true,
    enableLogs: true,
    environmentID: environmentID,
    defaultFlags: {
        font_size: 10
    },
    onChange: function() {
        document.getElementById("loaded").classList.remove("hidden")
        document.getElementById("loading").classList.add("hidden")

        console.log("Received flags", flagsmith.getAllFlags())

        if (flagsmith.identity) {
            document.getElementById("logged-in").classList.remove("hidden")
            document.getElementById("logged-out").classList.add("hidden")
            document.getElementById("js-button-clicks").innerText = flagsmith.getTrait("button_clicks");
            document.getElementById("js-example-trait").innerText = flagsmith.getTrait("example_trait") + "";
        } else {
            document.getElementById("logged-out").classList.remove("hidden")
            document.getElementById("logged-in").classList.add("hidden")
        }
        document.getElementById("js-data").innerText = JSON.stringify(flagsmith.getAllFlags());
    }
});
