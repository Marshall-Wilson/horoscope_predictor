import React, {useState, useEffect} from 'react'
import * as $ from "jquery";
import Player from "./Player"

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "52988c4410724bea87391b7ed36f4c7f";
const redirectUri = "http://localhost:3000/redirect";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";


const Test = () => {
    //state 
    const [token, setToken] = useState(null);
    const [item, setItem] = useState({
        album: {
            images: [{url: ""}]
        },
        name: "",
        artists: [{name: ""}],
        duration_ms: 0
    });
    const [isPlaying, setIsPlaying] = useState("Paused");
    const [progressMS, setProgressMS] = useState(0);



    const getCurrentlyPlaying = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                if (data) {
                    setItem(data.item);
                    setIsPlaying(data.is_playing);
                    setProgressMS(data.progress_ms);
                }
            }
        })
    }

    //on load
    useEffect(() => {
        let _token = hash.access_token;
        if (_token){
            setToken(_token);
        }
        getCurrentlyPlaying(_token);
    }, [])

    const tick = () => {
        if (token) {
            getCurrentlyPlaying(token);
        }
    }

    let interval = setInterval(() => tick(), 5000);



    return (
        <div className="App">
            {token ? 
                 <Player
                 item={item}
                 isPlaying={isPlaying}
                 progressMS={progressMS}
               />
                : <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&show_dialog=true`}
              >
                Login to Spotify
              </a> }
        </div>
    );
}

export default Test
