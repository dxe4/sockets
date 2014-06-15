function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
var page_guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

var pubnub = PUBNUB.init({
     publish_key   : 'pub-c-d9292649-de96-4d92-8425-1b559da50c45',
     subscribe_key : 'sub-c-44b62dd0-f3f1-11e3-a672-02ee2ddab7fe'
 })

function publish() {
 pubnub.publish({
     channel : page_guid,
     message : "init."
 })
}

function QRCodeView(){
    this.url = "https://api.qrserver.com/v1/create-qr-code/?size=75x75&data="+page_guid
}

ko.applyBindings(new QRCodeView(), $('#qrcode')[0]);

var queryTerm = ko.observable();

var search = {
    queryTerm : queryTerm,
    submit: function(){

        $.get('http://54.76.152.118:1234/get_related_2', {
                artist: queryTerm()
            }, filterJSONandAddToGraph
        );
    }
};

ko.applyBindings(search, $("#searchbox")[0]);
function onPlayerReady(event) {
    var playerView = window.pv = new window.PlayerView(player);
    ko.applyBindings( playerView, $('#playerView')[0] );
    pubnub.subscribe({
        channel : page_guid,
        message : function(m){ 
            switch(m.action){
                case 'playpause':
                    playerView.playpause()
                    break;
                case 'back':
                    playerView.back();
                    break;
                case 'skip':
                    playerView.back();
                    break;
            }
        },
        connect : publish
    })

    updateYouTubeElement('Bonobo');

}
function onPlayerStateChange(event){
    console.log(event);
}

function onYouTubeIframeAPIReady() {
    console.log('no player');
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: parts.pop(),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

var player,
    parts = ['Bonobo'];
$(document).ready(function(){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})


function load_player(data){
    for (var x = 0; x < data.feed.entry.length; x++) {
        if (x == 3) {
            var URI = data.feed.entry[x].id.$t;
            var parts = URI.split('/');
            console.log('new player');
            player.loadVideoById(parts.pop());
            player.stopVideo();
        }
    }
}

function updateYouTubeElement(artist){
    console.log('getting the player');

    var the_url = "https://gdata.youtube.com/feeds/api/videos";
    $.get(the_url, {
        'category': 'music',
        'q': artist,
        'alt': 'json'
    }, load_player);
    $('#npmessage').text(artist);
}


