import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TacticsPage from "./pages/TacticsPage/TacticsPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";

import { connect } from "react-redux"

const mapStateToProps = state => {
  return {
    count: state.counter.count,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    increaseCounter: () => dispatch({type:1}),
    decreaseCounter: () => dispatch({type:0}),
  }
}

function App(props) {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/tactics" element={<TacticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <button onClick={(e) => props.increaseCounter()}>icreaseeeeeeeee</button>
      {props.count}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App)