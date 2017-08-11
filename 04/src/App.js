/*
Create a `withStorage` higher order component that manages saving and retrieving
the `sidebarIsOpen` state to local storage
*/

import './index.css';
import React from 'react';
import MenuIcon from 'react-icons/lib/md/menu';
import { set, get, subscribe } from './local-storage';

const withPersistence = (key, defaultValue) => Comp => {
  return class WithPersistence extends React.Component {
    state = {
      [key]: get(key, defaultValue)
    };

    componentDidMount() {
      this.unsubscribe = subscribe(() => {
        this.setState({
          [key]: get(key)
        });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <Comp {...this.state} />;
    }
  };
};

class App extends React.Component {
  render() {
    const { sidebarIsOpen } = this.props;
    return (
      <div className="app">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              set('sidebarIsOpen', !sidebarIsOpen);
            }}
          >
            <MenuIcon />
          </button>
        </header>

        <div className="container">
          <aside className={sidebarIsOpen ? 'open' : 'closed'} />
          <main />
        </div>
      </div>
    );
  }
}

export default withPersistence('sidebarIsOpen', true)(App);
