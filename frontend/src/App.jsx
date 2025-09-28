import { useAppContext } from './context/AppContext';
import Home from './components/Home';
import Checkout from './components/Checkout';
import ShippingForm from './components/ShippingForm';
import './App.css';

function App() {
  const { view } = useAppContext();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flapp E-commerce GithubActions</h1>
      </header>
      <main>
        {view === 'home' && <Home />}
        {view === 'checkout' && <Checkout />}
        {view === 'shipping' && <ShippingForm />}
      </main>
    </div>
  );
}

export default App;
