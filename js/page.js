var page = (function ($) {
    var selectors = {
            document: document,
            body: 'body',
            menuToggle: '.js-toggle-menu'
        },
        classes = {
            menu: 'menu-active'
        },
        settings = {
            menu: {
                bg: '#00d8ff',
                alpha: 0.9
            }
        },
        active = false,
        nodes;

    function toggleMenu(event, close) {
        if (event !== null) {
            event.stopPropagation();
        }

        if (active || close) {
            active = false;

            nodes.body.removeClass(classes.menu);

            $.publish('/overlay/hide');
        } else {
            active = true;

            nodes.body.addClass(classes.menu);

            $.publish('/overlay/show', [settings.menu.bg, settings.menu.alpha]);
        }
    }

    function closeMenu() {
        toggleMenu(null, true);
    }

    function removeAlert() {
        nodes.document.find('.alert--thank-you').fadeOut(150);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            // copyright
            $('.current-year').html(new Date().getFullYear());

            // header
            nodes.menuToggle.on('click', toggleMenu);

            nodes.document.on('click', closeMenu);

            nodes.document.on('click', '.menu', function (event) {
                event.stopPropagation();
            });

            // portfolio slider
            $('.slider--portfolio').flexslider({
                prevText: '',
                nextText: ''
            });

            // team sliders
            // The slider being synced must be initialized first
            $('.slider--team-thumbs').flexslider({
                animation: "slide",
                animationLoop: false,
                slideshow: false,
                itemWidth: 200,
                itemMargin: 0,
                asNavFor: '.slider--team',
                prevText: '',
                nextText: ''
            });

            $('.slider--team').flexslider({
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                sync: ".slider--team-thumbs",
                prevText: '',
                nextText: ''
            });

            $.subscribe('/modal/redraw', redrawSliders);

            function redrawSliders(event, modal) {
                var sliders = modal.find('.flexslider');

                setTimeout(function () {
                    sliders.each(function () {
                        var slider = $(this).data('flexslider');

                        if (slider.hasClass('slider--team-thumbs') || slider.hasClass('slider--team')) {
                            slider.resize();
                            slider.flexslider(0)
                        }
                    });
                }, 1);
            }


            // menu events

            $.subscribe('/page/closeAll', closeMenu);
            $.subscribe('/closeAll', closeMenu);


            // alerts

            nodes.document.on('click', removeAlert);

            nodes.document.find('.alert--thank-you').on('click', 'a', function (event) {
                event.stopPropagation();
            });

            $.subscribe('/page/closeAll', removeAlert);
        }
    }
})(jQuery);

$(function () {
    page.init();
});
