export default function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">UP</span>
              </div>
              <span className="font-semibold text-gray-900">UnifyPost</span>
            </div>
          </div>

          {/* Links */}

          {/* Contact */}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50">
          <p className="text-center text-sm text-gray-600">
            © 2024 UnifyPost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
