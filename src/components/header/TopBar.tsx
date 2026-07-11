import { Link } from "react-router-dom";
import { useCurrency, type CurrencyType } from "../../context/CurrencyContext";

const TopBar = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-blue-600 text-white text-xs print:hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        {/* LEFT */}
        <div className="flex items-center divide-x divide-blue-400">
          <span className="px-3 cursor-pointer">
            English <i className="fa-solid fa-angle-down ml-1"></i>
          </span>

          <span className="px-3 cursor-pointer flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyType)}
              className="bg-transparent border-none text-white text-xs cursor-pointer outline-none focus:ring-0 appearance-none pr-4"
              style={{
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right .2em top 50%',
                backgroundSize: '.65em auto',
              }}
            >
              <option value="USD" className="text-gray-900">$ Dollar (US)</option>
              <option value="EUR" className="text-gray-900">€ Euro (EU)</option>
              <option value="GBP" className="text-gray-900">£ Pound (UK)</option>
              <option value="RWF" className="text-gray-900">FRW Franc (RWF)</option>
            </select>
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
