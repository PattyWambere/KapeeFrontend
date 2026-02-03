import {
  FaCcPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPaperPlane
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 mt-auto pt-20 border-t border-gray-900">
      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-8">
        {/* BRAND / INFO */}
        <div className="lg:col-span-4 space-y-8">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Kapee<span className="text-orange-500">.</span></h2>
          </Link>

          <p className="text-sm font-medium leading-relaxed max-w-sm">
            Crafting the finest desserts and sweet experiences since 2010. Our passion for quality ingredients and artisan baking defines every bite.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 border border-gray-800">
                <FaMapMarkerAlt className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Visit Us</p>
                <p className="text-xs">123 Dessert Lane, Sweet Valley, CA 90210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 border border-gray-800">
                <FaPhoneAlt className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Call Us</p>
                <p className="text-xs">+1 (555) DESSERTS</p>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Information</h4>
          <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
            <li>
              <Link to="/about" className="hover:text-orange-500 transition-colors duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-orange-500 transition-colors duration-300">
                Store Location
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-500 transition-colors duration-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-orange-500 transition-colors duration-300">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-orange-500 transition-colors duration-300">
                Latest News
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-orange-500 transition-colors duration-300">
                Our Sitemap
              </Link>
            </li>
          </ul>
        </div>

        {/* OUR SERVICE */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Our Service</h4>
          <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
            {[
              "Privacy Policy",
              "Terms of Sale",
              "Customer Service",
              "Delivery Information",
              "Payments",
              "Saved Cards",
            ].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-orange-500 transition-colors duration-300">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="lg:col-span-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Newsletter</h4>
          <p className="text-sm font-medium mb-6 leading-relaxed">
            Join the sweet list and get 20% off your first order! We promise only the best treats in your inbox.
          </p>

          <form className="relative flex w-full mb-8 group">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="w-full bg-gray-900 border-2 border-transparent px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-orange-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-orange-500 text-white px-6 rounded-xl hover:bg-white hover:text-orange-500 transition-all duration-300"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>

          {/* SOCIAL MEDIA */}
          <div className="flex items-center gap-4">
            {[
              { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
              { icon: <FaInstagram />, color: "hover:bg-pink-600" },
              { icon: <FaTwitter />, color: "hover:bg-sky-500" },
              { icon: <FaYoutube />, color: "hover:bg-red-600" }
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 text-white transition-all duration-500 ${social.color} hover:-translate-y-1 hover:shadow-xl`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-gray-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              &copy; 2024 KAPEE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors">Privacy</Link>
              <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors">Terms</Link>
              <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>

          {/* PAYMENT ICONS */}
          <div className="flex items-center gap-6 text-2xl grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <FaCcVisa className="hover:text-[#1a1f71]" />
            <FaCcMastercard className="hover:text-[#eb001b]" />
            <FaCcPaypal className="hover:text-[#003087]" />
            <FaCcAmex className="hover:text-[#007edc]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
