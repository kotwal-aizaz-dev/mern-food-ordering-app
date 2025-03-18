import LandingImage from "../../assets/landing.png"
import AppDownloadImage from "../../assets/appDownload.png"
import SearchBar, { SearchForm } from "../SearchBar";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate()
  const handleSearch = (searchFoxValues:SearchForm) => {
    navigate({
      pathname: `restaurant/search/${searchFoxValues.searchQuery}`, 
    })
  }
  return (
    <div className="flex flex-col gap-12">
      {/* Searchbar section */}
      <div className="md:mx-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-orange-500">
          Tuck into a takeaway today
        </h1>
        <span className="text-xl ">Food is just a click away</span>
        <SearchBar placeHolder="Search by city" onSubmit={handleSearch}/>
      </div>
      {/* App download section */}
      <div className="grid md:grid-cols-2 gap-5">
        <img src={LandingImage} alt="" />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">Order takeaway even faster!</span>
            <span>Download the MERNeats app for faster ordering and personalized recommendations </span>
            <img src={AppDownloadImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
