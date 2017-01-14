/**
 * DroneDude javascript
 * Version 1.0
 * Sven Hinse 12/2016
 * www.svenhinse.de
 */
'use strict';
/**
 * The wrapper object for the app
 */
var app = function() {
    //set the standard tuning value
    var tuning = 440;
    //Array containing the Button labels
    var labels = [ 'C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B' ];
    //Array containing the filenames
    var files = [ 'c', 'c_sharp', 'd', 'd_sharp', 'e', 'f', 'f_sharp', 'g', 'g_sharp', 'a', 'a_sharp', 'b' ];
    //audio object that plays the loop
    var drone = new Audio();
    //boolean, true if sound is playing
    var isPlaying;
    //stores the jQuery object of the last clicked button
    var buttonPlaying;

    //stores the setInterval object for the loop
    var loopInterval;

    show_buttons( labels, files );
    addEventListeners();

    /**
     * event handler for click event on note buttons
     * starts the drone sound using the file provided in the button's 'data-note' attribute
     * @param event
     */
    function noteButtonClickHandler( event ) {
        if ( isPlaying ) {
            stopSounds();
        }
        var file = event.target.getAttribute( 'data-note' );
        var path = './mp3/' + tuning + '/' + file + '.mp3';
        drone.src = path;
        drone.play();
        isPlaying = true;
        buttonPlaying = $( event.target );
        buttonPlaying.addClass( 'btn-success' );
        loopInterval = setInterval( function() {
            drone.currentTime = 100;
        }, 30000 )

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
    function show_buttons( labels, files ) {
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
     * removes the loopInterval timer
     */
    function stopSounds() {
        clearInterval( loopInterval );
        drone.pause();
        drone.currentTime = 0;
        buttonPlaying.removeClass( 'btn-success' );
        isPlaying = false;

    }
}( jQuery );

