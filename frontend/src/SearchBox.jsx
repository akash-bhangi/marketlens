import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchBox({ stock, setSearchQuery }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [value, setValue] = useState(null);

    useEffect(() => {
        if (location.pathname === "/") {
            setValue(null);
        }
    }, [location.pathname]);

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
                    value={value}
                    options={stock || []}
                    getOptionLabel={(option) => {
                        if (!option) return "";
                        return typeof option === "string" ? option : `${option?.symbol} - ${option?.shortName || option?.longName || ""}`
                    }}
                    onInputChange={(event, newValue) => {
                        setValue(newValue);
                        setSearchQuery(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Indian Stocks"
                            placeholder="e.g. RELIANCE, TCS, INFY"
                        />
                    )}

                    onChange={(event, selectedOption) => {
                        if (selectedOption && typeof selectedOption === "object") {
                            try {
                                navigate(`/stock/${selectedOption?.symbol}`);
                                setSearchQuery(null);
                                setValue(null);
                            } catch (error) {
                                console.error("Error navigating to stock details:", error);
                            }
                        }
                    }
                    }
                />
            </section>
        </>

    )

}