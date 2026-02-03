import PageHeader from "../components/header/PageHeader";
import { FaBullseye, FaAward } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="Our Story" />

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-100 rounded-[50px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                alt="Fashion Store"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500 rounded-[40px] p-8 hidden md:flex flex-col justify-end text-white shadow-2xl">
              <span className="text-5xl font-black">10</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Years of Style Excellence</span>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic">Style & Passion</h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">Curating Fashion Trends Since 2015</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              What started as a passion for bringing unique fashion pieces to discerning customers has grown into a premier destination for style enthusiasts. We believe that fashion is more than clothing—it's an expression of who you are, and we're here to help you shine.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                  <FaBullseye size={24} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Our Mission</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase">To empower individuals through fashion that reflects their unique style and personality.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                  <FaAward size={24} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Our Quality</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase">Carefully curated collections from trusted brands and emerging designers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
