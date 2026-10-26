import JarvisPage from "./jarvis/JarvisPage";
import BioSensePage from "./biosense/BioSensePage";
import SentinelPage from "./sentinel/SentinelPage";

// Page de chaque mod. Un mod n'apparaît dans le menu que si le backend
// l'a activé (variable ENABLED_MODS côté backend).
const MOD_PAGES = {
  jarvis: JarvisPage,
  biosense: BioSensePage,
  sentinel: SentinelPage,
};

export default MOD_PAGES;
