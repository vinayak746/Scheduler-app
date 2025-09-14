import { Toaster } from 'react-hot-toast';
import Calendar from "./components/Calendar";
import { useBackendStatus } from './hooks/useBackendStatus';
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { isBackendReady, isChecking } = useBackendStatus();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the backend server. Please make sure the backend is running and try again.
          </p>
          <div className="text-sm text-gray-500">
            <p>Attempting to reconnect automatically...</p>
            <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Toaster position="bottom-right" />
      <Calendar />
    </main>
  );
}

export default App;
