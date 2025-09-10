import React, { useState } from 'react';

export default function FAQAccordion({ items = [] }) {
  const [openStates, setOpenStates] = useState(items.map(item => item.isOpen || false));

  const handleToggle = (idx) => {
    setOpenStates((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  return (
    <div className="faq-accordion w-full flex flex-col gap-4">
      {items.map(({ question, answer, isOpen }, idx) => (
        <div key={idx} className="bg-white py-4 px-5 flex flex-col gap-2 rounded-2xl w-full justify-start">
          <button
            className="flex flex-row w-full items-center focus:outline-none"
            type="button"
            onClick={() => handleToggle(idx)}
            aria-expanded={openStates[idx]}
            aria-controls={`faq-answer-${idx}`}
          >
            <span className="font-bold text-[20px] text-left">{question}</span>
            <img
              src={`${PUBLIC_BASE_URL ?? ''}/chevron-up.svg`}
              alt="˅"
              className={`ml-auto h-6 w-6 transition-transform duration-200 ${openStates[idx] ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id={`faq-answer-${idx}`}
            className="faq-answer"
            style={{ display: openStates[idx] ? 'block' : 'none' }}
          >
            <p className="text-base font-normal">{answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
