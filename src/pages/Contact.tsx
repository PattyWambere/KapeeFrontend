import { useState } from "react";
import PageHeader from "../components/header/PageHeader";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const contactInfo = [
  {
    icon: <FaMapMarkerAlt className="text-xl" />,
    title: "Visit Our Store",
    lines: ["14 Fashion Avenue", "Kigali, Rwanda"],
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: <FaPhoneAlt className="text-xl" />,
    title: "Call Us",
    lines: ["+250 788 000 123", "+250 722 000 456"],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <FaEnvelope className="text-xl" />,
    title: "Email Us",
    lines: ["support@gurafaster.com", "sales@gurafaster.com"],
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: <FaClock className="text-xl" />,
    title: "Working Hours",
    lines: ["Mon – Fri: 8AM – 7PM", "Saturday: 9AM – 5PM", "Sunday: 10AM – 3PM"],
    color: "bg-blue-50 text-blue-600",
  },
];

const subjects = [
  "Order Inquiry",
  "Returns & Exchanges",
  "Product Question",
  "Shipping & Delivery",
  "Partnership / Wholesale",
  "Other",
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="Contact Us" />

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((item, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">
                {item.title}
              </h4>
              {item.lines.map((line, j) => (
                <p key={j} className="text-sm text-gray-500 font-medium leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Form + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Side Panel */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic mb-3">
                We'd Love to Hear From You
              </h2>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight mb-5">
                Get In Touch With GuraFaster
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Whether you have a question about an order, want to know more about our collections, or need help with returns — our team is ready and happy to assist you.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900 mb-4">
                Follow Us on Social
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <FaFacebookF />, label: "Facebook", color: "hover:bg-blue-600" },
                  { icon: <FaInstagram />, label: "Instagram", color: "hover:bg-pink-600" },
                  { icon: <FaTwitter />, label: "Twitter", color: "hover:bg-sky-500" },
                  { icon: <FaWhatsapp />, label: "WhatsApp", color: "hover:bg-green-500" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={s.label}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border border-gray-200 transition-all duration-300 ${s.color} hover:text-white hover:-translate-y-1`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-black rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-xl">
                <FaEnvelope />
              </div>
              <h4 className="text-white font-black uppercase tracking-tight text-lg leading-tight">
                Quick Response Guaranteed
              </h4>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                We respond to all inquiries within <span className="text-orange-400 font-black">2 business hours</span>. Your style matters to us — no question goes unanswered.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">
                Send Us a Message
              </h3>

              {/* Success Banner */}
              {isSubmitted && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 text-sm font-black">
                    ✓
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-wider">Message Sent!</p>
                    <p className="text-sm font-medium mt-1">
                      Thank you for reaching out! We'll get back to you within 2 business hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Amara Diallo"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+250 788 000 000"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm text-gray-600 transition-all duration-300 appearance-none"
                    >
                      <option value="" disabled>Select a subject…</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitted || isLoading}
                  className="bg-blue-600 text-white px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-2xl inline-flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : isSubmitted ? (
                    "Message Sent! ✓"
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map — Kigali, Rwanda */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] italic mb-2">
              Where to Find Us
            </h3>
            <h4 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
              Our Store Location
            </h4>
          </div>
          <a
            href="https://maps.google.com/?q=Kigali,Rwanda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-orange-500 transition-colors hidden md:block"
          >
            Open in Google Maps →
          </a>
        </div>
        <div className="w-full h-96 bg-gray-100 rounded-3xl overflow-hidden shadow-xl border-2 border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.41826730278!2d30.0188!3d-1.9440!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xf32b36a5411d0bc8!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1726484800000!5m2!1sen!2srw"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GuraFaster Store — Kigali, Rwanda"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
