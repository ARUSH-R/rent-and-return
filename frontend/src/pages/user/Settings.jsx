import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

/**
 * Settings Page
 * - Allows user to update their profile settings
 * - Supports updating name, email, password, and (optionally) profile image
 */
const Settings = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // Fetch current user data
    fetch("/api/user/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setForm((f) => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
        }));
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setError("");

    if (
      (form.newPassword || form.confirmPassword) &&
      form.newPassword !== form.confirmPassword
    ) {
      setError("New password and confirm password do not match");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        ...(form.currentPassword && form.newPassword
          ? {
              currentPassword: form.currentPassword,
              newPassword: form.newPassword,
            }
          : {}),
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update settings");
      }
      setSuccessMsg("Profile updated successfully!");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Settings</h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={handleInput}
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={handleInput}
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full border rounded px-3 py-2"
              value={form.currentPassword}
              onChange={handleInput}
              placeholder="Enter current password to change password"
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full border rounded px-3 py-2"
              value={form.newPassword}
              onChange={handleInput}
              placeholder="Leave blank if not changing"
              disabled={submitting}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border rounded px-3 py-2"
              value={form.confirmPassword}
              onChange={handleInput}
              placeholder="Repeat new password"
              disabled={submitting}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {successMsg && <div className="text-green-700">{successMsg}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;