import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '@/components/common/Home/UI/SearchInput';
import useEventList from '@/hooks/useEventList';
import useSearch from '@/hooks/useSearch';
import { Link } from 'react-router-dom';
import BottomNavbar from '@/components/common/footer/BottomNavbar';
import { FiChevronLeft } from 'react-icons/fi';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { allEvents } = useEventList();
  const { searchTerm, setSearchTerm, searchResults } = useSearch(allEvents);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-[430px] my-6 mx-auto">
      <div className="flex items-center w-[450px] p-4">
        <button
          onClick={handleGoBack}
          className="h-[62px] left-0 text-2xl text-primary"
        >
          <FiChevronLeft />
        </button>
        <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
      </div>

      <div className="w-full px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {searchResults.length > 0 ? (
          searchResults.map((event, index) => (
            <Link key={`${event.id}-${index}`} to={`/events/${event.id}`}>
              <div className="flex p-4 border-b">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-xs text-gray-500">
                    {event.startDate} - {event.endDate}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Search;
