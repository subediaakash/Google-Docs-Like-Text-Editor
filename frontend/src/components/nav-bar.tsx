import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Users, Folder, LogOut, Menu, X, User } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <p className="font-bold text-xl text-black font-serif">WRITE X</p>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/file"
                  icon={<FileText className="w-5 h-5 mr-1.5" />}
                >
                  File
                </NavLink>
                <NavLink
                  to="/shared-documents"
                  icon={<Users className="w-5 h-5 mr-1.5" />}
                >
                  Shared
                </NavLink>
                <NavLink
                  to="/documents"
                  icon={<Folder className="w-5 h-5 mr-1.5" />}
                >
                  Documents
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button
                  className="text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white p-1 rounded-full"
                  onClick={toggleUserMenu}
                >
                  <User className="h-6 w-6" />
                  <span className="sr-only">Open user menu</span>
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white p-2 rounded-md"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle mobile menu</span>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink
              to="/file"
              icon={<FileText className="w-5 h-5 mr-1.5" />}
            >
              File
            </MobileNavLink>
            <MobileNavLink
              to="/shared-documents"
              icon={<Users className="w-5 h-5 mr-1.5" />}
            >
              Shared Documents
            </MobileNavLink>
            <MobileNavLink
              to="/documents"
              icon={<Folder className="w-5 h-5 mr-1.5" />}
            >
              My Documents
            </MobileNavLink>
            <MobileNavLink
              to="/profile"
              icon={<User className="w-5 h-5 mr-1.5" />}
            >
              Profile
            </MobileNavLink>
            <MobileNavLink
              to="/logout"
              icon={<LogOut className="w-5 h-5 mr-1.5" />}
            >
              Logout
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
  >
    {icon}
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-gray-600 hover:bg-gray-100 hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
