import { Inter } from "next/font/google"
import { Metadata } from "next"
import { Providers } from "next-auth/react"
import { Notifier } from "sonner/react"
import { Toaster } from "sonner/react"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Saudi Horizon Fresh - Admin Panel",
  description: "Admin panel for Saudi Horizon Fresh",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  })

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <QueryClientProvider client={queryClient}>
            <Providers>
              <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                          Saudi Horizon Fresh
                        </h1>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          onClick={() => {
                            // Toggle theme
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            Admin
                          </span>
                          <button
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => {
                              // Logout
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Main Content Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-4">
                      <nav className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">
                          Navigation
                        </h2>
                        <ul className="space-y-2">
                          <li>
                            <a
                              href="/"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="/users"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Users
                            </a>
                          </li>
                          <li>
                            <a
                              href="/products"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Products
                            </a>
                          </li>
                          <li>
                            <a
                              href="/orders"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Orders
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {children}
                    </div>
                  </div>
                </main>

                {/* Footer Section */}
                <footer className="bg-white border-t border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-sm text-gray-500 text-center">
                      &copy; {new Date().getFullYear()} Saudi Horizon Fresh. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </Providers>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}import { Metadata } from "next"
import { Providers } from "next-auth/react"
import { Notifier } from "sonner/react"
import { Toaster } from "sonner/react"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Saudi Horizon Fresh - Admin Panel",
  description: "Admin panel for Saudi Horizon Fresh",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  })

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <QueryClientProvider client={queryClient}>
            <Providers>
              <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                          Saudi Horizon Fresh
                        </h1>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          onClick={() => {
                            // Toggle theme
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            Admin
                          </span>
                          <button
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => {
                              // Logout
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Main Content Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-4">
                      <nav className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">
                          Navigation
                        </h2>
                        <ul className="space-y-2">
                          <li>
                            <a
                              href="/"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="/users"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Users
                            </a>
                          </li>
                          <li>
                            <a
                              href="/products"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Products
                            </a>
                          </li>
                          <li>
                            <a
                              href="/orders"
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Orders
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {children}
                    </div>
                  </div>
                </main>

                {/* Footer Section */}
                <footer className="bg-white border-t border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-sm text-gray-500 text-center">
                      &copy; {new Date().getFullYear()} Saudi Horizon Fresh. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </Providers>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
