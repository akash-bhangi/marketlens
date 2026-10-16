import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SearchIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, marginRight: 6, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

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
        <div className="search-section">
            <Autocomplete
                freeSolo
                size="small"
                sx={{
                    width: "100%",
                    minWidth: { xs: "220px", sm: "280px", md: "360px" },
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        padding: "5px 10px !important",
                        "& fieldset": {
                            borderColor: "#E2E8F0",
                        },
                        "&:hover fieldset": {
                            borderColor: "#94A3B8",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#38BDF8",
                            borderWidth: "1.5px",
                        },
                    },
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "12px",
                            marginTop: "6px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 6px 12px -4px rgba(15, 23, 42, 0.08)",
                            backgroundColor: "#FFFFFF",
                            overflow: "hidden",
                            "& .MuiAutocomplete-listbox": {
                                padding: "6px",
                                maxHeight: "360px",
                                "& .MuiAutocomplete-option": {
                                    padding: "0 !important",
                                    margin: "2px 0",
                                    borderRadius: "8px",
                                    transition: "background-color 0.15s ease",
                                    '&[aria-selected="true"]': {
                                        backgroundColor: "#F0F9FF !important",
                                    },
                                    '&.Mui-focused, &:hover': {
                                        backgroundColor: "#F8FAFC !important",
                                    },
                                },
                            },
                            "& .MuiAutocomplete-noOptions": {
                                fontSize: "0.85rem",
                                color: "#64748B",
                                padding: "16px 14px",
                                textAlign: "center",
                            },
                        },
                    },
                }}
                value={value}
                options={Array.isArray(stock) ? stock : []}
                isOptionEqualToValue={(option, val) => {
                    if (!option || !val) return false;
                    const optSymbol = typeof option === "object" ? option.symbol : option;
                    const valSymbol = typeof val === "object" ? val.symbol : val;
                    return optSymbol === valSymbol;
                }}
                getOptionLabel={(option) => {
                    if (!option) return "";
                    return typeof option === "string" ? option : `${option?.symbol || ""} - ${option?.shortName || option?.longName || ""}`;
                }}
                onInputChange={(event, newValue) => {
                    setValue(newValue);
                    setSearchQuery(newValue);
                }}
                renderOption={(props, option) => {
                    if (!option) return null;
                    const { key, ...optionProps } = props || {};
                    const isObj = typeof option === "object";
                    const rawSymbol = isObj ? (option.symbol || "") : String(option || "");
                    const cleanSymbol = rawSymbol.includes(".") ? rawSymbol.split(".")[0] : rawSymbol;
                    const exchange = rawSymbol.includes(".") ? rawSymbol.split(".")[1] : "NSE";
                    const companyName = isObj ? (option.shortName || option.longName || "") : "";

                    return (
                        <li key={key || rawSymbol} {...optionProps} className="stock-search-option-item">
                            <div className="search-option-content">
                                <div className="search-option-header-row">
                                    <span className="search-option-symbol">{cleanSymbol || rawSymbol}</span>
                                    <span className={`search-option-exchange-tag ${exchange.toLowerCase()}`}>
                                        {exchange}
                                    </span>
                                </div>
                                {companyName && (
                                    <span className="search-option-company-name">{companyName}</span>
                                )}
                            </div>
                            <span className="search-option-arrow-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </span>
                        </li>
                    );
                }}
                renderInput={(params) => {
                    const inputSlot = params.slotProps?.input;
                    return (
                        <TextField
                            {...params}
                            placeholder="Search stocks (e.g. RELIANCE, TCS)..."
                            slotProps={{
                                ...params.slotProps,
                                input: {
                                    ...inputSlot,
                                    startAdornment: (
                                        <>
                                            <SearchIcon />
                                            {inputSlot?.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <span style={{
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                color: "#94A3B8",
                                                background: "#F1F5F9",
                                                border: "1px solid #E2E8F0",
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                lineHeight: 1,
                                                userSelect: "none"
                                            }}>
                                                /
                                            </span>
                                            {inputSlot?.endAdornment}
                                        </div>
                                    ),
                                },
                            }}
                        />
                    );
                }}
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
                }}
            />
        </div>
    );
}