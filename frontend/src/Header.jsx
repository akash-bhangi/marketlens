import "./Header.css"
function Header({ backendStatus }) {
    return (
        <>
            <header className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>Market Dashboard</h1>
                    <span className="api-status">{backendStatus}</span>
                </div>

                <section className="search-section">
                    <input
                        type="search"
                        placeholder="Search Indian stocks "
                        disabled

                    />
                    <button disabled>Search</button>
                </section>
            </header>
        </>
    )
}
export default Header