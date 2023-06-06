import "./App.css";
import { useState, useEffect } from "react";
import Tracklist from "../Tracklist/Tracklist.js";
import Playlist from "../Playlist/Playlist.js";

function App() {
  const URL = "https://accounts.spotify.com/authorize";
  const clientId = "2954a5f122c04df18771117dfaf4b709";
  const redirectUri = "http://localhost:3000/";
  const endpoint = `${URL}?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-private`;

  useEffect(() => {
    if (window.location.href.includes("access_token")) {
      return;
    } else {
      window.location.href = endpoint;
    }
    // eslint-disable-next-line react-hooks/exhaustive-depsx
  }, []);

  const newUrl = window.location.href.replace("#", "&");
  const params = new URLSearchParams(newUrl);
  const token = params.get("access_token");

  const [tracklist, setTracklist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [userId, setUserId] = useState();
  const [playlistId, setPlaylistId] = useState();
  const [title, setTitle] = useState();
  const [createPlaylistSuccess, setCreatePlaylistSuccess] = useState(false);
  const [savePlaylistSuccess, setSavePlaylistSuccess] = useState(false);

  const handleAdd = (track) => {
    if (playlist.length === 0) {
      setPlaylist([...playlist, track]);
    }

    playlist.find((t) => t.id === track.id) === undefined &&
      setPlaylist([...playlist, track]);
  };

  const handleRemove = (track) => {
    let newPlaylist = playlist.filter(
      (playlistTrack) => playlistTrack.id !== track.id
    );

    setPlaylist(newPlaylist);
  };

  const handleSearch = async () => {
    const searchEndpoint = "https://api.spotify.com/v1/search";
    const queryString = `${searchEndpoint}?q=${searchTerm}&type=track&limit=10&offset=0`;

    const response = await fetch(queryString, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((data) => data.json());

    console.log(response);

    if (response.error) {
      window.location.href = redirectUri;
    } else {
      let searchResults = response.tracks.items;
      let returnedTracklist = searchResults.map((item) => {
        return {
          name: item.name,
          artist: item.artists[0].name,
          album: item.album.name,
          id: item.id,
          uri: item.uri,
        };
      });
      setTracklist(returnedTracklist);

      const userEndpoint = "https://api.spotify.com/v1/me";
      let userIdRes = await fetch(userEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((data) => data.json());
      setUserId(userIdRes.id);
      console.log(userIdRes);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCreate = async () => {
    const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;

    //creates a new playlist. will be empty until tracks are added
    let playlistIdRes = await fetch(playlistEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: title, public: false }),
    }).then((res) => {
      if (res.ok) {
        setCreatePlaylistSuccess(true);
        setTimeout(() => {
          setCreatePlaylistSuccess(false);
        }, 3000);
        return res.json();
      }
    });
    console.log(playlistIdRes);
    setPlaylistId(playlistIdRes.id);
  };

  const handleSave = () => {
    const addTracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    console.log(playlistId);
    fetch(addTracksEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uris: playlist.map((track) => track.uri) }),
    }).then((res) => {
      if (res.ok) {
        setSavePlaylistSuccess(true);
        setTimeout(() => {
          setSavePlaylistSuccess(false);
        }, 3000);
      }
    });
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="header">Jammming</h1>
      </div>
      <div className="search-container">
        <div className="search-input-div">
          <input
            type="text"
            className="search-input"
            onChange={handleChange}
            onKeyUp={handleKey}
          ></input>
        </div>
        <div className="search-button-div">
          <div className="search-button" onClick={handleSearch}>
            Search
          </div>
        </div>
      </div>
      <div className="result-container">
        <div className="tracklist lists-container">
          <h1 className="results-text">Results</h1>
          <Tracklist tracklist={tracklist} handleAdd={handleAdd} />
        </div>
        <div className="playlist lists-container">
          <div className="title-input-div">
            <input
              type="text"
              maxLength="30"
              className="playlist-name"
              onChange={handleTitleChange}
              readOnly={playlistId}
            ></input>
          </div>
          <Playlist playlist={playlist} handleRemove={handleRemove} />
          <div className="playlist-button-div">
            <div className="playlist-button">
              {playlistId ? (
                <div onClick={handleSave}>Save Playlist to Spotify</div>
              ) : (
                <div onClick={handleCreate}>Create Spotify Playlist</div>
              )}
            </div>
            <div className="success-text">
              {createPlaylistSuccess && <div>Playlist Created!</div>}
              {savePlaylistSuccess && <div>Save Successful!</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
