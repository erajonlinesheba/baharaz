export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ðŸ‘¤ My Account Settings</h1>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold">Profile Information</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">N</div>
          <div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Change Avatar</button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" placeholder="Your Name" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" placeholder="email@example.com" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input type="text" placeholder="+8801XXXXXXXXX" className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold">Change Password</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input type="password" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">2FA Status</p>
            <p className="text-sm text-gray-500">Add extra security to your account</p>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Enable</button>
        </div>
      </div>

      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold">
        Save All Changes
      </button>
    </div>
  )
}
