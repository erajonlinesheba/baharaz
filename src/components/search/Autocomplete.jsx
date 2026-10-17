"use client";
import { useState, useEffect } from "react";
import { InstantSearch, SearchBox, Hits, useInstantSearch } from "react-instantsearch";
import { searchClient, ALGOLIA_INDEX_NAME } from "@/lib/algolia";
import HitCard from "./HitCard";

function Results({ onClose }) {
  const { results } = useInstantSearch();
  if (!results.query) return <div className="p-4 text-center text-sm text-gray-400">Type "mini" to see Mini Fan, "gam" for Game products</div>;
  if (results.nbHits === 0) return <div className="p-4 text-sm text-center">No result for "{results.query}" - Try small word like "mini"</div>;
  return (
    <div className="max-h-[70vh] overflow-y-auto p-2 space-y-2" onClick={onClose}>
      <Hits hitComponent={HitCard} />
    </div>
  );
}

export default function Autocomplete() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME} future={{ preserveSharedStateOnUnmount: true }}>
        <div onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 300)} className="relative">
          <SearchBox
            placeholder="Panjabi, Shirt, Mini Fan..."
            classNames={{
              root: "relative",
              input: "w-full h-11 pl-10 pr-4 border-2 border-transparent bg-[#f5f5f5] rounded-full focus:outline-none focus:border-[#F85606] focus:bg-white transition-all text-[13px]",
              submitIcon: "hidden",
              resetIcon: "hidden",
            }}
          />
          <span className="absolute left-3 top-3 text-[16px]">🔍</span>
        </div>
        {open && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-2xl rounded-xl border z-50 overflow-hidden">
            <Results onClose={() => setOpen(false)} />
            <div className="p-2.5 text-center border-t bg-[#FFF6F2]">
              <a href="/search" className="text-xs font-bold text-[#F85606] hover:underline">View all results →</a>
            </div>
          </div>
        )}
      </InstantSearch>
    </div>
  );
}