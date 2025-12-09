import { useLoaderData } from "react-router";
import { NavLink } from "react-router";

export const About = () => {
  const { about } = useLoaderData();
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <h2>About This Application</h2>
      <p>{about}</p>
    </div>
  );
}