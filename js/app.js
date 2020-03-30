/**
 * DroneDude javascript
 * Version 1.1
 * Sven Hinse 12/2016
 * www.svenhinse.de
 */
'use strict';
/**
 * The wrapper object for the app
 */
const app = function() {
    //set the standard tuning value
    let tuning = 440;
    //Array containing the Button labels
    var labels = [ 'C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B' ];
    //Array containing the filenames
  const files = [ 'c', 'c_sharp', 'd', 'd_sharp', 'e', 'f', 'f_sharp', 'g', 'g_sharp', 'a', 'a_sharp', 'b' ];
    //2 audio objects that play and take turns
    const drone = new Array( new Audio(), new Audio() );
    //stores the index of the audio object being played, -1 if none is playing
    let isPlaying = -1;
    //stores the jQuery object of the last clicked button
    let buttonPlaying;

    //stores the setInterval object for the loop
    let loopInterval;

    //stores the SetInterval object for the crossfade
    let fadeInterval;

    showButtons( labels, files );
    addEventListeners();

    /**
     * event handler for click event on note buttons
     * starts the drone sound using the file provided in the button's 'data-note' attribute
     * @param event
     */
    function noteButtonClickHandler( event ) {

        stopSounds();

        var file = event.target.getAttribute( 'data-note' );
        var path = './mp3/' + tuning + '/' + file + '.mp3';
        drone[ 0 ].src = path;
        drone[ 1 ].src = path;
        drone[ 0 ].play();
        isPlaying = 0;
        buttonPlaying = $( event.target );
        buttonPlaying.addClass( 'btn-success' );
        loopInterval = setInterval( crossfade, 10000 )

    }

    /**
     * crossfades the 2 audio objects
     */

    function crossfade() {

        //check which of the 2 drones is playing
        var isPaused = isPlaying == 1 ? 0 : 1;

        //start the second drone silently
        drone [ isPaused ].volume = 0;
        drone [ isPaused ].currentTime = 0;
        drone[ isPaused ].play();
        var vol = 0;

        //do the crossfade
        fadeInterval = setInterval( function() {

            //equal power crossfade, see: http://chimera.labs.oreilly.com/books/1234000001552/ch03.html#s03_2
            drone[ isPaused ].volume = Math.cos( (
                    1.0 - (
                        vol / 100
                    )
                ) * 0.5 * Math.PI );
            drone[ isPlaying ].volume = Math.cos( (
                    vol / 100
                ) * 0.5 * Math.PI );

            vol++;
            //after crossfade, reset drone that was playing and update "isPlaying" flag
            if ( vol == 100 ) {
                drone[isPlaying].pause();
                console.log ("is paused"+isPaused);
                console.log("crossfade");
                console.log (drone[0].currentTime);
                console.log (drone[1].currentTime);
                isPlaying = isPaused;
                clearInterval( fadeInterval );
            }
        }, 20 );

    }

    /**
     * adds all event listeners for the app
     */
    function addEventListeners() {
        var stopButton = $( '#stop-button' );
        stopButton.on( 'click', stopSounds );

        $( '.note-button' ).each( function() {
            this.addEventListener( 'click', noteButtonClickHandler );
        } );

        var tuningSelect = $( '#hertz-select' );
        tuningSelect.on( 'change', function() {
            tuning = tuningSelect.val()
        } );
    }

    /**
     * writes the buttons to the GUI
     * @param labels - The button texts.
     * @param files - The data-file attributes for the buttons.
     */
    function showButtons( labels, files ) {
        var buttonContainer = $( '#button-container' );
        for ( var i = 0; i < 12; i++ ) {
            var button = '<button type="button" class="note-button btn btn-lg" data-note ="' +
                files[ i ] + '">' + labels[ i ] + '</button>';
            if ( i % 3 == 0 ) {
                buttonContainer.append( '<br>' )
            }
            buttonContainer.append( button );
        }
    }

    /**
     * stops the current sound,
     * removes color from pressed button
     * removes the loopInterval and the fadeInterval timer
     */
    function stopSounds() {
        if ( isPlaying != -1 ) {
            clearInterval( loopInterval );
            clearInterval( fadeInterval );
            drone.forEach( function( drone ) {
                drone.pause();
                drone.currentTime = 0;
                drone.volume = 1;
            } );
            buttonPlaying.removeClass( 'btn-success' );
            isPlaying = -1;
        }
    }

}( jQuery );

