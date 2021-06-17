var contact = (function ($) {
    var selectors = {
            form: '#contact-form',
            name: '#contact-form [name="name"]',
            email: '#contact-form [name="email"]',
            phone: '#contact-form [name="phone"]',
            message: '#contact-form [name="message"]',
            alert: '.alert--message'
        },
        validating = false,
        nodes;

    function notify(message, type) {
        if (type === 'status') {
            nodes.alert.fadeIn(150).find('.alert__content').html(message);

            window.setTimeout(function () {
                nodes.alert.fadeOut(150);
            }, 3000);
        } else if (type === 'validation') {
            return $('<span class="validation">' + message + '</span>');
        }
    }

    function validateEmail(email){
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return reg.test(email);
    }

    function validate() {
        // validation
        validating = true;
        var valid = true;

        // name
        if (nodes.name.val() == '' || nodes.name.val() == null){
            valid = false;

            $("+ .validation", nodes.name).remove();
            nodes.name.after(notify('Please enter your name', 'validation'));
        }

        else {
            $("+ .validation", nodes.name).remove();
        }

        // email
        if (nodes.email.val() == '' || nodes.email.val() == null){
            valid = false;

            $("+ .validation", nodes.email).remove();
            nodes.email.after(notify('Please enter your email', 'validation'));
        }

        else if (!validateEmail(nodes.email.val())){
            valid = false;

            $("+ .validation", nodes.email).remove();
            nodes.email.after(notify('Please enter a valid email', 'validation'));
        }

        else {
            $("+ .validation", nodes.email).remove();
        }

        // message
        if (nodes.message.val() == '' || nodes.message.val() == null){
            valid = false;

            $("+ .validation", nodes.message).remove();
            nodes.message.after(notify('Please enter your message', 'validation'));
        }

        else {
            $("+ .validation", nodes.message).remove();
        }

        return valid;
    }

    function events() {
        nodes.form.find('input, textarea').on('keyup', function () {
            if (validating) {
                validate();
            }
        });

        nodes.form.submit(function (event) {
            event.preventDefault();

            if (validate()) {
                // build data
                var data = {
                    "Name": nodes.name.val(),
                    "Email": nodes.email.val(),
                    "Phone": nodes.phone.val(),
                    "Message": nodes.message.val()
                }

                data = JSON.stringify(data);

                $.ajax({
                    type: 'POST',
                    url: 'mailer.php',
                    crossDomain: true,
                    data: data,
                    dataType: 'json',
                    success: function(responseData, textStatus, jqXHR) {
                        notify("Thanks for your message! You'll be hearing from us soon =]", 'status');

                        // clear form
                        nodes.name.val("").change().blur();
                        nodes.email.val("").change().blur();
                        nodes.phone.val("").change().blur();
                        nodes.message.val("").change().blur();

                        $("+ .validation", nodes.name).remove();
                        $("+ .validation", nodes.email).remove();
                        $("+ .validation", nodes.phone).remove();
                        $("+ .validation", nodes.message).remove();
                    },
                    error: function (responseData, textStatus, errorThrown) {
                        notify("There was an error with your form. Please try again.", 'status');
                    }
                });
            }

            return false;
        });
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            events();
        }
    }
})(jQuery);

$(function () {
    contact.init();
});
