require('dotenv').config()
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env["MONGODB_URI"]);
const SerpApi = require('google-search-results-nodejs');
var SpotifyWebApi = require('spotify-web-api-node');

const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env["SPOTIFY_CLIENT_ID"],
    clientSecret: process.env["SPOTIFY_CLIENT_SECRET"],
    redirectUri: 'http://aaronstatic.com/spotify/auth'
});
spotifyApi.clientCredentialsGrant().then((result) => {
    const db = client.db("aaronstatic");
    const collection = db.collection("releases");

    spotifyApi.setAccessToken(result.body['access_token']);

    spotifyApi.getArtistAlbums('0Nsz79ZcE8E4i3XZhCzZ1l').then(
        function (data) {
            for (const item of data.body.items) {
                console.log("Adding/updating release: " + item.name);
                spotifyApi.getAlbum(item.id).then((album) => {
                    album.body.album_group = item.album_group;

                    collection.updateOne(
                        { id: item.id },
                        {
                            $set: album.body
                        },
                        { upsert: true }
                    ).then(() => {

                    }, (err) => {
                        console.error(err);
                    });
                });
            }
        },
        function (err) {
            console.error(err);
            process.exit();
        }
    );
});

