# Matzore 89.1FM Radio Player
This project make use of an API developed by [UoC-Radio](https://github.com/UoC-Radio) 

## How it looks
![](https://github.com/panos-stavrianos/radio_player/blob/master/img/peek.gif)

[LIVE DEMO](http://matzore.orbitsystems.gr/) (for now)

## Dependencies

* [jquery](https://jquery.com/)
* [autobahn](https://github.com/crossbario/autobahn-js-browser)
* [soundmanager2](http://www.schillmania.com/projects/soundmanager2)

## Use
You have to import the `radio_player.css` and  `radio_player.js`.

Then simply put the html code wherever you want
```html
<div class='music-card'>
    <div id='cover' class='image'></div>
    <div class='info'>
        <h2 class='title'></h2>
        <div class='artist'></div>
        <div class="album"></div>
    </div>
    <div class='wave'></div>
    <div class='wave'></div>
    <div class='wave'></div>
</div>

<div id="play_btn">
    <div id="player_icon" class="play"></div>
</div>
``` 