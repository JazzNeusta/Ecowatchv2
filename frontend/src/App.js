import { useEffect, useState } from "react";
import "./styles/global.css";
import "./App.css";
import ExampleUiPage from "./pages/ExampleUiPage";
import MOD_PAGES from "./mods/registry";
import { apiGet } from "./services/api";

const HOME = { name: "accueil", label: "Accueil" };

function App() {
  const [mods, setMods] = useState([]);
  const [current, setCurrent] = useState(HOME.name);

  useEffect(() => {
    apiGet("/mods")
      .then((enabled) => setMods(enabled.filter((mod) => MOD_PAGES[mod.name])))
      .catch(() => setMods([]));
  }, []);

  const CurrentPage = MOD_PAGES[current] || ExampleUiPage;

  return (
    <>
      <nav className="ew-nav" aria-label="Navigation principale">
        {[HOME, ...mods].map((item) => (
          <button
            key={item.name}
            type="button"
            className={`ew-nav__item ${item.name === current ? "ew-nav__item--active" : ""}`.trim()}
            aria-current={item.name === current ? "page" : undefined}
            title={item.description}
            onClick={() => setCurrent(item.name)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <CurrentPage />
    </>
  );
}

export default App;
