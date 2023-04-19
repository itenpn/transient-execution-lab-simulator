import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Box, Tooltip, Paper, Grid, Typography, IconButton, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { range } from "../../logic/util";
import { global } from "../../logic/global";
import { stringifyData } from "../../logic/util";
import SimpleTextInput from "../util/SimpleTextInput";
import Core from "../core";

function Cache(props) {
  const { cache, height, width } = props;
  const BASE = 16;

  if (height * width !== cache.length)
    console.error(
      `Cache display height ${height} and width ${width} do not match cache length ${cache.length}`
    );

  const CacheRow = (row) => {
    const rowData = Array.from(cache.slice(row * width, row * width + width));
    const addresses = range(row * width, row * width + width);

    return (
      <TableRow key={row}>
        {rowData.map((data, index) => {
          return (
            <Tooltip title={`@0x${stringifyData(addresses[index], 16)}`} key={addresses[index]}>
              <TableCell align="center">
                <Box sx={{ fontFamily: "Monospace" }} component="span">
                  {stringifyData(data, BASE)}
                </Box>
              </TableCell>
            </Tooltip>
          );
        })}
      </TableRow>
    );
  };

  return (
    <>
      <Grid container>
        <TableContainer component={Paper}>
          <Table size="small" padding="none">
            <TableBody>{[...Array(height).keys()].map(CacheRow)}</TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}

export default function Simulation() {
  const [coreIndex, setCoreIndex] = useState(0);
  const [falseState, setFalseState] = useState(0);
  const cpuRepeatCountRef = useRef();

  const cpu = global?.cpu;
  const height = 16;
  const width = 16;

  if (!cpu) {
    return (
      <Typography>
        No programs selected, go to <Link to="/select">select</Link> to choose programs.
      </Typography>
    );
  }

  const cycleCpu = () => {
    const count = Number(cpuRepeatCountRef.current.value);
    for (let i = 0; i < count; i++) {
      try {
        cpu.nextCycle();
      } catch (ex) {
        console.error(ex);
      }
    }
    setFalseState(falseState + 1);
  };

  const commitCpu = () => {
    const count = Number(cpuRepeatCountRef.current.value);
    for (let i = 0; i < count; i++) {
      try {
        while (cpu.getRunningStatus()[coreIndex] && !cpu.nextCycle()[coreIndex]) {}
      } catch (ex) {
        console.error(ex);
      }
    }
    setFalseState(falseState + 1);
  };

  const resetCore = () => {
    cpu.cores[coreIndex].restartCore();
    setFalseState(falseState + 1);
  };
  console.log(cpu);

  const determineRepeatCountValue = () => {
    const num = Number(cpuRepeatCountRef?.current?.value);
    if (Number.isNaN(num) || num <= 0) {
      return 1;
    }
    return num;
  };

  function Controls() {
    return (
      <Grid item container direction="row" alignItems="center" justifyContent="flex-end">
        <Grid item xs={1}>
          <Tooltip title="Previous Core">
            <span>
              <IconButton
                color="primary"
                onClick={() => setCoreIndex(coreIndex - 1)}
                disabled={coreIndex === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Next Core">
            <span>
              <IconButton
                color="primary"
                onClick={() => setCoreIndex(coreIndex + 1)}
                disabled={coreIndex === cpu.num_cores - 1}
              >
                <NavigateNextIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Reset Core">
            <span>
              <IconButton color="primary" onClick={resetCore}>
                <PowerSettingsNewIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <SimpleTextInput
            field="cpu-repeat-count"
            label="CPU Repeat Count"
            type="number"
            defaultValue={determineRepeatCountValue()}
            inputProps={{ min: 1 }}
            ref={cpuRepeatCountRef}
          ></SimpleTextInput>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Next Cycle">
            <IconButton color="primary" onClick={cycleCpu}>
              <AutorenewIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Next Commit">
            <IconButton color="primary" onClick={commitCpu}>
              <MoveDownIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <Core
            core={cpu.cores[coreIndex]}
            program={cpu.programList[coreIndex]}
            index={coreIndex}
          />
        </Grid>
        <Grid item xs={4} container direction="column">
          <Grid item>
            <Controls />
            <Grid item container justifyContent="center">
              <Typography variant="h5">Cache Content</Typography>
            </Grid>
            <Cache cache={cpu.getCacheRep()} height={height} width={width}></Cache>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
