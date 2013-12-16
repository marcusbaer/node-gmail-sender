var Emailer, exports, _,
    emailer = require("nodemailer");
_ = require("underscore");
var fs = require("fs");

Emailer = (function() {

    Emailer.name = 'Emailer';
    Emailer.prototype.options = {};
    Emailer.prototype.data = {};
    Emailer.prototype.attachments = [];

    function Emailer(options, data) {
        this.options = options;
        this.data = data;
        this.attachments = options.attachments;
    }

    Emailer.prototype.send = function(callback) {
        var attachments, html, messageData, transport;
        if (this.options.template) {
            html = this.getHtml(this.options.template, this.data);
            attachments = this.getAttachments(html);
        }
        messageData = {
            to: "'" + this.options.to.name + " " + this.options.to.surname + "' <" + this.options.to.email + ">",
            from: this.options.from,
            subject: this.options.subject
        };
        if (html) {
            messageData.html = html;
            messageData.generateTextFromHTML = true;
            messageData.attachments = attachments;
        } else {
            messageData.text = this.options.text;
        }
        transport = this.getTransport();
        return transport.sendMail(messageData, callback);
    };

    Emailer.prototype.getTransport = function() {
        return emailer.createTransport("SMTP", {
            service: this.options.smtp.service,
            auth: {
                user: this.options.smtp.user,
                pass: this.options.smtp.pass
            }
        });
    };

    Emailer.prototype.getHtml = function(templateName, data) {
        var encoding, templateContent;
        templateContent = fs.readFileSync(templateName, encoding = "utf8");
        return _.template(templateContent, data, {
            interpolate: /\{\{(.+?)\}\}/g
        });
    };

    Emailer.prototype.getAttachments = function(html) {
        var attachment, attachments, _i, _len, _ref;
        attachments = [];
        _ref = this.attachments;
        if (_ref) {
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                attachment = _ref[_i];
                if (html.search("cid:" + attachment.cid) > -1) attachments.push(attachment);
            }
        }
        return attachments;
    };

    return Emailer;

})();

var Gmailer = function () {

    var Gmailer = {

        options: function (options) {
            this.options = _.extend(this.options, options);
        },

        send: function (mailconfig) {
            var data, emailer, options;

            mailconfig = (mailconfig) ? _.extend(mailconfig, this.options['email']): this.options['email'];
            //sys.log('SEND MAIL "' + mailconfig.subject + '" to ' + mailconfig.to.email);

            options = {
                attachments: mailconfig.attachments,
                template: mailconfig.template,
                subject: mailconfig.subject,
                from: mailconfig.from,
                to: mailconfig.to
            };

            options = _.extend(this.options, options);

            if (mailconfig.smtp) {
                options.smtp = mailconfig.smtp;
            }

            data = mailconfig.data;

            emailer = new Emailer(options, data);

            emailer.send(function(err, result) {
                if (err) return console.log(err);
//            console.log(result);
            });

        }

    };

    return Gmailer;

};

exports = module.exports = Gmailer();
