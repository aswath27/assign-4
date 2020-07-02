import React, { useState } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Home } from './components/home/Home';
import { MovieDetail } from './components/moviedetail/MovieDetail';
import Search from './components/search'
import axios from 'axios';
import Results from './components/Results'
import Popup from './components/Popup'

export function App() {
  const [state,setState] = useState({
    s:"",
    results: [],
    selected: {}
  });
  const apiurl = "http://www.omdbapi.com/?i=tt3896198&apikey=95a7bb62";

  const search = (e) => {
    if (e.key === "Enter") {
    axios(apiurl + "&s=" + state.s).then(({ data }) => {
      let results = data.Search;

      setState(prevState => {
        return{ ...prevState, results: results}
      })
    });
    }
  }
  const handleInput = (e) => {
    let s = e.target.value;

    setState(prevState => {
      return { ...prevState, s: s }
    });
  }

  const openPopup = id => {
    axios(apiurl + "&i=" + id).then(({ data }) => {
      let result = data;

      setState(prevState => {
        return { ...prevState, selected: result }
      });
    });
  }

  const closePopup = () => {
    setState(prevState => {
      return { ...prevState, selected: {} }
    });
  }

  return (
    <main>
      <Search handleInput={handleInput} search={search} />
      <Results results={state.results}  openPopup={openPopup} />
      {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} /> : false}
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/movie/:id" component={MovieDetail} />
      </Switch>
    </main>
  );
}

export default App;
