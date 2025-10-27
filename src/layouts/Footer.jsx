export default function Footer() {
  return (
    <footer className="bg-[#000000] text-gray-300 py-5 border-t border-[#1DCD9F]/20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-4 text-center">
        
        {/* Brand */}
        <h2 className="text-[#1DCD9F] text-2xl font-bold">LearnHub</h2>
        <p className="text-gray-400 text-sm max-w-md">
          Empowering learners and educators through innovation and collaboration.
        </p>

        {/* Contact Email */}
        <div className="mt-2">
          <p className="text-gray-400">
            Contact me at:{" "}
            <a
              href="mailto:tamilkumaran021@gmail.com"
              className="text-[#1DCD9F] hover:underline"
            >
              tamilkumaran021@gmail.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-5 mt-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DCD9F] transition-all"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DCD9F] transition-all"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DCD9F] transition-all"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DCD9F] transition-all"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-500 text-sm mt-6 border-t border-[#1DCD9F]/10 pt-4">
        © {new Date().getFullYear()} <span className="text-[#1DCD9F] font-semibold">LearnHub</span>. All rights reserved.
      </div>
    </footer>
  );
}
