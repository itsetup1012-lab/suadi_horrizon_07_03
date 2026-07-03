import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Saudi Horizon Fresh
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Admin Panel for Managing Fresh Products and Orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,234
              </div>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                567
              </div>
              <p className="text-gray-600">Active Products</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                89
              </div>
              <p className="text-gray-600">New Orders</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                $12,345
              </div>
              <p className="text-gray-600">Revenue Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="bg-blue-50 text-blue-600 rounded-full px-2 py-1 text-xs font-medium">NEW</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New User</h3>
              <p className="text-gray-600 text-sm mb-4">Create new user accounts</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add User
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M17 9l3 3m-3-3l-3-3m3 3V6" />
                  </svg>
                </div>
                <span className="bg-green-50 text-green-600 rounded-full px-2 py-1 text-xs font-medium">POPULAR</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm mb-4">Add, edit, or remove products</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Manage
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="bg-purple-50 text-purple-600 rounded-full px-2 py-1 text-xs font-medium">NEW</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm mb-4">Track and manage orders</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                View
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="bg-orange-50 text-orange-600 rounded-full px-2 py-1 text-xs font-medium">FEATURE</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-600 text-sm mb-4">Generate sales reports</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Generate
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Saudi Horizon Fresh
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Admin Panel for Managing Fresh Products and Orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,234
              </div>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                567
              </div>
              <p className="text-gray-600">Active Products</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                89
              </div>
              <p className="text-gray-600">New Orders</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                $12,345
              </div>
              <p className="text-gray-600">Revenue Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="bg-blue-50 text-blue-600 rounded-full px-2 py-1 text-xs font-medium">NEW</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New User</h3>
              <p className="text-gray-600 text-sm mb-4">Create new user accounts</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add User
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M17 9l3 3m-3-3l-3-3m3 3V6" />
                  </svg>
                </div>
                <span className="bg-green-50 text-green-600 rounded-full px-2 py-1 text-xs font-medium">POPULAR</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm mb-4">Add, edit, or remove products</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Manage
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="bg-purple-50 text-purple-600 rounded-full px-2 py-1 text-xs font-medium">NEW</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm mb-4">Track and manage orders</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                View
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="bg-orange-50 text-orange-600 rounded-full px-2 py-1 text-xs font-medium">FEATURE</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-600 text-sm mb-4">Generate sales reports</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Generate
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
