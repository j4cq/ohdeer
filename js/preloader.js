var preloader = (function ($) {
    var selectors = {
            preloader: '.preloader'
        },
        classes = {
            complete: 'preloader--complete'
        },
        nodes;

    function complete() {
        window.setTimeout(function () {
            nodes.preloader.addClass(classes.complete);

            window.setTimeout(function () {
                nodes.preloader.remove();
            }, 500);
        }, 500);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            // $(window).on('load', complete);
            $.subscribe('/ready', complete);
        }
    }
})(jQuery);

$(function () {
    preloader.init();
});
