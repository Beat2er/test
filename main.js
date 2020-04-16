/*


javascript:(function () { var script = document.createElement('script'); script.src="http://beat2er.de:8668/root/amazon-prime-w2g/raw/2a405ceb460c04b8d5db20960e1eea044ea1e538/main.js"; document.body.appendChild(script);})();

 */



function installJQuery(){
    if(typeof jQuery=='undefined') {
        var headTag = document.getElementsByTagName("head")[0];
        var jqTag = document.createElement('script');
        jqTag.type = 'text/javascript';
        jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
        headTag.appendChild(jqTag);
    }
}
installJQuery();

function getClientTime()
{
    return $('.left').children('.time').contents().get(0).nodeValue;
}

function getServerTime()
{
    var serverTime = null;

    jQuery.ajax({
        url: 'TODO URL',
        type: 'POST',
        data: {session: getSessionId(),
            id: getClientId(),
            seconds: timeSeconds(getClientTime()),
            time: getClientTime()
        },
        success: function(data) {
            clientCompareTimes(data);
        },
        error: function() {
            return null;
        }
    });

}

function checkClientOnVideoUrl()
{
    return window.location.href.includes('video') && window.location.href.includes('amazon');
}

function checkPlayerOpen() {
    return $('#dv-web-player.dv-player-fullscreen').length == 1;
}

function getSessionId() {
    var parts = window.location.split(/[/]+/);
    for (var i = 0; i < parts.length; i++) {
        if (parts[i].localeCompare('detail')) {
            return parts[i+1];
        }
    }
}

function getClientId() {

    var data = [
        navigator.platform,
        navigator.userAgent,
        navigator.appVersion,
        navigator.vendor,
        $('.nav-a.nav-a-2.nav-truncate').children('.nav-line-1').html()
    ];
    if (typeof md5 != 'function') {
        var headTag = document.getElementsByTagName("head")[0];
        var jqTag = document.createElement('script');
        jqTag.type = 'text/javascript';
        jqTag.src = 'https://cdn.rawgit.com/blueimp/JavaScript-MD5/master/js/md5.min.js';
        headTag.appendChild(jqTag);
    }
    return md5(data.join(';'));
}

var run = true;
var id = null;
function main() {
   //init
   if (!checkClientOnVideoUrl()) {
       alert('Du musst ein Video geöffnet haben');
       return;
   }
    if (!checkPlayerOpen()) {
        alert('Du musst das Video offen haben');
        return;
    }
    session = getSessionId();
    main_loop();
}
main();

function main_loop() {




    if (run) setTimeout(main_loop, 1000);
}



function timeSeconds(time) {
    var arr = time.split(":");
    for (i= arr.length-1 ; i >=0 ; i--){
        arr[arr.length] = arr[i] * 60 + arr[arr.length];
    }
}
var paused = false;
function clientCompareTimes(serverTime) {
    var e_p_up = new CustomEvent ('pointerup', {
        bubbles: true,
        detail: null}
    );
    var e_click = new CustomEvent ('click', {
        bubbles: true,
        detail: null}
    );
    if (serverTime < getClientTime()) {
        paused = true;
        $('.pausedOverlay').children('.buttons').children('.playIcon')[0].dispatchEvent(e_p_up);
        var diff = getClientTime() - serverTime;
        diff = diff/10;
        diff = Math.floor(diff);
        diff -= 1;
        diff -= diff * 0.2;
        diff = Math.floor(diff);
        diff = Math.min(20, diff);
        diff = Math.max(0, diff);
        for (var i = 0; i < diff; i++) {
            $('.pausedOverlay').children('.buttons').children('.fastSeekBack')[0].dispatchEvent(e_click);
        }
        if (serverTime < getClientTime() - 10) {
            $('.pausedOverlay').children('.buttons').children('.fastSeekBack')[0].dispatchEvent(e_click);
        }
    } else {
        if (paused) {
            paused = false;
            $('.pausedOverlay').children('.buttons').children('.pauseIcon')[0].dispatchEvent(e_p_up);
        }
    }
}

function getPlayerStatus() {
    var play = $('.pausedOverlay').children('.buttons').children('.playIcon').length;
    var pause = $('.pausedOverlay').children('.buttons').children('.pauseIcon').length;

    if (play == 1 && pause == 0) return 'paused';
    if (play == 0 && pause == 1) return 'playing';
    if (play == 1 && pause == 1) return 'WTF IMPOSSIBLE';
    return '';
}
