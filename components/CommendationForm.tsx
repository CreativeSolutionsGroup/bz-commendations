import bz from "@/assets/bz-logo.png";
import SendIcon from "@mui/icons-material/Send";
import { Autocomplete, Avatar, Button, ListSubheader, MenuItem, Paper, Popper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import { Raleway } from "@next/font/google";
import { Member, Team } from "@prisma/client";
import Image from "next/image";
import { createContext, forwardRef, HTMLAttributes, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import { Person } from "@mui/icons-material";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

const LISTBOX_PADDING = 8;

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };


  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={{ ...inlineStyle, height: 36}}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const [optionProps, member] = dataSet;

  return (
    <MenuItem key={index} {...optionProps} {...props} sx={{ width: "100%" }}>
      <Box display="flex" flexDirection="row" width="100%">
        <Avatar>
          {member.imageUrl ? <Image fill src={member.imageURL} alt="" placeholder="blur" blurDataURL={bz.src} /> : <Person />}
        </Avatar>
        <Typography ml={1.5} mt={1}>{member.name}</Typography>
        <Box flexGrow={1}></Box>
        <Typography mt={1.5} variant="caption" color="GrayText" align="right" maxWidth='10rem' overflow="hidden">
          {member.teams.map((team: Team) => team.name).join(", ")}
        </Typography>
      </Box>
    </MenuItem>
  )
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: ReactNode[] = [];
  (children as (ReactNode & { children?: ReactNode[] })[]).forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const itemCount = itemData.length;
  const itemSize = 48;

  const getChildSize = (child: ReactNode) => {
    if (child?.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box"
    ,
    "& ul": {
      padding: 0,
      margin: 0
    }
  }
})

type TeamListItem = Team & { members: Array<Member> };
type MemberListItem = Member & { teams: Array<Team> };

export default ({ recipients, teamTab }: { recipients: (MemberListItem | TeamListItem)[], teamTab?: boolean }) => {
  const [sending, setSending] = useState(false);
  const [itemData, setToItem] = useState("");

  return (
    <Paper sx={{ mt: 4, mx: "auto", maxWidth: "30rem", p: 2 }}>
      <form onSubmit={() => setSending(true)} action="api/commendation" method="POST">
        <Stack spacing={1}>
          <Typography color="primary" className={raleway.className} fontSize={25} fontWeight={900}>Create {teamTab ? "Team" : ""} Commendation</Typography>
          <TextField sx={{ display: "none" }} hidden name="recipient" value={itemData} />
          <Autocomplete
            onChange={(_e, v) => setToItem(v?.id ?? "")}
            id="virtualize-commendation"
            sx={{ width: "100%" }}
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={recipients}
            getOptionLabel={(recip) => recip.name}
            groupBy={(option) => option.name[0].toUpperCase()}
            renderInput={(params) => <TextField {...params} label="To *" />}
            renderOption={(props, option, state) =>
              [props, option, state.index] as ReactNode
            }
            renderGroup={(params) => params as unknown as ReactNode}
          />
          <TextField required label="Message" variant="filled" name="msg" minRows={8} multiline={true} />
          <Button disabled={sending} variant="contained" color="secondary" type="submit" endIcon={<SendIcon />} sx={{ fontSize: 18, textTransform: "uppercase", minWidth: "fit-content" }}>
            <Typography className={raleway.className} fontSize={18} fontWeight={900}>Send</Typography>
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}