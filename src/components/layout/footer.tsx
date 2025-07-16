export default function Footer() {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">UP</span>
              </div>
              <span className="font-semibold text-white">UnifyPost</span>
            </div>
            <p className="text-sm text-gray-400">
              Multilingual content management platform powered by AI translation.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Ghost CMS Integration</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">AI Translation</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Multi-language Support</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Project Management</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">API Reference</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Community</li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <p className="text-center text-sm text-gray-500">
            © 2024 UnifyPost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
