const Footer = () => {
  return (
    <footer className="bg-orange-500 py-10 px-2">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
            MERNeats.com
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer
