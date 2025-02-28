import React, { useState } from 'react';
import detect from 'bpm-detective';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Feedback from './Feedback.js';

function Upload(props) {
  let log = props.log;

  const query = new URLSearchParams(window.location.search);

  const [url, setUrl] = useState(query.get('url') ?? '');
  const [primaryBPM, setPrimaryBPM] = useState(``);
  const [isResultReady, setIsResultReady] = useState(false);

  function calculateBPM() {
    setIsResultReady(false);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new window.AudioContext();

    fetch(url)
      .then(async (response) => {
        const buffer = await response.arrayBuffer();

        const data = await new Promise((resolve, reject) => {
          context.decodeAudioData(buffer, resolve, reject);
        });

        const bpm = detect(data);
        setPrimaryBPM(bpm);
        setIsResultReady(true);
      })
      .catch((err) => {
        toast.error(`${err}`);
        console.error(err);
      });
  }

  return (
    <main className="content">
      {isResultReady && primaryBPM ? (
        <>
          <h2>{primaryBPM}</h2>
          <h3>BPM</h3>
        </>
      ) : null}

      {primaryBPM ? (
        <Feedback bpm={primaryBPM} log={log} type="file"></Feedback>
      ) : null}

      <br />

      <label for="url">
        URL of mp3/wav file&nbsp;|&nbsp;
        <span onClick={() => setUrl('/samples/bpmtechno-120.mp3')} className="hint">
          use sample
        </span>
      </label>
      <input
        id="url"
        type="url"
        placeholder="https://... mp3, wav"
        onChange={(e) => setUrl(e.target.value)}
        value={url}
      />
      <br />
      <br />
      <button className="button" onClick={calculateBPM}>
        Fetch and calculate
      </button>

      <br />
      <br />

      <p>
        Return to <a href="/">real-time BPM detection</a>
      </p>

      <ToastContainer />
    </main>
  );
}

export default Upload;
