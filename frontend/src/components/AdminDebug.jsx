import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminDebug = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, getUserProfile, checkAdminRole } = useAuthStore();
  const [tokenExists, setTokenExists] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setChecking(true);
      // Check if token exists
      const token = localStorage.getItem('token');
      setTokenExists(!!token);
      
      if (token) {
        if (!isAuthenticated || !user) {
          // Try to get user profile if token exists but no user
          try {
            await getUserProfile();
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        
        // Check if user is admin
        try {
          const adminCheck = await checkAdminRole();
          setIsAdmin(adminCheck);
        } catch (error) {
          console.error('Error checking admin role:', error);
        }
      }
      
      setChecking(false);
    };
    
    checkAuth();
  }, [isAuthenticated, user, getUserProfile, checkAdminRole]);
  
  const handleGoToAdmin = () => {
    navigate('/admin');
  };
  
  const handleRefreshToken = async () => {
    // Remove token and refetch
    localStorage.removeItem('token');
    window.location.reload();
  };
  
  if (checking) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Checking Admin Access...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-2xl font-bold mb-4">Admin Access Checker</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Authentication Status</h2>
              <div className="bg-[#232136] p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Token exists:</span>
                  <span className={tokenExists ? "text-green-400" : "text-red-400"}>
                    {tokenExists ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Is authenticated:</span>
                  <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
                    {isAuthenticated ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>User data loaded:</span>
                  <span className={user ? "text-green-400" : "text-red-400"}>
                    {user ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Is admin:</span>
                  <span className={isAdmin ? "text-green-400" : "text-red-400"}>
                    {isAdmin ? "Yes" : "No"}
                  </span>
                </div>
                {user && (
                  <div className="flex justify-between">
                    <span>User role:</span>
                    <span className={user.role === 'admin' ? "text-green-400" : "text-yellow-400"}>
                      {user.role || "Not set"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">User Information</h2>
              <div className="bg-[#232136] p-4 rounded-lg">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span className="font-mono text-xs">{user._id}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-400">No user data available</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="flex flex-col space-y-2">
                {isAdmin && (
                  <button
                    onClick={handleGoToAdmin}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                  >
                    Go to Admin Panel
                  </button>
                )}
                <button
                  onClick={handleRefreshToken}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Clear Token & Reload
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Back to Home
                </button>
              </div>
            </div>
            
            {!isAdmin && (
              <div className="bg-yellow-900/30 text-yellow-300 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Admin Access Needed</h3>
                <p className="text-sm">You don't have admin privileges. To access the admin panel:</p>
                <ol className="list-decimal ml-5 mt-2 text-sm space-y-1">
                  <li>Ensure you're logged in with an admin account</li>
                  <li>Check that your user role is set to "admin" in the database</li>
                  <li>Try logging out and logging back in</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug; 