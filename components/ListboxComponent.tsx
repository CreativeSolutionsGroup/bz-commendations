import bz from "@/assets/bz-logo.png";
import { Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  ListSubheader,
  MenuItem,
  Typography,
} from "@mui/material";
import { Team } from "@prisma/client";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import Image from "next/image";

const LISTBOX_PADDING = 8;

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader
        key={dataSet.key}
        component="div"
        style={{ ...inlineStyle, height: 36 }}
      >
        {dataSet.group}
      </ListSubheader>
    );
  }

  const [optionProps, option] = dataSet;
  return (
    <MenuItem key={index} {...optionProps} {...props} sx={{ width: "100%" }}>
      <Box display="flex" flexDirection="row" width="100%">
        <Avatar>
          {option.imageURL ? (
            <Image
              fill
              src={option.imageURL}
              alt=""
              placeholder="blur"
              blurDataURL={bz.src}
              style={{ objectFit: "contain", background: "white" }}
              sizes="(min-width: 0px) 128px"
            />
          ) : (
            <Person />
          )}
        </Avatar>
        <Typography ml={1.5} mt={1}>
          {option.name}
        </Typography>
        <Box flexGrow={1}></Box>
        {option.teams ? (
          <Typography
            mt={1.5}
            variant="caption"
            color="GrayText"
            align="right"
            maxWidth="10rem"
            overflow="hidden"
          >
            {option.teams.map((team: Team) => team.name).join(", ")}
          </Typography>
        ) : (
          <></>
        )}
      </Box>
    </MenuItem>
  );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>
(function CommendationOuter(props, ref) {
  const outerProps = useContext(OuterElementContext);
  return (
    <div ref={ref} {...props} {...outerProps} style={{ overflowX: "clip" }} />
  );
});

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

export default ListboxComponent;
