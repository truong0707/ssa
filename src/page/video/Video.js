import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaRandom,
} from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai"; // For replay icon
import { audios } from "./audioFiles"; // Adjust the path if needed
import "./style.css";

// Function to remove diacritics (accents) from Vietnamese characters
const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const Video = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playCounts, setPlayCounts] = useState(Array(audios.length).fill(0));

  // eslint-disable-next-line no-unused-vars
  const [showVideo, setShowVideo] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [volume, setVolume] = useState(0.3); // Set default volume to 40%
  const [replay, setReplay] = useState(false); // State for replay mode
  const [random, setRandom] = useState(false); // State for random mode

  const audioRef = useRef(null);
  const nameAudioRef = useRef(null);
  const playlistRef = useRef(null);

  const handleAudioEnded = () => {
    setPlayCounts((prevCounts) => {
      const updatedCounts = [...prevCounts];
      updatedCounts[currentVideoIndex] += 1;
      return updatedCounts;
    });

    if (replay) {
      // If replay mode is active, seek to start and continue playing
      if (audioRef.current) {
        audioRef.current.seekTo(0, "seconds");
        setPlayedSeconds(0);
        setIsPlaying(true); // Ensure it continues playing
      }
    } else if (random) {
      // If random mode is active, play a random track
      const randomIndex = Math.floor(Math.random() * audios.length);
      setCurrentVideoIndex(randomIndex);
      setPlayedSeconds(0);
      setIsPlaying(true);
    } else {
      // Otherwise, go to the next track
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % audios.length);
      setPlayedSeconds(0);
      setIsPlaying(true);
    }
  };

  const handleAudioSelect = (index) => {
    if (index !== currentVideoIndex) {
      setCurrentVideoIndex(index);
      setIsPlaying(true);
      setPlayedSeconds(0);
      if (audioRef.current) {
        audioRef.current.seekTo(0, "seconds");
      }
    } else {
      setIsPlaying(!isPlaying);
    }
    if (nameAudioRef.current) {
      nameAudioRef.current.play();
    }
  };

  const handleAudioPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleAudioPause = () => {
    setIsVideoPlaying(false);
  };

  const handleProgress = (progress) => {
    setPlayedSeconds(progress.playedSeconds);
  };

  const handleSeek = (e) => {
    const newPlayedSeconds = parseFloat(e.target.value);
    setPlayedSeconds(newPlayedSeconds);
    if (audioRef.current) {
      audioRef.current.seekTo(newPlayedSeconds, "seconds");
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setReplay(!replay);
  };

  const handleRandom = () => {
    setRandom(!random);
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? audios.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % audios.length);
  };

  useEffect(() => {
    if (!isVideoPlaying) {
      setIsPlaying(false);
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    localStorage.setItem(
      "currentVideoIndex",
      JSON.stringify(currentVideoIndex)
    );
    localStorage.setItem("playedSeconds", JSON.stringify(playedSeconds));
    localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
    localStorage.setItem("volume", JSON.stringify(volume));
    localStorage.setItem("replay", JSON.stringify(replay));
    localStorage.setItem("random", JSON.stringify(random));
  }, [currentVideoIndex, playedSeconds, isPlaying, volume, replay, random]);

  useEffect(() => {
    localStorage.setItem("playCounts", JSON.stringify(playCounts));
  }, [playCounts]);

  useEffect(() => {
    const savedPlayCounts = JSON.parse(localStorage.getItem("playCounts"));
    if (savedPlayCounts !== null) {
      setPlayCounts(savedPlayCounts);
    }
  }, []);

  useEffect(() => {
    const savedCurrentVideoIndex = JSON.parse(
      localStorage.getItem("currentVideoIndex")
    );
    const savedPlayedSeconds = JSON.parse(
      localStorage.getItem("playedSeconds")
    );
    const savedIsPlaying = JSON.parse(localStorage.getItem("isPlaying"));
    const savedVolume = JSON.parse(localStorage.getItem("volume"));
    const savedReplay = JSON.parse(localStorage.getItem("replay"));
    const savedRandom = JSON.parse(localStorage.getItem("random"));

    if (savedCurrentVideoIndex !== null) {
      setCurrentVideoIndex(savedCurrentVideoIndex);
    }
    if (savedPlayedSeconds !== null) {
      setPlayedSeconds(savedPlayedSeconds);
    }
    if (savedIsPlaying !== null) {
      setIsPlaying(savedIsPlaying);
    }
    if (savedVolume !== null) {
      setVolume(savedVolume);
    }
    if (savedReplay !== null) {
      setReplay(savedReplay);
    }
    if (savedRandom !== null) {
      setRandom(savedRandom);
    }
  }, []);

  // Listen for keydown event to trigger play/pause with Spacebar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
        handlePlayPause();
      } else if (event.code === "ArrowRight") {
        handleNext();
      } else if (event.code === "ArrowLeft") {
        handlePrevious();
      } else if (event.code === "Digit1") {
        handleReplay(); // Toggle random mode with key 1
      } else if (event.code === "Digit2") {
        handleRandom(); // Toggle replay mode with key 2
      } else if (event.code === "ArrowUp") {
        event.preventDefault(); // Prevent default arrow up behavior (scrolling)
        setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1)); // Increase volume
      } else if (event.code === "ArrowDown") {
        event.preventDefault(); // Prevent default arrow down behavior (scrolling)
        setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0)); // Decrease volume
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, random, replay, volume]);

  const handleMouseEnter = () => {
    setIsBlurred(false);
  };

  const handleMouseLeave = () => {
    setIsBlurred(true);
  };

  const handleMouseMove = () => {
    if (playlistRef.current) {
      setIsBlurred(false);
      clearTimeout(window.blurTimeout);
      window.blurTimeout = setTimeout(() => {
        setIsBlurred(true);
      }, 2000);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Filter audios based on search term, removing diacritics from both the search term and audio names
  const filteredAudios = audios.filter((audio) =>
    removeDiacritics(audio.name).includes(removeDiacritics(searchTerm))
  );

  // Convert volume from 0-1 to 0-100
  const volumePercentage = Math.round(volume * 100);

  // Convert playedSeconds to percentage
  const duration = audioRef.current ? audioRef.current.getDuration() : 0;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <>
      <div className="audio-player">
        <div className="audio-container">
          <div
            className={`responsive-player ${showVideo ? "visible" : "hidden"}`}
          >
            <ReactPlayer
              ref={audioRef}
              url={audios[currentVideoIndex]?.url}
              playing={isPlaying}
              controls={false} // Disable internal controls
              volume={volume} // Apply volume control
              onEnded={handleAudioEnded}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onProgress={handleProgress}
              progressInterval={1000}
              width="100%"
              height="100%"
            />
          </div>
          {/* <button className="toggle-video-btn" onDoubleClick={toggleVideo}>
            {showVideo ? "Disposion" : "Feedback Type"}
          </button> */}
        </div>

        {/* Search input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for music..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
            className="search-input"
          />
        </div>

        <div
          className={`playlist ${isBlurred ? "blurred" : ""} container-fluid`}
          ref={playlistRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h5>Have a nice day. Enjoy the music. 😉</h5>
          <a href="https://drive.google.com/drive/u/1/folders/1EEIo1ieVHgBy8EZdpSYizcomCJ_OwWFq">
            Nghe Đỡ Nha, Đang lỗi{" "}
          </a>
          {/* Volume Control Slider */}
          <div className="volume-control">
            <label htmlFor="volume">Volume:</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-percentage">{volumePercentage}%</span>
          </div>
          {/* Seek Bar */}
          <h5>{audios[currentVideoIndex]?.name || "None"}</h5>
          <div className="track-controls">
            <button onClick={handlePrevious} title="Previous">
              <FaBackward size={24} />
            </button>
            <button
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button
              onClick={handleReplay}
              title={replay ? "Stop Replay" : "Replay"}
              className={replay ? "active" : "inactive"}
            >
              <AiOutlineRetweet size={24} />
            </button>
            <button
              onClick={handleRandom}
              title={random ? "Stop Random" : "Random"}
              className={random ? "active" : "inactive"}
            >
              <FaRandom size={20} />
            </button>
            <button onClick={handleNext} title="Next">
              <FaForward size={24} />
            </button>
          </div>

          <div className="seek-bar">
            <span>{formatTime(playedSeconds)}</span>
            <input
              id="seek"
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={playedSeconds}
              onChange={handleSeek}
              className="seek-slider"
            />
            <span className="seek-time">{formatTime(duration)}</span>
          </div>

          {/* Track Controls */}

          <ul className="row">
            {filteredAudios.map((audio, index) => (
              <li
                key={index}
                className={`col-sm-6 col-lg-3 col-12 ${
                  audios.indexOf(audio) === currentVideoIndex ? "active" : ""
                }`}
                onClick={() => handleAudioSelect(audios.indexOf(audio))}
              >
                <div className="audio-info">
                  {playCounts[audios.indexOf(audio)] >= 3 && (
                    <span className="heart" title="Do you like this song?">
                      ❤️
                    </span>
                  )}

                  <span style={{ marginLeft: "10px" }}>{audio.name}</span>
                </div>
                {audios.indexOf(audio) === currentVideoIndex && isPlaying && (
                  <motion.div
                    className="music-wave"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BsFillVolumeUpFill size={24} color="blueviolet" />
                  </motion.div>
                )}
              </li>
            ))}
          </ul>

          <span>Copyright by CONCENTRIX ❤</span>
        </div>
      </div>
    </>
  );
};

export default Video;
