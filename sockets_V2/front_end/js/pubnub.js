function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
var page_guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

var pubnub = PUBNUB.init({
     publish_key   : 'pub-c-d9292649-de96-4d92-8425-1b559da50c45',
     subscribe_key : 'sub-c-44b62dd0-f3f1-11e3-a672-02ee2ddab7fe'
 })

pubnub.subscribe({
    channel : page_guid,
    message : function(m){ 
        switch(m.action){
            case 'playpause':
                window.playerView.playpause()
                break;
            case 'back':
                window.playerView.back();
                break;
            case 'skip':
                window.playerView.back();
                break;
        }
    },
    connect : publish
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

/*var search = {
    queryTerm : queryTerm,
    submit: function(){
        for(var i; i < store.length; i++ ){
            graph.nodes = [];
            graph.links = [];
        }
        
        $.post('http://54.76.152.118:80/get_related', {
                artist: queryTerm()
            }, filterJSONandAddToGraph
        );
    }
};

ko.applyBindings(search, $("#searchbox")[0]);*/