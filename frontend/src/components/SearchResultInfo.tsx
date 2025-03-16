import { Link } from "react-router-dom";

type Props = {
    total: number; 
    city: string; 
}
const SearchResultInfo = ({total, city}: Props) => {
    return (
      <div className="text-3xl font-bold flex flex-col gap-3 justify-between lg:items-center lg:flex-row">
        <span>
          {total} Restaurants found in {city}
          <Link to={"/"} className="ml-1 text-sm font-semibold underline cursor-pointer">Change Location</Link>
        </span>
        <span className="text-sm">

        insert sort dropdown here
        </span>
        
      </div>
    );
}

export default SearchResultInfo