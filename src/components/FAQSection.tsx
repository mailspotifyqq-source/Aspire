import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { FAQ_ITEMS } from '../data/visaData';

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'Documentation', 'Processing', 'Fees'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-6 md:px-12 bg-[#f5f5dc] dark:bg-[#070c14] border-t border-[#2d2d2d]/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] dark:text-[#d4af37] font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear Guidance</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2d2d2d] dark:text-[#f8fafc] mb-4 italic font-light">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-base text-[#4a3c31]/80 dark:text-[#94a3b8] font-light max-w-xl mx-auto">
            Everything you need to know regarding requirements, timelines, fees, and compliance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#2d2d2d]/40 dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., bank balance, processing time)..."
            className="w-full bg-[#fffdd0] dark:bg-[#0b1320] border border-[#2d2d2d]/15 dark:border-white/15 pl-11 pr-4 py-2.5 text-xs sm:text-sm text-[#2d2d2d] dark:text-[#f8fafc] placeholder-[#2d2d2d]/40 dark:placeholder-slate-400 rounded-sm focus:outline-none focus:border-[#b8860b] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#b8860b] dark:focus:ring-[#d4af37] transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#b8860b] dark:bg-[#d4af37] text-white dark:text-[#070c14] shadow-xs'
                  : 'bg-[#fffdd0] dark:bg-[#0b1320] text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#2d2d2d] dark:hover:text-white border border-[#2d2d2d]/10 dark:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[#2d2d2d]/10 dark:divide-white/10 border-t border-b border-[#2d2d2d]/10 dark:border-white/10 bg-[#fffdd0] dark:bg-[#0b1320] transition-colors">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-[#2d2d2d]/60 dark:text-slate-400 text-sm">
              No matching questions found. Try searching another keyword or contact our advisors.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full py-6 px-6 text-left flex items-center justify-between gap-4 hover:bg-[#fafad2]/50 dark:hover:bg-[#101b2d] transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif text-lg sm:text-xl text-[#2d2d2d] dark:text-[#f1f5f9] font-medium pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#b8860b] dark:text-[#d4af37] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#4a3c31] dark:text-slate-300 leading-relaxed font-light bg-[#fafad2]/30 dark:bg-[#101b2d]/60 border-l-2 border-[#b8860b] dark:border-[#d4af37]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
