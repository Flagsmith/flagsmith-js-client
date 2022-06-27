var environmentID = 'QjgYur4LQTwe5HpvbvhpzK'
var flagsmithIdentity = "flagsmith_sample_user2"

//Identify the user
dtrum.identifyUser(flagsmithIdentity)

function identify() {
    flagsmith.identify(flagsmithIdentity)
}

function toggleTrait () {
    flagsmith.setTrait('example_trait', "Some value " + Math.floor(Math.random() * 10)+"");
}

function login () {
    flagsmith.identify(flagsmithIdentity);
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
    //specifying dtrum tells flagsmith to set session properties (see console)
    enableDynatrace: true,
    defaultFlags: {
        font_size: 10
    },
    onChange: function() {
        $("#loaded").removeClass("hidden")
        $("#loading").addClass("hidden")

        if (flagsmith.identity) {
            $("#logged-in").removeClass("hidden")
            $("#logged-out").addClass("hidden")
            $("#js-example-trait").text(flagsmith.getTrait("favourite_color") + "");
        } else {
            $("#logged-out").removeClass("hidden")
            $("#logged-in").addClass("hidden")
        }
        $("#js-data").html(Object.keys(flagsmith.getAllFlags()).map((key)=>{
            return `<h3>${key}</h3>
${flagsmith.hasFeature(key)?`<span class="text-success">Enabled</span>`: `<span class="text-danger">Disabled</span>`}
${flagsmith.getValue(key) ? `<strong><br/>${flagsmith.getValue(key)}</strong><br/>` : ''}

`
        }).join("<br/>"), null, 2);
    }
});
