import { createBrowserRouter } from "react-router";
import { App } from "./App";
import { About } from "./About";

// https://reactrouter.com/start/data/routing
export const Routes = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      const response = await fetch('https://www.githubstatus.com/api/v2/summary.json');
      const data = await response.json();
      console.log('GitHub status:', data.status.description);
      return data.status.description;
    },
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
    loader: async () => {
      const about = await Meteor.callAsync('about');
      return { about };
    }
  }
]);