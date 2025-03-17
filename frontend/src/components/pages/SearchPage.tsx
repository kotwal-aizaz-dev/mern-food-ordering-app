import { useSearchRestaurants } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";
import SearchResultInfo from "../SearchResultInfo";
import SearchResultsCard from "../SearchResultsCard";
import { useState } from "react";
import SearchBar, { SearchForm } from "../SearchBar";
import PaginationSelector from "../PaginationSelector";
import CuisineFilter from "../CuisineFilter";
export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
};

const SearchPage = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { city } = useParams();
  const { results, isLoading } = useSearchRestaurants(searchState, city);

  if (isLoading) return <span>Loading...</span>;
  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedCuisines,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };
  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
      page: 1,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <div className="" id="cuisines-list">
          <CuisineFilter
            selectedCuisines={searchState.selectedCuisines}
            onChange={setSelectedCuisines}
            isExpanded={isExpanded}
            onExpandedClick={() =>
              setIsExpanded((prevIsExpanded) => !prevIsExpanded)
            }
          />
        </div>
        <div className="flex flex-col gap-5" id="main-content">
          <SearchBar
            searchQuery={searchState.searchQuery}
            placeHolder="Search by cuisine or restaurant name"
            onSubmit={setSearchQuery}
            onReset={resetSearch}
          />
          <SearchResultInfo city={city} total={results.pagination.total} />
          {results.data?.map((restaurant) => (
            <SearchResultsCard key={restaurant._id} restaurant={restaurant} />
          ))}
          <PaginationSelector
            page={results.pagination.page}
            pages={results.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      </div>
      {/* <span>User searched for {city}{" "}<span>
            {results?.data.map(restaurant => (
                <span>
                    found - {restaurant.restaurantName}
                </span>
            ))}
            </span></span> */}
    </>
  );
};

export default SearchPage;
