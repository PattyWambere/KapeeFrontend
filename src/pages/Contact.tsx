import { useState } from "react";
import PageHeader from "../components/header/PageHeader";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send this to your backend API
        console.log("Contact form submitted:", formData);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitted(false);
        }, 3000);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <PageHeader title="Contact Us" />

            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6">Get In Touch</h2>
                            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                Have a question or need assistance? We're here to help! Reach out to us and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Visit Us</h4>
                                    <p className="text-sm text-gray-600">123 Fashion Street<br />Los Angeles, CA 90012</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <FaPhoneAlt className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Call Us</h4>
                                    <p className="text-sm text-gray-600">+1 (555) 123-4567<br />Mon-Fri, 9AM-6PM</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <FaEnvelope className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Email Us</h4>
                                    <p className="text-sm text-gray-600">support@kapee.com<br />sales@kapee.com</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <FaClock className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Working Hours</h4>
                                    <p className="text-sm text-gray-600">Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM<br />Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">Send Us A Message</h3>

                            {isSubmitted && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
                                    <p className="font-bold">Thank you for your message!</p>
                                    <p className="text-sm">We'll get back to you as soon as possible.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm transition"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                            Your Email *
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm transition"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm transition"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm transition resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitted}
                                    className="bg-blue-600 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                                >
                                    <FaPaperPlane />
                                    {isSubmitted ? "Message Sent!" : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-20">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">Find Us Here</h3>
                    <div className="w-full h-96 bg-gray-200 rounded-3xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.517729162739!2d-118.24532708478426!3d34.05223908060596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
