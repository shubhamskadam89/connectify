import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Dashboard: React.FC = () => {
  const { user, accessToken, refreshToken, logout } = useAuth();

  return (
    <div className="max-w-2xl w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-400">Dashboard</h2>
          <p className="text-xs text-gray-400">Successfully Authenticated Session</p>
        </div>
        <Button onClick={logout} variant="secondary" className="w-auto">
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        {/* User Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-300">User Profile</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-md border border-gray-800">
            <div>
              <p className="text-xs text-gray-500 font-medium">Username</p>
              <p className="text-sm font-semibold">{user?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Address</p>
              <p className="text-sm font-semibold">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">First Name</p>
              <p className="text-sm font-semibold">{user?.firstName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Last Name</p>
              <p className="text-sm font-semibold">{user?.lastName || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Debug Token Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Auth Token Debugger</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 font-medium">Access Token (JWT)</span>
                <button
                  onClick={() => {
                    if (accessToken) navigator.clipboard.writeText(accessToken);
                  }}
                  className="text-[10px] text-purple-400 hover:text-purple-300 focus:outline-none"
                >
                  Copy Token
                </button>
              </div>
              <div className="bg-gray-900 p-3 rounded-md border border-gray-800 font-mono text-[11px] break-all max-h-24 overflow-y-auto text-gray-300 select-all">
                {accessToken || 'None'}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 font-medium">Refresh Token</span>
                <button
                  onClick={() => {
                    if (refreshToken) navigator.clipboard.writeText(refreshToken);
                  }}
                  className="text-[10px] text-purple-400 hover:text-purple-300 focus:outline-none"
                >
                  Copy Token
                </button>
              </div>
              <div className="bg-gray-900 p-3 rounded-md border border-gray-800 font-mono text-[11px] break-all max-h-24 overflow-y-auto text-gray-300 select-all">
                {refreshToken || 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
