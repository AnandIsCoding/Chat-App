lazy loading, becoz when web app loads it will load all pages but I want to import dynamically basically code splitting using Lazy loading

import Home from './pages/Home';
const Home = Lazy(() => import('./pages/Home'))