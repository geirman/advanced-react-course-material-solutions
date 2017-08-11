/*
- Make the Play button work
- Make the Pause button work
- Disable the play button if it's playing
- Disable the pause button if it's not playing
- Make the PlayPause button work
- Make the JumpForward button work
- Make the JumpBack button work
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
const rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import './index.css';
import React from 'react';
import * as PropTypes from 'prop-types';
import podcast from './podcast.mp3';
import mario from './mariobros.mp3';
import FaPause from 'react-icons/lib/fa/pause';
import FaPlay from 'react-icons/lib/fa/play';
import FaRepeat from 'react-icons/lib/fa/repeat';
import FaRotateLeft from 'react-icons/lib/fa/rotate-left';

class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    loaded: false,
    duration: 0,
    currentTime: 0
  };

  static childContextTypes = {
    audio: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      audio: {
        ...this.state,
        play: () => {
          this.audio.play();
          this.setState({ isPlaying: true });
        },
        pause: () => {
          this.audio.pause();
          this.setState({ isPlaying: false });
        },
        skip: val => {
          console.log({ currentTime: this.audio.currentTime, targetTime: val });
          this.audio.currentTime = val;
        }
      }
    };
  }
  handleTimeUpdate = () => {
    this.setState({ currentTime: this.audio.currentTime });
  };
  render() {
    const { source } = this.props;
    return (
      <div className="audio-player">
        <audio
          src={source}
          onTimeUpdate={this.handleTimeUpdate}
          onLoadedData={() => {
            this.setState({
              loaded: true,
              duration: this.audio.duration
            });
          }}
          onEnded={() => this.setState({ isPlaying: false })}
          ref={n => (this.audio = n)}
        />
        {this.props.children}
      </div>
    );
  }
}

class Play extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };
  render() {
    const { isPlaying, play } = this.context.audio;
    return (
      <button
        className="icon-button"
        onClick={play}
        disabled={isPlaying}
        title="play"
      >
        <FaPlay />
      </button>
    );
  }
}

class Pause extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };
  render() {
    const { isPlaying, pause } = this.context.audio;
    return (
      <button
        className="icon-button"
        onClick={pause}
        disabled={!isPlaying}
        title="pause"
      >
        <FaPause />
      </button>
    );
  }
}

class PlayPause extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };
  render() {
    const { isPlaying } = this.context.audio;
    return isPlaying ? <Pause /> : <Play />;
  }
}

class JumpForward extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };
  render() {
    const { isPlaying, skip, currentTime } = this.context.audio;
    return (
      <button
        className="icon-button"
        onClick={() => skip(currentTime + 10)}
        disabled={!isPlaying}
        title="Forward 10 Seconds"
      >
        <FaRepeat />
      </button>
    );
  }
}

class JumpBack extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };
  render() {
    const { isPlaying, skip, currentTime } = this.context.audio;
    return (
      <button
        className="icon-button"
        onClick={() => skip(currentTime - 30)}
        disabled={!isPlaying}
        title="Back 10 Seconds"
      >
        <FaRotateLeft />
      </button>
    );
  }
}

class Progress extends React.Component {
  static contextTypes = {
    audio: PropTypes.object.isRequired
  };

  jumpTo = event => {
    const { skip, duration } = this.context.audio;
    const rect = this.node.getBoundingClientRect();
    const targetTime = (event.clientX - rect.left) / rect.width * duration;
    skip(targetTime);
  };

  render() {
    const { currentTime, duration, loaded } = this.context.audio;
    const progress = loaded ? currentTime / duration * 100 : 0;
    return (
      <div
        className="progress"
        onClick={this.jumpTo}
        ref={n => (this.node = n)}
      >
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`
          }}
        />
      </div>
    );
  }
}

const Exercise = () =>
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward /> {' '}
      <span className="player-text">
        React30 Episode 010: React Virtualized
      </span>
      <Progress />
    </AudioPlayer>
  </div>;

export default Exercise;
