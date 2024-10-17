import React from 'react';

interface SearchInputProps {
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  handleSearch,
}) => {
  return (
    <div className="flex-grow flex justify-center items-center bg-navbar rounded-lg px-2 mx-14 h-[35px]">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="지역명, 팝업 키워드를 입력해주세요."
        className="text-[14px] flex-grow outline-none border-0 bg-transparent text-card-foreground"
      />
    </div>
  );
};

export default SearchInput;
