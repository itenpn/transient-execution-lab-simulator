import { instructionToString } from "../logic/Instructions";
import { FixedSizeList } from "react-window";
import { useEffect, useRef, useState } from "react";

import { Box, ListItem, ListItemText } from "@mui/material";

export default function InstructionStream(props) {
  const { stream } = props;
  const reversed = stream.slice().reverse();

  const listRef = useRef();

  const scrollToBottom = () => {
    if (listRef?.current) {
      listRef.current.scrollToItem(stream.length);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [stream.length]);

  function InstructionCell(props) {
    const { instruction } = props;

    if (!instruction) return;

    let styling = { fontFamily: "Monospace" };
    if (instruction.errorBranchPrediction) {
      styling.backgroundColor = "instruction.flushed";
    }
    if (instruction.committed) {
      styling.backgroundColor = "instruction.committed";
    }

    return (
      <Box sx={styling} component="span">
        {instructionToString(instruction)}
      </Box>
    );
  }

  function renderRow(props) {
    const { index, key, style } = props;

    return (
      <ListItem key={key} style={style} component="div" disableGutters disablePadding>
        <ListItemText>
          <InstructionCell instruction={stream[index]}></InstructionCell>
        </ListItemText>
      </ListItem>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 960 }}>
      <FixedSizeList
        height={960}
        width="100%"
        itemSize={32}
        itemCount={stream.length}
        overscanCount={10}
        ref={listRef}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
