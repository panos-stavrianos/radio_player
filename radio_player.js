function set_icon(action) {
    switch (action) {
        case -1://stopped
            jQuery("#player_icon").addClass('play').removeClass('pause').removeClass('loader');
            jQuery('.music-card').removeClass('playing');

            break;
        case 0://playing
            jQuery("#player_icon").addClass('pause').removeClass('play').removeClass('loader');
            jQuery('.music-card').addClass('playing');

            break;
        case 1://loading
            jQuery("#player_icon").addClass('loader').removeClass('play').removeClass('pause');
            jQuery('.music-card').removeClass('playing');

            break;
    }
}


function set_image(meta_url) {
    if (meta_url === "") {
        jQuery('#cover').css('background-image', 'url(https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)');
        return
    }
    image_url = 'https://coverartarchive.org' + meta_url.replace(/^.*\/\/[^\/]+/, '');
    jQuery.ajax({
        url: image_url,
        type: 'GET',
        success: function (data) {
            console.log(data.images);
            if (data.images.length > 0) {
                console.log(data.images[0].image);
                jQuery('#cover').css('background-image', 'url(' + data.images[0].image + ')');
            } else
                jQuery('#cover').css('background-image', 'url(https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)');
        },
        error: function (data) {
            console.log("no cover");

            jQuery('#cover').css('background-image', 'url(https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)');
        }
    });
}

jQuery(document).ready(function () {
    const connection = new autobahn.Connection({
        url: 'ws://83.212.124.250:8080/ws',
        realm: 'metadata-realm',
        authid: "anonymous"
    });
    connection.onopen = function (session) {
        // 1) subscribe to a topic
        function onevent(args) {
            console.log("Event:", args[0]);
            metadata = jQuery.parseJSON(args[0]);
            if (metadata.songTitle && metadata.artist) {
                jQuery('.title').html(metadata.songTitle);
                jQuery('.artist').html(metadata.artist);
                jQuery('.album').html('<a class="album" href=' + metadata.metadata_url + ' target="_blank">' + metadata.albumTitle + '</a>' + '<br/>');
                set_image(metadata.metadata_url)
            }
        }

        session.subscribe('com.metadata.client.metadata_event', onevent).then(
            function (sub) {
                console.log("subscribed with subscription ID " + sub.id);
                session.call('wamp.subscription.get_events', [sub.id, 1]).then(
                    function (history) {
                        metadata = jQuery.parseJSON(history[0].args[0]);
                        console.log(metadata);
                        if (metadata.songTitle && metadata.artist) {
                            jQuery('.title').html(metadata.songTitle);
                            jQuery('.artist').html(metadata.artist);
                            jQuery('.album').html('<a class="album" href=' + metadata.metadata_url + ' target="_blank">' + metadata.albumTitle + '</a>' + '<br/>');
                            set_image(metadata.metadata_url)
                        }
                    },
                    function (err) {
                        console.log("could not retrieve event history", err);
                    }
                );
            },
            function (err) {
                console.log("could not subscribe", err);
            }
        );

    };
    connection.open();


    sound = null;
    soundManager.onready(function () {
        sound = soundManager.createSound({
            id: 'Radio',
            url: 'http://rs.radio.uoc.gr:8000/uoc_64.mp3',
            onstop: function () {
                console.log("onstop!!!");
                set_icon(-1)
            },
            onbufferchange: function (action) {
                console.log("onbufferchange!!!->" + action);
                set_icon(action);
            }
        });

    });

    jQuery("#play_btn").click(function () {
        if (sound.playState !== 0) {
            sound.stop();
            sound.unload();
            console.log("lets stop");
        } else {
            console.log("lets play");
            sound.load();
            sound.play();

        }
    });
});



