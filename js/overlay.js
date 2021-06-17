var overlay = (function ($) {
    var selectors = {
            window: window,
            overlay: '.overlay'
        },
        classes = {
            active: 'overlay--active'
        },
        settings = {
            progress: {
                point1: 0,
                point2: 0
            },
            duration: 0.4,
            color: '#fff',
            alpha: 1,
            width: 0,
            height: 0,
            max: 350,
            pixelRatio: window.devicePixelRatio > 1 ? 1.6 : 1
        },
        tweens = [],
        active,
        canvas,
        context,
        nodes;

    function show(event, color, alpha) {
        active = true;

        if (color) {
            settings.color = color;
        }

        if (alpha) {
            settings.alpha = alpha;
        }

        tween();
    }

    function hide() {
        active = false;
        tween();
    }

    function tween() {
        // kill tweens
        for (var i in tweens) {
            tweens[i].kill();
            tweens.splice(i, 1);
        }

        // enable overlay
        if (active) {
            nodes.overlay.addClass(classes.active);
        }

        // create tweens

        // point 1
        tweens.push(TweenMax.to(settings.progress, settings.duration * 0.9, {
            point1: active ? 1 : 0,
            ease: Ease.easeOut
        }));

        // point 2, render
        tweens.push(TweenMax.to(settings.progress, settings.duration, {
            point2: active ? 1 : 0,
            onUpdate: throttledRender,
            onComplete: function () {
                if (!active) {
                    nodes.overlay.removeClass(classes.active);
                }
            },
            ease: Ease.easeInOut
        }));
    }

    function setDimensions() {
        canvas.width = nodes.overlay.width() * settings.pixelRatio;

        settings.width = Math.min(canvas.width, settings.max * settings.pixelRatio);
        settings.height = canvas.height = nodes.window.height() * settings.pixelRatio;
    }

    var throttledRender = _.throttle(render, 10);
    function render() {
        context.fillStyle = settings.color;
        context.globalAlpha = settings.alpha;

        // clear the canvas
        context.clearRect(0, 0, settings.width, settings.height);

        var point2 = (settings.progress.point2 * 1.5) - 0.5;

        // draw shape
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(settings.width * settings.progress.point1, 0);
        context.lineTo((settings.width - (60 * settings.pixelRatio)) * point2, settings.height);
        context.lineTo(0, settings.height);
        context.closePath();
        context.fill();
    }

    function clickOverlay(event) {
        var x = event.offsetX * settings.pixelRatio,
            y = event.offsetY * settings.pixelRatio;

        if (!context.isPointInPath(x, y)) {
            $.publish('/closeAll');
        }
    }

    function toggle(event, active, color, alpha) {
        if (active) {
            show(null, color, alpha);
        } else {
            hide();
        }
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            canvas = document.getElementById("overlay");
            context = canvas.getContext('2d');

            setDimensions();

            nodes.window.on('resize', function () {
                setDimensions();
                throttledRender();
            });

            nodes.overlay.on('click', clickOverlay);

            $.subscribe('/overlay/toggle', toggle);
            $.subscribe('/overlay/show', show);
            $.subscribe('/overlay/hide', hide);
        }
    }
})(jQuery);

$(function () {
    overlay.init();
});
