import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, Folder, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-auto" src="/logo.png" alt="Your Logo" />
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
                  to="/shared"
                  icon={<Users className="w-5 h-5 mr-1.5" />}
                >
                  Shared Documents
                </NavLink>
                <NavLink
                  to="/my-documents"
                  icon={<Folder className="w-5 h-5 mr-1.5" />}
                >
                  My Documents
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-blue-100 p-1 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-500">
                <span className="sr-only">Logout</span>
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="bg-blue-100 inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink
            to="/file"
            icon={<FileText className="w-5 h-5 mr-1.5" />}
          >
            File
          </MobileNavLink>
          <MobileNavLink
            to="/shared"
            icon={<Users className="w-5 h-5 mr-1.5" />}
          >
            Shared Documents
          </MobileNavLink>
          <MobileNavLink
            to="/my-documents"
            icon={<Folder className="w-5 h-5 mr-1.5" />}
          >
            My Documents
          </MobileNavLink>
          <MobileNavLink
            to="/logout"
            icon={<LogOut className="w-5 h-5 mr-1.5" />}
          >
            Logout
          </MobileNavLink>
        </div>
      </div>
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
    className="text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
  >
    {icon}
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-blue-600 hover:bg-blue-100 hover:text-blue-800  px-3 py-2 rounded-md text-base font-medium flex items-center"
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
