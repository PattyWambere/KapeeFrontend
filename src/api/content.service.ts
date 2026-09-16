// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutValue {
  title: string;
  desc: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface WhyItem {
  title: string;
  desc: string;
}

export interface AboutHero {
  tag: string;
  headline: string;
  paragraph1: string;
  paragraph2: string;
}

export interface AboutContent {
  hero: AboutHero;
  stats: AboutStat[];
  values: AboutValue[];
  team: TeamMember[];
  whyItems: WhyItem[];
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How to Build a Capsule Wardrobe on a Budget",
    excerpt:
      "A capsule wardrobe is the secret to looking effortlessly stylish every single day. Discover how to pick versatile pieces that mix and match with ease.",
    content:
      "A capsule wardrobe is a curated collection of timeless, versatile clothing pieces that never go out of style. The idea was popularised by Susie Faux in the 1970s and later brought to mainstream fashion by Donna Karan's 'Seven Easy Pieces' collection.\n\nThe key is to start small and intentional. Begin by auditing your existing wardrobe. Pull out every item you own and ask yourself: does this fit well? Does it make me feel confident? Can I wear it with at least three other things I own? If an item fails any of these tests, it may not belong in your capsule.\n\nA solid budget capsule typically includes: two pairs of well-fitting jeans (one dark, one light), three neutral-coloured t-shirts, one classic white button-down shirt, one smart blazer, one versatile dress or tailored trousers, a comfortable pair of white trainers, and one pair of smart leather shoes or boots.\n\nShopping smart means buying quality over quantity. A single well-made piece that lasts three years beats three cheap items that fall apart in three months. Look for natural fabrics like cotton, linen, and wool — they breathe better, age more gracefully, and are kinder to the environment.\n\nFinally, resist the urge to constantly add new pieces. The beauty of a capsule wardrobe is in its restraint. When you truly need something new, replace rather than accumulate. Your wardrobe — and your wallet — will thank you.",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
    date: "September 10, 2026",
    author: "Amara Diallo",
    category: "STYLE GUIDE",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Men's Fashion Trends You Need to Know in 2026",
    excerpt:
      "From relaxed tailoring to bold textures, 2026 is redefining menswear. Here's your complete guide to what's in season and how to wear it.",
    content:
      "2026 is shaping up to be one of the most exciting years in menswear history. After years of pandemic-driven casualwear dominating our wardrobes, fashion is swinging back toward polish — but with a relaxed, lived-in ease that feels entirely modern.\n\nRelaxed Tailoring: The most significant shift is in how men are wearing suits and tailored pieces. Forget the rigid, structured silhouettes of the past. Today's tailoring is softer, with unstructured blazers, wide-leg trousers, and open collars replacing ties. Think 'borrowed from a stylish older brother who works in a creative field.'\n\nBold Textures: Bouclé, corduroy, and heavy-weight knits are having a major moment. These tactile fabrics add depth and visual interest to even the simplest outfits. A camel bouclé blazer over a plain white tee and dark jeans is an effortlessly elevated look for 2026.\n\nEarthy Colour Palette: Rust, terracotta, olive, and warm browns are the colours of the season. These tones work beautifully together and pair naturally with the neutral basics most men already have in their wardrobe.\n\nFootwear: Chunky loafers and square-toe boots are leading the way. Clean white leather trainers remain a staple, but the real conversation is happening with elevated casual footwear that bridges the gap between smart and relaxed.\n\nThe key takeaway: invest in one or two statement pieces this season, build around your existing basics, and dress with confidence. Fashion is most powerful when it reflects your genuine personality.",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop",
    date: "September 5, 2026",
    author: "Kofi Mensah",
    category: "MEN'S FASHION",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Women's Accessories in 2026",
    excerpt:
      "Accessories make or break an outfit. From statement bags to layered necklaces, find out which accessories GuraFaster stylists are loving this season.",
    content:
      "It's often said that accessories are the exclamation point of a great outfit — and in 2026, that statement has never been more true. The right accessories can transform a basic jeans-and-tee combination into a deliberate, fashion-forward look.\n\nBags: Oversized totes are back and bigger than ever. Think structured leather shoppers in cognac, camel, or deep burgundy. On the other end of the spectrum, micro bags remain a playful choice for evening events. The key bag investment for 2026? A quality, structured shoulder bag in a neutral tone that works day to night.\n\nJewellery: Layering is everything. Multiple fine chains of varying lengths worn together, mixed metals (gold and silver together is officially on-trend), and architectural ear cuffs are the jewellery moves to make this season. Chunky, sculptural rings worn across multiple fingers are also a strong statement.\n\nScarves & Headwear: Silk scarves are being worn in every way imaginable — tied around the neck, looped through bag handles, worn as headbands, or even knotted at the wrist. Wide-brimmed hats and structured bucket hats complete the look for outdoor occasions.\n\nShoes: Block-heel mules and kitten heels are the sophisticated choices of the season, offering style without sacrificing comfort. For a sportier edge, chunky platform sandals and embellished trainers are making a strong statement.\n\nRemember: accessories should reflect your personality. Mix, experiment, and don't be afraid to make bold choices. The best accessory is confidence.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2072&auto=format&fit=crop",
    date: "August 28, 2026",
    author: "Priya Nair",
    category: "ACCESSORIES",
    readTime: "4 min read",
  },
  {
    id: 4,
    title: "Fast Fashion vs Slow Fashion: What GuraFaster Believes",
    excerpt:
      "We explore both ends of the fashion spectrum and share our philosophy on how GuraFaster is working to bring you quality pieces that last beyond a season.",
    content:
      "The fashion industry is one of the largest contributors to global pollution, accounting for approximately 10% of annual carbon emissions and producing 92 million tonnes of textile waste every year. As a retailer, we feel a deep responsibility to be part of the solution, not the problem.\n\nFast fashion, characterised by rapidly produced, low-cost clothing designed to be worn a handful of times before being discarded, has dominated the industry for decades. It's made fashion accessible and affordable, which is genuinely valuable. But the environmental and human cost — from polluted waterways to exploitative labour practices — is too high to ignore.\n\nSlow fashion takes the opposite approach: investing in fewer, better-made garments that are designed to last. It's about understanding where your clothes come from, who made them, and what they're made of. It's about buying with intention rather than impulse.\n\nAt GuraFaster, we occupy a thoughtful middle ground. We believe fashion should be accessible without being wasteful. Every brand we work with is vetted for quality and, where possible, ethical production practices. We actively prioritise natural fibres, responsible manufacturing, and products that are built to outlast a single season.\n\nOur advice to you: before your next purchase, ask yourself three questions. Will I wear this at least 30 times? Is it made of quality materials? Does it complement what I already own? If the answer to all three is yes, it's a purchase worth making. That's the GuraFaster philosophy.",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    date: "August 20, 2026",
    author: "Amara Diallo",
    category: "SUSTAINABILITY",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "5 Outfit Formulas That Work Every Single Time",
    excerpt:
      "No more 'I have nothing to wear!' moments. These five outfit formulas are foolproof and work for any occasion — from casual Fridays to formal evenings.",
    content:
      "We've all been there: standing in front of a wardrobe full of clothes with absolutely nothing to wear. The solution isn't buying more — it's having a reliable set of outfit formulas you can fall back on.\n\nFormula 1 — The Classic Casual: White t-shirt + well-fitting dark jeans + white trainers. This combination works for 90% of casual occasions. Elevate it with a leather jacket or a structured tote bag.\n\nFormula 2 — Smart Casual Done Right: A neat knit jumper (navy, grey, or camel) + tailored chinos or slim-fit trousers + leather loafers or clean leather trainers. This is the go-to for meetings, lunch dates, and smart-casual events.\n\nFormula 3 — The Monochrome Power Move: Dress head-to-toe in one colour or tonal shades of the same colour. It looks incredibly intentional, creates a long, lean silhouette, and requires almost no thought. Camel-on-camel and all-black are perennial favourites.\n\nFormula 4 — The Statement + Neutrals Balance: Choose one bold, eye-catching piece — a printed blazer, a colourful skirt, a textured top — and let it be the star. Pair it with neutral, understated basics so it gets all the attention it deserves.\n\nFormula 5 — The Weekend Elevated: Relaxed trousers (wide-leg or cargo) + a simple fitted top tucked in + chunky sandals or loafers + a crossbody bag. It looks effortless but intentional — the holy grail of casual dressing.\n\nSave these formulas. Return to them whenever inspiration runs dry. Fashion should make you feel good, not stressed.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
    date: "August 14, 2026",
    author: "Priya Nair",
    category: "STYLE TIPS",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "New Season Drop: What's Fresh at GuraFaster",
    excerpt:
      "Our latest collection has landed and it's absolutely stunning. Shop the season's most exciting new arrivals before they sell out.",
    content:
      "The wait is officially over. Our most anticipated seasonal collection has landed on the GuraFaster platform, and we couldn't be more excited to share it with you.\n\nThis season's curation was guided by one overarching theme: effortless confidence. Every piece was hand-selected to make you feel powerful, polished, and entirely yourself — whether you're stepping into a boardroom or stepping out for brunch.\n\nHighlights from the drop include a stunning range of structured outerwear in rich autumn tones, an elevated basics collection featuring premium cotton essentials in a palette of warm neutrals, a footwear edit anchored by square-toe boots and sculptural heels, and an accessories range that includes our most popular structured bags restocked alongside exciting new additions.\n\nWe've also introduced several new independent designer brands this season — labels that are doing genuinely exciting things in the space of sustainable, design-forward clothing. We'll be sharing dedicated spotlights on each of them over the coming weeks, so stay tuned.\n\nAs always, our most popular pieces sell out fast. We recommend heading to the shop now to explore the full collection and securing your favourites before they're gone. New arrivals are added on a rolling basis throughout the season, so check back regularly.\n\nThank you, as always, for being part of the GuraFaster community. Your support makes everything we do possible.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop",
    date: "August 1, 2026",
    author: "Kofi Mensah",
    category: "NEW ARRIVALS",
    readTime: "3 min read",
  },
];

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero: {
    tag: "Born to Move Faster",
    headline: "Curating Fashion Trends Since 2015",
    paragraph1:
      "GuraFaster was born from one simple belief — fashion should move at the speed of life. Since 2015, we've been connecting style-forward individuals with the clothes, accessories, and brands that tell their story.",
    paragraph2:
      "From our roots in Kigali to serving customers across the continent and beyond, we've built a platform where quality meets convenience. Every product on GuraFaster is hand-picked, quality-checked, and delivered with care.",
  },
  stats: [
    { value: "10K+", label: "Happy Customers" },
    { value: "3K+", label: "Products Listed" },
    { value: "50+", label: "Global Brands" },
    { value: "99%", label: "Satisfaction Rate" },
  ],
  values: [
    {
      title: "Our Mission",
      desc: "To empower every individual by making quality fashion accessible, fast, and effortless — from everyday basics to curated statement pieces.",
    },
    {
      title: "Our Quality",
      desc: "We partner only with trusted brands and independent designers who share our commitment to craftsmanship and style longevity.",
    },
    {
      title: "Sustainability",
      desc: "We are committed to eco-conscious packaging and prioritising brands that champion responsible and ethical production practices.",
    },
    {
      title: "Community",
      desc: "GuraFaster is more than a store — it's a growing community of style enthusiasts who inspire and celebrate each other's looks.",
    },
  ],
  team: [
    {
      name: "Amara Diallo",
      role: "Founder & Creative Director",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Kofi Mensah",
      role: "Head of Merchandising",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Priya Nair",
      role: "Lead Stylist & Brand Curator",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
  ],
  whyItems: [
    {
      title: "Fast Delivery",
      desc: "Same-day and next-day shipping available in major cities.",
    },
    {
      title: "Curated Selection",
      desc: "Every item is hand-picked for quality, fit, and style relevance.",
    },
    {
      title: "Easy Returns",
      desc: "30-day hassle-free returns — shop with total confidence.",
    },
  ],
};

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const BLOG_KEY = "gf_blog_posts";
const ABOUT_KEY = "gf_about_content";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Service ──────────────────────────────────────────────────────────────────

