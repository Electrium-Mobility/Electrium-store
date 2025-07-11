export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      <form className="bg-white p-6 rounded shadow max-w-xl">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Email Notifications
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Theme</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Language
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
