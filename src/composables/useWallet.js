// useWallet.js
import { ref, onMounted, onUnmounted } from 'vue';
import { ethers } from 'ethers';

const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14a34', // 84531 in decimal
  chainName: 'Base Sepolia Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'], // Replace with your preferred RPC URL
  blockExplorerUrls: ['https://base-sepolia.blockscout.com'],
};

const BSC_TESTNET_CONFIG = {
  chainId: '0x61', // 97 in decimal
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'], // BSC Testnet RPC
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

export function useWallet() {
  const address = ref('');
  const balance = ref('0');
  const isConnected = ref(false);
  const isCorrectChain = ref(false);
  const error = ref('');
  const isLoading = ref(false);
  const currentNetwork = ref('base'); // Add network tracking

  // Enum-like object for networks
  const NETWORKS = {
    BASE_SEPOLIA: {
      config: BASE_SEPOLIA_CONFIG,
      name: 'base'
    },
    BSC_TESTNET: {
      config: BSC_TESTNET_CONFIG,
      name: 'bsc'
    }
  };

  // Check if the current chain is the specified network
  async function checkChainId(network = NETWORKS.BASE_SEPOLIA) {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = chainId === network.config.chainId;
      isCorrectChain.value = isCorrect;
      if (isCorrect) currentNetwork.value = network.name;
      return isCorrect;
    } catch (err) {
      console.error('Error checking chain ID:', err);
      return false;
    }
  }

  // Switch to specified Chain or add it if not present
  async function switchToChain(network = NETWORKS.BASE_SEPOLIA) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.config.chainId }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network.config],
          });
          return true;
        } catch (addError) {
          console.error(`Error adding ${network.name} Chain:`, addError);
          error.value = `Failed to add ${network.name} Chain to wallet`;
          return false;
        }
      }
      console.error(`Error switching to ${network.name} Chain:`, switchError);
      error.value = `Failed to switch to ${network.name} Chain`;
      return false;
    }
  }

  async function updateBalance(addr) {
    if (typeof window.ethereum !== 'undefined' && addr) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(addr);
        balance.value = ethers.formatEther(bal);
      } catch (err) {
        console.error('Error updating balance:', err);
        balance.value = '0';
      }
    }
  }

  async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          // Check if we were previously connected in this session
          const wasConnected = sessionStorage.getItem('walletConnected') === 'true';
          if (wasConnected) {
            // Try Base Sepolia first
            let isCorrectNetwork = await checkChainId(NETWORKS.BASE_SEPOLIA);
            
            // If not Base Sepolia, try BSC Testnet
            if (!isCorrectNetwork) {
              isCorrectNetwork = await checkChainId(NETWORKS.BSC_TESTNET);
            }

            if (isCorrectNetwork) {
              address.value = accounts[0].address;
              await updateBalance(accounts[0].address);
              isConnected.value = true;
              isCorrectChain.value = true;
            } else {
              // Don't auto-connect if on the wrong network
              sessionStorage.removeItem('walletConnected');
            }
          }
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    }
  }

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else if (accounts[0] !== address.value) {
      // User switched to a different account
      address.value = accounts[0];
      await updateBalance(accounts[0]);
      isConnected.value = true;
    }
  }

  async function handleChainChanged(chainId) {
    // Check if the chainId matches either Base Sepolia or BSC Testnet
    let isCorrectNetwork = false;
    
    if (chainId === NETWORKS.BASE_SEPOLIA.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.BASE_SEPOLIA.name;
    } else if (chainId === NETWORKS.BSC_TESTNET.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.BSC_TESTNET.name;
    }

    isCorrectChain.value = isCorrectNetwork;
    
    if (!isCorrectNetwork && isConnected.value) {
      error.value = 'Please switch to Base Sepolia or BSC Testnet';
    } else {
      error.value = '';
    }
    
    // Reload the page to avoid any state inconsistencies
    window.location.reload();
  }

  async function connect(preferredNetwork = 'base') {
    if (typeof window.ethereum === 'undefined') {
      error.value = 'Please install MetaMask!';
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Choose network configuration
      const network = preferredNetwork === 'bsc' 
        ? NETWORKS.BSC_TESTNET 
        : NETWORKS.BASE_SEPOLIA;

      // Ensure we're on the correct network
      let isCorrectNetwork = await checkChainId(network);
      if (!isCorrectNetwork) {
        const switched = await switchToChain(network);
        if (!switched) {
          throw new Error(`Failed to switch to ${network.name} Chain`);
        }
      }

      // Get provider and address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      // Update state
      address.value = addr;
      await updateBalance(addr);
      isConnected.value = true;
      isCorrectChain.value = true;
      currentNetwork.value = network.name;

      // Save connection state to session storage
      sessionStorage.setItem('walletConnected', 'true');
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      error.value = err.message || 'Failed to connect wallet';
      disconnectWallet();
    } finally {
      isLoading.value = false;
    }
  }

  function disconnectWallet() {
    isConnected.value = false;
    isCorrectChain.value = false;
    address.value = '';
    balance.value = '0';
    error.value = '';
    currentNetwork.value = 'base';
    sessionStorage.removeItem('walletConnected');
  }

  // Setup event listeners
  onMounted(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  });

  // Cleanup event listeners
  onUnmounted(() => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  });

  return {
    connect,
    disconnectWallet,
    address,
    balance,
    isConnected,
    isCorrectChain,
    error,
    isLoading,
    currentNetwork, // Expose the current network
  };
}