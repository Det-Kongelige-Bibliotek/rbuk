/*global $*/
var wof = (function () {
    // private vars and functions
    var sinArray60 = [0.000342675, 0.0013704652, 0.0030826663, 0.0054781046, 0.0085551386, 0.0123116594, 0.0167450924, 0.0218523993, 0.0276300796, 0.0340741737, 0.0411802651, 0.0489434837, 0.0573585089, 0.0664195735, 0.0761204675, 0.0864545424, 0.0974147157, 0.1089934758, 0.1211828873, 0.1339745962, 0.1473598356, 0.1613294321, 0.1758738114, 0.1909830056, 0.2066466597, 0.2228540385, 0.2395940344, 0.2568551745, 0.274625629, 0.2928932188, 0.3116454243, 0.3308693936, 0.3505519517, 0.370679609, 0.391238571, 0.4122147477, 0.4335937631, 0.455360965, 0.4775014353, 0.5, 0.5228412397, 0.5460095003, 0.5694889032, 0.5932633569, 0.6173165676, 0.6416320505, 0.6661931408, 0.6909830056, 0.7159846553, 0.7411809549, 0.7665546361, 0.7920883092, 0.8177644745, 0.843565535, 0.8694738078, 0.8954715367, 0.9215409043, 0.9476640438, 0.9738230517, 1];

    var Wof = function (deg, wheel) {
        this.wheel = wheel;
        this.degree = deg;
    };
    
    Wof.prototype = {
        stoppingAreas : [[10,35],[55,80],[100,125],[145,170],[190,215],[235,260],[280,305],[325,350]],
        locations: ['http://www.dr.dk','http://www.kb.dk','http://rex.kb.dk','http://www.youtube.com','http://www.pol.dk','http://www.tv2.dk','http://www.facebook.com','http://www.netflix.com'],
        setWheel : function (wheel) {
            this.wheel = wheel;
        },
        resizeWheel : function () {
            var wheelHeight = $('body').innerHeight() - $('.masthead').height() - $('.mastfoot').height() - $('.cover-heading').height() - $('.cover-button').height();
            wheelHeight = wheelHeight * 0.8; // make it a bit smaller
            var wheelWidth = $('#spinningWheel').width();
            var wheelContainerWidth = $('.wheelContainer').width();
            $('#spinningWheel').css({
                'height': wheelHeight + 'px',
                'width': wheelHeight + 'px',
                'left': Math.floor(wheelContainerWidth / 2) - Math.floor(wheelHeight / 2) 
            });
            $('.wheelContainer').css({
                height: wheelHeight + 'px',
            });
        },
        tickWheel : function (deg) {
            deg = deg || 1;
            wof.degree += deg;
            wof.degree = wof.degree % 360;
            wof.wheel.css('transform', 'rotate(' + wof.degree + 'deg)');
        },
        stepFunctions : {
            attack : function () { // attack sequence
                if (wof.tick >= wof.maxVelocity) {
                    wof.animSequence = 'sustain'; // We have reached max velocity - now engage in sustain sequence
                } else {
                    if (wof.sinIndex + wof.sinIndexStep < sinArray60.length) {
                        wof.tick = wof.maxVelocity * sinArray60[Math.floor(wof.sinIndex += wof.sinIndexStep)];
                    } else {
                        wof.tick = wof.maxVelocity; // if we are off the sin table, velocity should just be = maxVelocity!
                    }
                }
                wof.tickWheel(wof.tick);
                window.requestAnimationFrame(wof.stepFunctions[wof.animSequence]);
            },
            sustain : function () { // sustain sequence
                //if (Math.random() < 0.1) {
                //    wof.animSequence = 'release'; 
                //}
                if (wof.degree > wof.stoppingAreas[wof.slice][0] && wof.degree < wof.stoppingAreas[wof.slice][1]) {
                    wof.animSequence = 'release';
                }
                wof.tickWheel(wof.tick);
                window.requestAnimationFrame(wof.stepFunctions[wof.animSequence]);
            },
            release : function () { // release sequence
                if (wof.tick > 0) {
                    wof.tick -= wof.releaseSpeed;
                    wof.tickWheel(wof.tick);
                    window.requestAnimationFrame(wof.stepFunctions[wof.animSequence]);
                } else {
                    wof.isSpinning = false;
                    location.href = wof.locations[wof.slice];
                }
            }
        },
        startWheel : function (duration, maxVelocity) {
            this.sinIndexStep = 1000 / duration;
            this.animSequence = 'attack';
            this.releaseSpeed = maxVelocity / 60 / 5;
            this.isSpinning = true;
            window.requestAnimationFrame(this.stepFunctions[this.animSequence]);
        },
        animateWheel : function (slice, maxVelocity) {
            this.maxVelocity = maxVelocity;
            this.slice = slice;
            this.velocity = this.tick = 0;
            this.sinIndex = 1;
            this.startWheel(500, maxVelocity);
        }
    };

    return new Wof(0);
})();

$(document).ready(function () {
    wof.setWheel($('#spinningWheel'));
    wof.resizeWheel();
    
    $(window).on('resize', wof.resizeWheel);

    $('.spinWheelButton').click(function (e) {
        e.preventDefault();
        if (!wof.isSpinning) {
            wof.animateWheel(Math.floor(Math.random() * 8), 20);
        }
    });
});

