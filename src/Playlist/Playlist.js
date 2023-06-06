import React from "react";
import "./Playlist.css";

export default function Playlist({ playlist, handleRemove }) {
  return (
    <div>
      {playlist.map((track) => {
        return (
          <div className="songs" key={track.id}>
            <div className="song-info">
              <h2>{track.name}</h2>
              <h3>
                {track.artist} | {track.album}
              </h3>
            </div>
            <div className="remove-button" onClick={() => handleRemove(track)}>
              -
            </div>
          </div>
        );
      })}
    </div>
  );
}
