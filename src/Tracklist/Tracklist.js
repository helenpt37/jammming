import React from "react";
import "./Tracklist.css";

export default function Tracklist({ tracklist, handleAdd }) {
  return (
    <div>
      {tracklist.map((track) => {
        return (
          <div className="songs" key={track.id}>
            <div className="song-info">
              <h2>{track.name}</h2>
              <h3>
                {track.artist} | {track.album}
              </h3>
            </div>
            <div className="add-button" onClick={() => handleAdd(track)}>
              +
            </div>
          </div>
        );
      })}
    </div>
  );
}
