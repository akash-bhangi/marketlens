import "./Header.css"
import SearchBox from './SearchBox'
import { useEffect, useState } from 'react'

function Header({ backendStatus }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [stock, setStock] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            async function searchStock() {
                if (searchQuery.length > 1) {
                    try {
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search?query=${searchQuery}`);
                        const data = await res.json();
                        setStock(data);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            searchStock();
        }, 1000)
    }, [searchQuery])
    return (
        <>
            <header className="topbar">
                <div>
                    <h1>Market Dashboard</h1>
                    <span className="api-status">{backendStatus}</span>
                </div>
                <SearchBox stock={stock} setSearchQuery={setSearchQuery} />
            </header>
        </>
    )
}
export default Header