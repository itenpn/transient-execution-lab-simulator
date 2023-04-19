import { useEffect, useRef, useState } from "react";

import { Box, ListItem, ListItemText, Paper, Grid, Typography } from "@mui/material";
import { FixedSizeList } from "react-window";

import { instructionToString } from "../logic/Instructions";

export default function InstructionStream(props) {
  const { stream } = props;

  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleWindowResize = (e) => {
      setWindowSize([e.target.innerWidth, e.target.innerHeight]);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
    const { index, style } = props;

    return (
      <ListItem key={index} style={style} component="div" disableGutters disablePadding>
        <ListItemText>
          <InstructionCell instruction={stream[index]}></InstructionCell>
        </ListItemText>
      </ListItem>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={10}>
        <Grid container justifyContent="center">
          <Typography variant="h5">Instruction Stream</Typography>
        </Grid>
        <FixedSizeList
          height={windowSize[1] - 100}
          width="100%"
          itemSize={32}
          itemCount={stream.length}
          overscanCount={10}
          ref={listRef}
        >
          {renderRow}
        </FixedSizeList>
      </Paper>
    </Box>
  );
}
