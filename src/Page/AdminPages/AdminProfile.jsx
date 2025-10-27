import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAuthError = (err) => {
    const status = err.response?.status;
    if (status === 403) {
      alert("Login first to access this page");
      navigate("/auth");
    } else if (status === 401) {
      alert("Your session expired. Please login again.");
      navigate("/auth");
    } else if (status === 404) {
      alert("You can't access this page");
      navigate("/auth");
    } else {
      alert("Something went wrong. Please login again.");
      navigate("/auth");
    }
  };

  const fetchProfile = async () => {
    try {
      const loginRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (loginRes.data?.data) {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}admin/profile`,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setProfile(profileRes.data.data);
      }
    } catch (err) {
      console.log("Error checking login or fetching profile:", err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#222222] border border-[#1DCD9F]/30 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#1DCD9F] mb-6">Admin Profile</h1>

        {loading ? (
          <p className="text-gray-400 animate-pulse">Loading profile...</p>
        ) : profile ? (
          <div className="space-y-4 text-gray-300">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-[#1DCD9F]/20 flex items-center justify-center text-[#1DCD9F] text-2xl font-semibold uppercase">
                {profile.name?.charAt(0) || "A"}
              </div>
              <h2 className="text-xl font-semibold text-white mt-2">
                {profile.name}
              </h2>
              <p className="text-[#1DCD9F] font-medium">Role: Admin</p>
            </div>

            <div className="border-t border-[#1DCD9F]/30 pt-4 space-y-2">
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg">{profile.email}</p>

              <div className="mt-4">
                <p className="text-sm text-gray-400">Courses Created</p>
                <p className="text-lg text-[#1DCD9F] font-semibold">
                  {profile.courses?.length || 0}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 bg-[#169976] hover:bg-[#1DCD9F] text-white font-semibold py-2 px-6 rounded-lg transition-all"
            >
              ← Go Back
            </button>
          </div>
        ) : (
          <p className="text-red-400">Failed to load profile.</p>
        )}
      </div>
    </div>
  );
}
