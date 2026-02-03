import { useState } from "react";
import PageHeader from "../components/header/PageHeader";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaChevronRight, FaSearch } from "react-icons/fa";

const Blog = () => {
  const [activeTab, setActiveTab] = useState<"recent" | "popular" | "comments">("recent");

  const posts = [
    {
      id: 1,
      title: "Do you Have A Passion for Photography",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem...",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
      date: "May 15, 2019",
      author: "Hasmin Dyes",
      category: "BEAUTIFUL LIFESTYLE"
    },
    {
      id: 2,
      title: "Notify What Makes You Happy, Smile More!",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem...",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop",
      date: "May 20, 2019",
      author: "Mariana Silva",
      category: "HELPFUL TRAVEL"
    },
    {
      id: 3,
      title: "Fashion Elements In This Right Summer",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem...",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2072&auto=format&fit=crop",
      date: "May 16, 2019",
      author: "Hasmin Dyes",
      category: "BEAUTIFUL LIFESTYLE, TRAVEL"
    },
    {
      id: 4,
      title: "Understanding My Brand, I Go Beyond The Surface",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem...",
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
      date: "Apr 28, 2019",
      author: "Mariana Silva",
      category: "ACCESSORIES BEAUTY, TRAVEL"
    }
  ];

  const recentPosts = [
    { title: "Do you Have A Passion for Photography", date: "May 15, 2019", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop" },
    { title: "Notify What Makes You Happy, Smile More!", date: "May 20, 2019", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&auto=format&fit=crop" },
    { title: "Fashion Elements In This Right Summer", date: "May 27, 2019", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=100&auto=format&fit=crop" },
    { title: "Understanding My Brand, I Go Beyond The Surface", date: "Mar 11, 2019", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=100&auto=format&fit=crop" },
    { title: "My Life Style Is...", date: "Mar 11, 2019", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=100&auto=format&fit=crop" }
  ];

  const archives = ["May 2019", "April 2019", "March 2019"];
  const categories = ["Accessories", "Beauty", "Design", "Fashion Design", "Lifestyle"];

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="Our Blog" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Blog Posts */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6 shadow-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600">
                      {post.category}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-blue-500" size={10} />
                        By {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500" size={10} />
                        {post.date}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link to="#" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-orange-500 transition-all">
                      Continue Reading
                      <FaChevronRight size={8} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white hover:bg-blue-700 transition">
                <FaSearch size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200">
                {(["recent", "popular", "comments"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Recent Posts List */}
              <div className="pt-6 space-y-5">
                {recentPosts.map((post, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer">
                    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-tight mb-1">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archives */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 flex justify-between items-center cursor-pointer">
                Archives
                <FaChevronRight size={10} className="text-gray-400" />
              </h3>
              <ul className="space-y-3">
                {archives.map((archive, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition">
                      {archive}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 flex justify-between items-center cursor-pointer">
                Categories
                <FaChevronRight size={10} className="text-gray-400" />
              </h3>
              <ul className="space-y-3">
                {categories.map((category, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
