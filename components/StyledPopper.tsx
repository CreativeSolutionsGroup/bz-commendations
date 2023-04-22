import { Popper, styled } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box"
        ,
        "& ul": {
            padding: 0,
            margin: 0
        }
    }
});

export default StyledPopper;