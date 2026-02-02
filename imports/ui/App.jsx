import { Counter } from "./Counter.jsx";
import { Info } from "./Info.jsx";
import { Header } from "./Header.jsx";

export const App = () => (
  <div className="page">
    <Header/>
    <main className="main">
      <Counter/>
      <Info/>
    </main>
  </div>
);
