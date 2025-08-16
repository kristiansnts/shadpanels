export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{{APP_NAME}} Admin</h1>
          <nav className="flex space-x-4">
            <a href="/admin" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/admin/users" className="text-gray-600 hover:text-gray-900">Users</a>
            <a href="/admin/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">Logout</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}