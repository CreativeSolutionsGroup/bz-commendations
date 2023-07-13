import ListboxComponent from "@/components/ListboxComponent";
import StyledPopper from "@/components/StyledPopper";
import { MemberWithTeams, TeamWithMembers } from "@/types/commendation";
import { Autocomplete, Popper, TextField } from "@mui/material";
import { ReactNode } from "react";

export default function VirtualizedUserAutocomplete({ onChange, options }: { onChange: Function, options: Array<TeamWithMembers | MemberWithTeams> }) {
  return (
    <Autocomplete
      onChange={(_e, v) => onChange(v?.id ?? "")}
      id="virtualize-commendation"
      sx={{ width: "100%" }}
      disableListWrap
      PopperComponent={Popper}
      ListboxComponent={ListboxComponent}
      options={options}
      getOptionLabel={(recip) => recip.name}
      groupBy={(option) => option.name[0].toUpperCase()}
      renderInput={(params) => <TextField {...params} label="To *" />}
      renderOption={(
        props, option, state
      ) =>
        [props, option, state.index] as ReactNode
      }
      renderGroup={(params) => params as unknown as ReactNode}
    />
  );
};