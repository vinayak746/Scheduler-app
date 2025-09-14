import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useBackendStatus() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkBackend = async () => {
      if (!isMounted) return;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          credentials: 'same-origin' // Include cookies if needed
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok' && isMounted) {
            setIsBackendReady(true);
            setIsChecking(false);
            return;
          }
        }
        throw new Error('Backend not ready');
      } catch (error) {
        if (isMounted) {
          console.error('Backend connection error:', error);
          setIsBackendReady(false);
          
          // Only show error toast if this is the first check
          if (isChecking) {
            toast.error('Connecting to the backend...', {
              duration: 3000,
              position: 'top-center',
              icon: '🔄',
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    // Initial check
    checkBackend();

    // Set up polling every 5 seconds
    const intervalId = setInterval(checkBackend, 5000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { isBackendReady, isChecking };
}
