var points = (function ($) {
    return {
        start: function () {
            nodes = utils.createNodes(selectors);

            setupCanvas();

            setupEvents();
        }
    }
})(jQuery);
