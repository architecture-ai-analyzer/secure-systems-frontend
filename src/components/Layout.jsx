import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Projetos', href: '/projects', icon: '📁' },
    { name: 'Upload de Diagrama', href: '/upload', icon: '📤' },
    { name: 'Lista de Processamento', href: '/processing', icon: '📋' },
    { name: 'Relatórios', href: '/reports', icon: '📊' },
    { name: 'Consultar Status', href: '/status', icon: '🔍' },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === '/upload' && location.pathname === '/') ||
      (path === '/projects' && location.pathname === '/projects') ||
      (path === '/reports' && (location.pathname.startsWith('/reports/') || location.pathname.startsWith('/report/'))) ||
      (path === '/status' && location.pathname.startsWith('/status/'))
    );
  };

  return (
    <div className="min-h-screen bg-fiap-gray">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-primary p-2"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:inset-0
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-fiap-blue">
          <h1 className="text-xl font-bold text-white">FIAP Secure Systems</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive(item.href) 
                      ? 'bg-fiap-blue text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-500 text-center">
            <p>FIAP Secure Systems</p>
            <p>MVP v1.0</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <div className="pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;