require('dotenv').config()
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env["MONGODB_URI"]);
const SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env["SPOTIFY_CLIENT_ID"],
    clientSecret: process.env["SPOTIFY_CLIENT_SECRET"],
    redirectUri: 'http://aaronstatic.com/spotify/auth'
});


const db = client.db("aaronstatic");


async function update() {
    const releases = db.collection("releases");
    /*
    const result = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(result.body['access_token']);
    const data = await spotifyApi.getArtistAlbums('0Nsz79ZcE8E4i3XZhCzZ1l')
    
    for (const item of data.body.items) {
        console.log("Adding/updating release: " + item.name);
        const album = await spotifyApi.getAlbum(item.id)
        album.body.album_group = item.album_group;
    
        releases.updateOne(
            { id: item.id },
            {
                $set: album.body
            },
            { upsert: true }
        ).then(() => {
    
        }, (err) => {
            console.error(err);
        });
    }
    */
    const mixJson = await fetch("https://api.mixcloud.com/aaronstatic/cloudcasts/");
    const mixData = await mixJson.json();

    const mixes = db.collection("mixes");

    for (const mix of mixData.data) {
        console.log("Adding/updating mix: " + mix.name);
        await mixes.updateOne(
            { key: mix.key },
            {
                $set: mix
            },
            { upsert: true }
        );
    }

    client.close();
    process.exit();

}

update();

