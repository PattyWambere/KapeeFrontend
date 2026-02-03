import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-blue-600 text-white text-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        {/* LEFT */}
        <div className="flex items-center divide-x divide-blue-400">
          <span className="px-3 cursor-pointer">
            English <i className="fa-solid fa-angle-down ml-1"></i>
          </span>

          <span className="px-3 cursor-pointer">
            $ Dollar (US) <i className="fa-solid fa-angle-down ml-1"></i>
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center divide-x divide-blue-400">
          <span className="px-3 uppercase">Welcome to our store!</span>

          <Link to="/blog" className="px-3 flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
            <i className="fa-regular fa-file-lines"></i> Blog
          </Link>

          <span className="px-3 flex items-center gap-1 cursor-pointer">
            <i className="fa-regular fa-circle-question"></i> FAQ
          </span>

          <Link to="/contact" className="px-3 flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
            <i className="fa-regular fa-envelope"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
