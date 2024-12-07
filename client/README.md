lazy loading, becoz when web app loads it will load all pages but I want to import dynamically basically code splitting using Lazy loading

import Home from './pages/Home';
const Home = Lazy(() => import('./pages/Home'))


<NavLink to={`?group=${item._id}`}></NavLink>
const [searchParams, setSearchParams] = useSearchParams();
  const groupId = searchParams.get('group') || 'No group selected';


   server: {
    host: '0.0.0.0', // Allow connections from other devices
    port: 3000,      // Specify a port (default: 5173)
  },