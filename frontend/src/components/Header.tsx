import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b-2 border-b-orange-500 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={"/"}
          className="text-3xl font-bold tracking-tight text-orange-500"
        >
          MERNEATS.com
        </Link>
      </div>
    </header>
  );
};

export default Header;
