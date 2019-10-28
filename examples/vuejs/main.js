var data = {
        has_loaded: false,
        instant_messaging: false,
        font_size: 12
    },
    vm = new Vue({
        el: '#app',
        data
    }),
    environmentID = "QjgYur4LQTwe5HpvbvhpzK",
    handleFlags = function () {
        data.has_loaded = true;
        data.instant_messaging = bulletTrain.hasFeature("instant_messaging");
        data.font_size = bulletTrain.getValue("font_size");
        console.log("Received flags", bulletTrain.getAllFlags())
    };

bulletTrain.init({
    environmentID: environmentID,
    onChange: handleFlags
});

