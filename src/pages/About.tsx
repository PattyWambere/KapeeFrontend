import PageHeader from "../components/header/PageHeader";
import {
  FaBullseye,
  FaAward,
  FaLeaf,
  FaUsers,
  FaShippingFast,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Icon map for value cards (cycles through icons)
const valueIcons = [
  <FaBullseye size={22} />,
  <FaAward size={22} />,
  <FaLeaf size={22} />,
  <FaUsers size={22} />,
];

// Icon map for why-items (cycles through icons)
const whyIcons = [
  <FaShippingFast />,
  <FaStar />,
  <FaLeaf />,
];

const About = () => {
  const { aboutContent } = useContent();
  const { hero, stats, values, team, whyItems } = aboutContent;

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="Our Story" />

      {/* ── Hero Story Section ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-100 rounded-[50px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                alt="GuraFaster Fashion Store"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500 rounded-[40px] p-8 hidden md:flex flex-col justify-end text-white shadow-2xl">
              <span className="text-5xl font-black">10+</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                Years Shaping Style
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic">
              {hero.tag}
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              {hero.headline}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              {hero.paragraph1}
            </p>
            <p className="text-base text-gray-400 font-medium leading-relaxed">
              {hero.paragraph2}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-blue-600 text-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-black transition-all duration-300 rounded-none"
              >
                Shop the Collection
              </Link>
              <Link
                to="/contact"
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 font-black uppercase tracking-widest text-xs hover:border-blue-600 hover:text-blue-600 transition-all duration-300 rounded-none"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Banner ───────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="bg-black py-16 my-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl md:text-5xl font-black text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Core Values ────────────────────────────────────────────────────── */}
      {values.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic mb-4">
              What We Stand For
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Our Core Values
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center text-orange-500 group-hover:text-white shadow-sm mb-6 transition-all duration-500">
                  {valueIcons[i % valueIcons.length]}
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-3">
                  {v.title}
                </h4>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Meet the Team ──────────────────────────────────────────────────── */}
      {team.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic mb-4">
                The People Behind GuraFaster
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                Meet Our Team
              </h3>
            </div>

            <div
              className={`grid gap-10 ${
                team.length === 1
                  ? "grid-cols-1 max-w-xs mx-auto"
                  : team.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto"
                  : "grid-cols-1 sm:grid-cols-3"
              }`}
            >
              {team.map((member, i) => (
                <div key={i} className="group text-center">
                  <div className="w-48 h-48 mx-auto rounded-[40px] overflow-hidden shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-black">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">
                    {member.name}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mt-1">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose GuraFaster ──────────────────────────────────────────── */}
      {whyItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic">
                Why GuraFaster?
              </h2>
              <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
                Fashion Delivered. Style Defined.
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed text-sm">
                We're not just another online store. GuraFaster is a curated
                experience that brings you the best of global fashion with the
                speed and convenience of local delivery.
              </p>
              {whyItems.map((item, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center text-blue-600 group-hover:text-white shrink-0 transition-all duration-300 text-lg">
                    {whyIcons[i % whyIcons.length]}
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-1">
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                alt="GuraFaster Collections"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">
                  New Season
                </p>
                <p className="text-2xl font-black uppercase tracking-tighter">
                  2026 Collections
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
