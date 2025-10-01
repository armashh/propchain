import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';

const AppContent: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(['1', '4']);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const shortenAddress = useMemo(() => {
    if (!walletAddress) return null;
    const start = walletAddress.slice(0, 6);
    const end = walletAddress.slice(-4);
    return `${start}...${end}`;
  }, [walletAddress]);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={handleConnectWallet}
        walletConnected={walletConnected}
        address={shortenAddress}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={walletConnected}
              onConnectWallet={handleConnectWallet}
            />
          } 
        />
      </Routes>
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Connect Wallet</h2>
              <button onClick={() => setIsWalletModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {!window.ethereum && (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                <p className="font-medium">MetaMask not detected</p>
                <p className="text-sm mt-1">
                  Please install MetaMask to continue. 
                  <a className="text-blue-600 underline" href="https://metamask.io/download/" target="_blank" rel="noreferrer">Get MetaMask</a>
                </p>
              </div>
            )}
            {window.ethereum && (
              <button
                onClick={async () => {
                  try {
                    const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });
                    const account = Array.isArray(accounts) ? accounts[0] : accounts;
                    if (typeof account === 'string') {
                      setWalletAddress(account);
                      setWalletConnected(true);
                      setIsWalletModalOpen(false);
                    }
                  } catch (err) {
                    console.error('Wallet connection failed', err);
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-medium hover:from-blue-700 hover:to-emerald-600 transition-colors"
              >
                <span>MetaMask</span>
              </button>
            )}
            {walletConnected && walletAddress && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm">
                Connected: <span className="font-mono">{shortenAddress}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;