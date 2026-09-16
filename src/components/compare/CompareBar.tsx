import { useNavigate } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { FaExchangeAlt, FaTimes, FaTrash } from "react-icons/fa";

const CompareBar = () => {
  const { compareList, clearCompare, toggleCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 md:px-8 py-3 md:py-4"
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        boxShadow: "0 -4px 40px rgba(0,0,0,0.35)",
        borderTop: "2px solid rgba(249,115,22,0.4)",
      }}
    >
      {/* Left: icon + label */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center">
          <FaExchangeAlt className="text-orange-400" size={14} />
        </div>
        <div className="hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Compare
          </p>
          <p className="text-xs font-black text-white leading-none">
            {compareList.length} / 4 Products
          </p>
        </div>
      </div>

      {/* Centre: thumbnail slots */}
      <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto">
        {/* Filled slots */}
        {compareList.map((product) => (
          <div key={product.id} className="relative shrink-0 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 border-orange-500/50 bg-slate-700 shadow-lg">
              <img
                src={product.images?.[0] || "/images/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Remove single item */}
            <button
              onClick={() => toggleCompare(product)}
              title={`Remove ${product.name}`}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <FaTimes size={8} />
            </button>
          </div>
        ))}

        {/* Empty placeholder slots */}
        {Array.from({ length: 4 - compareList.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/50 flex items-center justify-center shrink-0"
          >
            <FaExchangeAlt size={12} className="text-slate-600" />
          </div>
        ))}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={clearCompare}
          title="Clear all"
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all"
        >
          <FaTrash size={10} />
          <span className="hidden md:inline">Clear</span>
        </button>
        <button
          onClick={() => navigate("/compare")}
          disabled={compareList.length < 2}
          className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: compareList.length >= 2
              ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
              : "#374151",
            boxShadow: compareList.length >= 2 ? "0 4px 15px rgba(249,115,22,0.4)" : "none",
          }}
        >
          <FaExchangeAlt size={10} />
          Compare Now
        </button>
      </div>
    </div>
  );
};

export default CompareBar;
