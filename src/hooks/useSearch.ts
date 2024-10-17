import { useEffect, useState } from 'react';
import { Event } from './useEventList';

const CHOSUNG_MAP: { [key: string]: RegExp } = {
  ㄱ: /[가-깋]/g,
  ㄴ: /[나-닣]/g,
  ㄷ: /[다-딯]/g,
  ㄹ: /[라-맇]/g,
  ㅁ: /[마-밓]/g,
  ㅂ: /[바-빟]/g,
  ㅅ: /[사-싷]/g,
  ㅇ: /[아-잏]/g,
  ㅈ: /[자-짛]/g,
  ㅊ: /[차-칳]/g,
  ㅋ: /[카-킿]/g,
  ㅌ: /[타-팋]/g,
  ㅍ: /[파-핗]/g,
  ㅎ: /[하-힣]/g,
};

const useSearch = (allEvents: Event[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  const isChosung = (char: string) => {
    return /[ㄱ-ㅎ]/.test(char);
  };

  const matchWithChosung = (text: string, searchTerm: string): boolean => {
    if (isChosung(searchTerm[0])) {
      const regexPattern = searchTerm
        .split('')
        .map(char => CHOSUNG_MAP[char]?.source || char)
        .join('');
      const regex = new RegExp(regexPattern);
      return regex.test(text);
    } else {
      return text.toLowerCase().includes(searchTerm);
    }
  };

  const performSearch = (term: string) => {
    const lowercaseTerm = term.toLowerCase().trim();
    if (lowercaseTerm.length < 1) {
      setSearchResults([]);
      return;
    }

    const results = allEvents.filter(event => {
      const nameMatch = matchWithChosung(event.name, lowercaseTerm);
      const locationMatch = matchWithChosung(event.location, lowercaseTerm);
      const categoryMatch = matchWithChosung(event.category, lowercaseTerm);
      const typeMatch = matchWithChosung(event.type, lowercaseTerm);
      return nameMatch || locationMatch || categoryMatch || typeMatch;
    });

    setSearchResults(results);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
      } else {
        performSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, allEvents]);

  return { searchTerm, setSearchTerm, searchResults };
};

export default useSearch;
