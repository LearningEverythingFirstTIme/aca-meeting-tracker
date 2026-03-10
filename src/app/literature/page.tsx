"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { literatureData, categories, type LiteratureItem } from "@/lib/literature-data";
import { Navigation } from "@/components/navigation";

function LiteratureCard({ item }: { item: LiteratureItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const category = categories.find(c => c.id === item.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="forest-card overflow-hidden"
      style={{ 
        borderLeft: `4px solid ${category?.color || "var(--butter-warm)"}` 
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-[var(--earth-cream)]/30 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span 
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: category?.color || "var(--butter-warm)", color: 'var(--forest-deep)' }}
            >
              {category?.label}
            </span>
            {item.source && (
              <span className="text-xs text-[var(--earth-wood)]">
                {item.source}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-[var(--forest-deep)]">{item.title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          {isExpanded ? (
            <ChevronUp size={24} className="text-[var(--forest-light)]" />
          ) : (
            <ChevronDown size={24} className="text-[var(--forest-light)]" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-[var(--earth-sand)]">
              <div className="prose prose-lg max-w-none">
                {item.content.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={`text-[var(--forest-deep)] leading-relaxed ${
                      paragraph === "" 
                        ? "h-4" 
                        : paragraph.startsWith("STEP") || paragraph.startsWith("TRADITION") || paragraph.startsWith("CONCEPT") || paragraph.startsWith("FROM PAGE") || paragraph.startsWith("THE")
                        ? "font-semibold text-base mt-6 mb-2 text-[var(--forest-mid)]"
                        : "mb-4"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategoryFilter({ 
  activeCategory, 
  onCategoryChange 
}: { 
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
          activeCategory === null 
            ? "bg-[var(--forest-mid)] text-white border-[var(--forest-mid)]" 
            : "bg-white text-[var(--forest-deep)] border-[var(--earth-sand)] hover:border-[var(--forest-pale)]"
        }`}
      >
        All
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all`}
          style={{
            backgroundColor: activeCategory === category.id 
              ? category.color 
              : "white",
            borderColor: activeCategory === category.id 
              ? category.color 
              : "var(--earth-sand)",
            color: activeCategory === category.id 
              ? 'var(--forest-deep)' 
              : 'var(--forest-deep)'
          }}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}

export default function LiteraturePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredLiterature = activeCategory 
    ? literatureData.filter(item => item.category === activeCategory)
    : literatureData;

  // Group by category when showing all
  const groupedByCategory = activeCategory 
    ? null 
    : categories.map(cat => ({
        ...cat,
        items: literatureData.filter(item => item.category === cat.id)
      })).filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="p-3 rounded-2xl bg-gradient-to-br from-[var(--forest-mid)] to-[var(--forest-light)] shadow-sm"
            >
              <BookOpen size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-3xl md:text-4xl text-[var(--forest-deep)]">
                Literature
              </h1>
              <p className="text-sm text-[var(--earth-wood)]">
                ACA Readings, Prayers & Promises
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Literature List */}
        <div className="space-y-4">
          {activeCategory ? (
            // Filtered view - flat list
            filteredLiterature.map((item) => (
              <LiteratureCard key={item.id} item={item} />
            ))
          ) : (
            // All view - grouped by category
            groupedByCategory?.map((group) => (
              <div key={group.id} className="mb-8">
                <div 
                  className="flex items-center gap-2 mb-4 pb-2 border-b-2"
                  style={{ borderColor: group.color }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h2 className="font-semibold text-lg text-[var(--forest-deep)]">
                    {group.label}
                  </h2>
                </div>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <LiteratureCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {filteredLiterature.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-[var(--earth-wood)]">
              No literature found in this category.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-[var(--earth-sand)] text-center"
        >
          <Heart size={20} className="mx-auto mb-3 text-[var(--coral)]" />
          <p className="text-xs text-[var(--earth-wood)] italic">
            &ldquo;We are not alone anymore.&rdquo;
          </p>
          <p className="text-xs text-[var(--earth-wood)]/60 mt-2">
            — Adult Children of Alcoholics & Dysfunctional Families
          </p>
        </motion.div>
      </main>
    </div>
  );
}
