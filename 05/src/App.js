////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Refactor App by creating a new component named `<GeoPosition>`
// - <GeoPosition> should use a render prop callback that passes
//   the coords and error
// - When you're done, <App> should no longer have anything but
//   a render method
// - Now create a <GeoAddress> component that also uses a render
//   prop callback with the current address. You will use
//   `getAddressFromCoords(latitude, longitude)` to get the
//   address. It returns a promise.
// - You should be able to compose <GeoPosition> and <GeoAddress>
//   beneath it to naturally compose both the UI and the state
//   needed to render
// - Make sure <GeoAddress> supports the user moving positions
import './index.css';
import React from 'react';
import LoadingDots from './LoadingDots';
import Map from './Map';
import getAddressFromCoords from './getAddressFromCoords';

class GeoAddress extends React.Component {
  state = {
    address: null,
    error: null
  };

  componentDidMount() {
    if (this.props.coords) {
      this.fetch();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.coords !== prevProps.coords) {
      this.fetch();
    }
  }
  fetch() {
    const { lat, lng } = this.props.coords;
    getAddressFromCoords(lat, lng).then(
      address => this.setState({ address }),
      error => this.setState({ error })
    );
  }

  render() {
    return this.props.render(this.state);
  }
}

class GeoPosition extends React.Component {
  state = {
    coords: null,
    error: null
  };

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },
      error => {
        this.setState({ error });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }
  render() {
    return this.props.render(this.state);
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <GeoPosition
          render={({ coords, error }) =>
            error
              ? <div>
                  Error: {error.message}
                </div>
              : coords
                ? <GeoAddress
                    coords={coords}
                    render={({ address, error }) =>
                      <Map
                        lat={coords.lat}
                        lng={coords.lng}
                        info={error || address || 'You are here!'}
                      />}
                  />
                : <LoadingDots />}
        />
      </div>
    );
  }
}

export default App;
