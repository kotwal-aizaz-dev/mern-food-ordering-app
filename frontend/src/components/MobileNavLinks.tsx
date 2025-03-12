import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

const MobileNavLinks = () => {
    // Destructure the logout function from useAuth0 hook
    const { logout } = useAuth0()

    // Define the handleLogout function to call the logout function
    async function handleLogout() {
        await logout()
    }
  return (
    <>
        <Link to={"/user-profile"} className="flex bg-white items-center font-bold hover:text-orange-500">User Profile</Link>
        {/* Logout button */}
        <Button className="flex items-center px-3 font-bold hover:bg-gray-500 cursor-pointer" onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default MobileNavLinks