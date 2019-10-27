window.CYB = window.CYB || {};

window.CYB.Blocks = function () {
    var self = this;

    this.initialize = function () {
        bindFancyBoxDefaultShareTemplate();
        bindWpGallery();
        bindAlert();
    };

    // http://detectmobilebrowsers.com/
    this.checkMobileBrowser = function () {
        var browser = (navigator.userAgent || navigator.vendor || window.opera);
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(browser)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(browser.substr(0,4)));
    };
    this.checkMobileAndTabletBrowser = function () {
        var browser = (navigator.userAgent || navigator.vendor || window.opera);
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(browser)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(browser.substr(0,4)));
    };

    var bindFancyBoxDefaultShareTemplate = function () {
        var template = '<div class="fancybox-share">' +
            '<h1>{{SHARE}}</h1>' +
            '<p>';

        template += '<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}" target="_blank">' +
            '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' +
            '<span>Facebook</span>' +
            '</a>';

        template += '<a class="fancybox-share__button fancybox-share__button--tumblr" href="https://www.tumblr.com/widgets/share/tool?canonicalUrl={{url}}&caption={{descr}}" target="_blank">' +
            '<i class="fab fa-tumblr"></i> <span>Tumblr</span>' +
            '</a>';

        template += '<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}" target="_blank">' +
            '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>' +
            '<span>Pinterest</span>' +
            '</a>';

        template += '<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}" target="_blank">' +
            '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' +
            '<span>Twitter</span>' +
            '</a>';

        // @todo share urls
        // 'telegram.me'=>'https://t.me/share/url?url=' . $url . '&text=' . $text . '&to=' . $phone_number,
        // 'threema'=>'threema://compose?text=' . $text . '&id=' . $user_id,

        template += '<a class="fancybox-share__button fancybox-share__button--telegram" href="https://t.me/share/url?url={{url}}" target="_blank">' +
            '<i class="fab fa-telegram-plane"></i> <span>Telegram</span>' +
            '</a>';

        if (self.checkMobileAndTabletBrowser()) {
            template += '<a class="fancybox-share__button fancybox-share__button--threema" href="threema://compose?text={{url}}" target="_blank">' +
                '<span>Threema</span>' +
                '</a>';
        }

        if (self.checkMobileAndTabletBrowser()) {
            template += '<a class="fancybox-share__button fancybox-share__button--whatsapp" href="whatsapp://send?text={{url}}" target="_blank">' +
                '<i class="fab fa-whatsapp"></i> <span>WhatsApp</span>' +
                '</a>';
        }

        template += '</p>' +
            '<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p>' +
            '</div>';

        $.fancybox.defaults.share.tpl = template;
    };

    var bindWpGallery = function () {
        var $gallery = $('.is-style-cyb-gallery-fancybox');
        if ($gallery.length > 0) {
            $gallery.each(function (id, obj) {
                var galleryId = 'gallery-' + id;
                $galleryLinks = $(obj).find('a');

                if ($galleryLinks.length > 0) {
                    $galleryLinks.each(function (idLink, objLink) {
                        objLink.setAttribute('data-fancybox', galleryId);
                    });
                }

                $('[data-fancybox="' + galleryId + '"]').fancybox({
                    hash: false,
                    idleTime: false,
                    margin: 0,
                    gutter: 0,
                    infobar: false,
                    thumbs: {
                        hideOnClose: false
                    },
                    touch: {
                        vertical: false
                    },
                    buttons: [
                        // 'download',
                        'slideShow',
                        'fullScreen',
                        'zoom',
                        'share',
                        'thumbs',
                        'close'
                    ],
                    toolbar: true,
                    smallBtn: false,
                    animationEffect: "fade",
                    animationDuration: 300
                });
            });
        }
    };

    let bindAlert = function () {
        let storageKey = 'cyb-alerts';
        let alerts = JSON.parse(localStorage.getItem(storageKey));
        if (!alerts) {
            alerts = [];
            localStorage.setItem(storageKey, JSON.stringify(alerts));
        }

        document.querySelectorAll('.wp-block-cyb-alert').forEach(function (alert) {
            let alertId = alert.id.replace('cyb-alert_', '');
            if (alerts.length === 0 || !alerts.includes(alertId)) {
                document.querySelector('#cyb-alert_' + alertId).style.display = 'block';
            }
            let close = alert.querySelector('.close');
            if (close && alertId !== '' && !localStorage.getItem(storageKey).includes(alertId)) {
                close.addEventListener('click', function () {
                    let storage = JSON.parse(localStorage.getItem(storageKey));
                    storage.push(alertId);
                    localStorage.setItem(storageKey, JSON.stringify(storage));
                });
            }
        });
    };

};

jQuery(function ($) {
    let cybBlocks = new window.CYB.Blocks();
    cybBlocks.initialize();
});
