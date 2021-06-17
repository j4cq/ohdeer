var utils = (function ($) {
    var $window = $(window);

    function isMobile() {
        return $window.width() < (40 * 16) || /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile/i.test(navigator.userAgent);
    }

    function createNodes(list) {
        var result = {};

        for (key in list) {
            result[key] = $(list[key]);
        }

        return result;
    }

    return {
        createNodes: createNodes,
        isMobile: isMobile
    }
})(jQuery);
