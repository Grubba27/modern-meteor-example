import { NavLink } from "react-router";
import MeteorLogo from "./meteor-logo.svg";
import { useLoaderData } from "react-router";

export const Header = () => {
  const gitHubStatus = useLoaderData();
  console.log('Loader data in Header:', gitHubStatus)

  return (
    <div className="header">
      <nav className="nav container">
        <div className="logo-container">
          <MeteorLogo className="logo" />
        </div>
      <h1 className="page-title">Welcome to Meteor!</h1>
      <div className="github-status">GitHub Status: {gitHubStatus}</div>
      </nav>

    </div>
  )
}