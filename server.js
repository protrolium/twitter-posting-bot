const fs = require( 'fs' ), 
    path = require( 'path' ),
    Twit = require( 'twit' ),
    config = require( path.join( __dirname, 'config.js' ) );
    statuses = require( path.join( __dirname, 'statuses.js') );
    images = require( path.join( __dirname, 'images.js') );

const T = new Twit( config );

/* test post tweet status message */
// T.post( 'statuses/update', { status: 'the entelect speaks' }, function( err, data, response ) {
//     console.log( data );
// } );

function randomFromArray( arr ){
    return arr[Math.floor( Math.random() * arr.length )];
}

function tweetRandomImage() {
    const image = randomFromArray( images );
    console.log( 'opening an image …' );

    const luluServerImageDir = '/Volumes/Documents/WEB/SPIRIT-BOMB/STILLS/'
    const imagePath = path.join( luluServerImageDir, image.file );
    console.log( imagePath );

    /* original method if serving images from containing script directory */
    //const imagePath = path.join( __dirname, '/images/' + image.file );
    
    const imageStatus = image.status;
    const imageAltTxt = image.alt_text.text;
    const imageData = fs.readFileSync( imagePath, { encoding: 'base64' } );
    
    /* Upload the image to Twitter */
    console.log( 'uploading image…', imagePath );

    T.post( 'media/upload', { media_data: imageData }, function( err, data, response ) {
        if ( err ) {
            console.log( 'error:', err );
        }
        else {
            /* Add image description */
            const image = data;
            console.log( 'image uploaded, adding description…' );

            T.post( 'media/metadata/create', {
                media_id: image.media_id_string,
                alt_text: {
                    text: `${ imageAltTxt }`
                }
            }, function( err, data, response ) {
                /* finally, post a tweet with image */
                T.post( 'statuses/update', {
                    status: `${ imageStatus }`,
                    media_ids: [image.media_id_string]
                },
                function( err, data, response ) {
                    if ( err ) {
                        console.log('error:', err );
                    }
                    else {
                        console.log( 'posted an image' );
                    }
                } );
            } );
        }
    } );
}

function tweetRandomStatus() {
    const status = randomFromArray ( statuses );
    console.log( status );
    
    T.post( 'statuses/update', status, function( err, data, response ) {
    console.log( 'status posted' );
    } );
}

let methods = [
    tweetRandomImage,
    tweetRandomStatus
]

function sbBot( methods, i = 0 ) {
    setTimeout( function() {
        console.log( methods[ i ] );
        methods[i]();
        sbBot(methods, ( i + 1 ) % methods.length);
    }, 3000 )
}

sbBot(methods);