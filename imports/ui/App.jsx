import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { NavLink } from "react-router";

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello/>
    <Info/>
    <br/>
    <NavLink to="/about">About Page</NavLink>
  </div>
);
