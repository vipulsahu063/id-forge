export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Contact Support
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Get in touch with us for any assistance or inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mb-8 md:mb-12">
          {/* Phone Contact Card */}
          <div className="group bg-linear-to-br from-white to-blue-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-blue-100 hover:border-blue-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-blue-600 uppercase tracking-wider mb-3">
                  Phone Support
                </h3>
                <a 
                  href="tel:+918051706626" 
                  className="text-xl md:text-2xl font-bold text-slate-800 hover:text-blue-600 active:text-blue-700 transition-colors block mb-3"
                >
                  +91 80517 06626
                </a>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mon-Fri, 9AM-6PM IST
                </div>
              </div>
            </div>
          </div>

          {/* Email Contact Card */}
          <div className="group bg-linear-to-br from-white to-purple-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-purple-100 hover:border-purple-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-purple-600 uppercase tracking-wider mb-3">
                  Email Support
                </h3>
                <a 
                  href="mailto:umk@gmail.com" 
                  className="text-xl md:text-2xl font-bold text-slate-800 hover:text-purple-600 active:text-purple-700 transition-colors break-all block mb-3"
                >
                  umk@gmail.com
                </a>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Response within 24 hours
                </div>
              </div>
            </div>
          </div>

          {/* Address Contact Card */}
          <div className="group bg-linear-to-br from-white to-green-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-green-100 hover:border-green-300 relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-green-600 uppercase tracking-wider mb-3">
                  Our Location
                </h3>
                <p className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                  Ranchi, Jharkhand
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout for Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-8 md:mb-12">
          {/* Help Section */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-2">Need Help?</h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Our support team is here to assist you with any questions or concerns. Feel free to reach out through any of the channels above, and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </div>
            <a
              href="tel:+918051706626"
              className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us Now
            </a>
          </div>

          {/* Business Hours */}
          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-4">Business Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-sm md:text-base font-semibold text-slate-700">Monday - Friday</span>
                    <span className="text-sm md:text-base font-bold text-purple-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-sm md:text-base font-semibold text-slate-700">Saturday</span>
                    <span className="text-sm md:text-base font-bold text-slate-600">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-sm md:text-base font-semibold text-slate-700">Sunday</span>
                    <span className="text-sm md:text-base font-bold text-red-600">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Email Support</p>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">&lt;24h</div>
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Response Time</p>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">100%</div>
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Support Coverage</p>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24h</div>
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Issue Resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
