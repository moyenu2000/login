import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [videoData, setVideoData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      console.log('Search term:', searchTerm);
      const response = await axios.post(`https://youtube-download-server.vercel.app/`, {video_url: searchTerm});
      setVideoData(response.data);  
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Removed auto-fetch on searchTerm change. Use button click or form submit instead.
  }, []);

  return (
    <div className="App">
      <h1>YouTube Video Downloader</h1>
      <form id="downloadForm" onSubmit={fetchData}>
        <label htmlFor="video_url">Enter YouTube Video URL:</label>
        <input 
          type="text" 
          id="video_url"
          placeholder="Search..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit">Get Formats</button>
      </form>

      <h2 id="videoTitle">{videoData?.fulltitle}</h2>
      <img id="videoThumbnail" src={videoData?.thumbnail} alt={videoData?.fulltitle} width="200" height="150" />

      <ul id="formatsList">
        {videoData?.formats.map((format, index) => (
          <li key={index}>
            <strong>Format: {format.format_note}</strong><br />
            Resolution: {format.resolution}<br />
            File Size: {format.filesize}<br />
            <a href={format.url} target="_blank" rel="noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
