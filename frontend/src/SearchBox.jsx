import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function SearchBox({ stock, setSearchQuery }) {
    return (
        <>
            <section className="search-section">
                <Autocomplete
                    freeSolo
                    size="large"
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        width: "350px"
                    }}
                    options={stock}
                    getOptionLabel={(option) =>
                        typeof option === "string" ? option : `${option.symbol} - ${option.shortName || option.longName || ""}`
                    }
                    onInputChange={(event, newValue) => {
                        setSearchQuery(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Indian Stocks"
                            placeholder="e.g. RELIANCE, TCS, INFY"
                        />
                    )}
                />
                <button >Search</button>
            </section>
        </>

    )

}