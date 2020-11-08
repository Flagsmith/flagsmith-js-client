var environmentID = 'QjgYur4LQTwe5HpvbvhpzK'

$(document).ready(function () {
    //Intialise Bullet Train
    $('.js-special').on('click', function () {
        bulletTrain.identify('flagsmith_sample_user')
    });
    $('.js-random').on('click', function () {
        bulletTrain.identify("random_" + Math.floor(Math.random() * 10))
    });
    bulletTrain.init({
        environmentID: environmentID,
        defaultFlags: {
            font_size: 10
        },
        onChange: function () {
            if (bulletTrain.getValue('hero')) {
                $('#loaded').removeClass('hidden')
                $('#loading').addClass('hidden')
                $('.hero').css({
                    'background': 'url(' + bulletTrain.getValue('hero') + ')',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
            }
        }
    });

})