const contentService = {
  // ── Blog ──────────────────────────────────────────────────────────────────

  getBlogPosts(): BlogPost[] {
    return load<BlogPost[]>(BLOG_KEY, DEFAULT_BLOG_POSTS);
  },

  saveBlogPosts(posts: BlogPost[]): void {
    save(BLOG_KEY, posts);
  },

  addBlogPost(post: Omit<BlogPost, "id">): BlogPost {
    const posts = contentService.getBlogPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now(),
    };
    contentService.saveBlogPosts([newPost, ...posts]);
    return newPost;
  },

  updateBlogPost(updated: BlogPost): void {
    const posts = contentService.getBlogPosts().map((p) =>
      p.id === updated.id ? updated : p
    );
    contentService.saveBlogPosts(posts);
  },

  deleteBlogPost(id: number): void {
    const posts = contentService.getBlogPosts().filter((p) => p.id !== id);
    contentService.saveBlogPosts(posts);
  },

  resetBlogPosts(): void {
    localStorage.removeItem(BLOG_KEY);
  },

  // ── About ─────────────────────────────────────────────────────────────────

  getAboutContent(): AboutContent {
    return load<AboutContent>(ABOUT_KEY, DEFAULT_ABOUT_CONTENT);
  },

  saveAboutContent(data: AboutContent): void {
    save(ABOUT_KEY, data);
  },

  resetAboutContent(): void {
    localStorage.removeItem(ABOUT_KEY);
  },
};

export default contentService;
