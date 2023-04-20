import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Box, Tooltip, Paper, Grid, Typography, IconButton, TableHead } from "@mui/material";
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
import HelpIcon from "@mui/icons-material/Help";

import { range } from "../../logic/util";
import { global } from "../../logic/global";
import { stringifyData } from "../../logic/util";
import SimpleTextInput from "../util/SimpleTextInput";
import Core from "../core";
import LabeledInline from "../util/LabeledInline";
import TallPaper from "../util/TallPaper";
import WinDialog from "../WinDialog";
import LoseDialog from "../LoseDialog";
import HelpDialog from "../HelpDialog";

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
      <Grid container justifyContent="center">
        <Typography variant="h5">Cache Content</Typography>
        <TableContainer component={TallPaper}>
          <Table size="small" padding="none">
            <TableBody>{[...Array(height).keys()].map(CacheRow)}</TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}

const GlobalCpuState = (props) => {
  const { cpu } = props;

  const height = 16;
  const width = 16;

  const BP_STATES = {
    0: "SNT",
    1: "WNT",
    2: "WT",
    3: "ST",
  };

  const prettySecret = stringifyData(cpu.secret, 16, 2, "0", "0x");

  return (
    <Paper elevation={10}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={0}
      ></Grid>
      <Grid item container justifyContent="center">
        <Typography variant="h4">Global CPU State</Typography>
      </Grid>
      <Grid item container py={1} justifyContent="space-around">
        <Grid item xs={2}>
          <LabeledInline labelText="Cycle">{cpu.getCycleNum()}</LabeledInline>
        </Grid>
        <Grid item xs={2}>
          <LabeledInline labelText="Secret">{prettySecret}</LabeledInline>
        </Grid>
      </Grid>
      <Grid item container py={1} justifyContent="space-around">
        <Typography variant="h5">Branch Predictor States</Typography>
        <TableContainer component={TallPaper}>
          <Table size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: "bold" }}>Index % 10</Typography>
                </TableCell>
                {Array.from(cpu.branchPredictor).map((_, index) => {
                  return (
                    <TableCell key={index} align="center">
                      {"\xa0".repeat(2) + index + "\xa0".repeat(2)}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: "bold" }}>State</Typography>
                </TableCell>
                {Array.from(cpu.branchPredictor).map((value, index) => {
                  return (
                    <TableCell key={index} align="center">
                      {BP_STATES[value]}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item>
        <Cache cache={cpu.getCacheRep()} height={height} width={width}></Cache>
      </Grid>
    </Paper>
  );
};

export default function Simulation() {
  const [coreIndex, setCoreIndex] = useState(0);
  const [falseState, setFalseState] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [winDialogOpen, setWinDialogOpen] = useState(false);
  const [loseDialogOpen, setLoseDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const cpuRepeatCountRef = useRef();

  const cpu = global?.cpu;

  if (!cpu) {
    return (
      <Typography>
        No programs selected, go to <Link to="/">select</Link> to choose programs.
      </Typography>
    );
  }

  const closeAll = () => {
    setWinDialogOpen(false);
    setLoseDialogOpen(false);
    setHelpDialogOpen(false);
  };

  const checkAndHandleEnd = () => {
    if (cpu.lockCheckSecret) {
      if (cpu.guessSecretCorrect) {
        setWinDialogOpen(true);
      } else {
        setLoseDialogOpen(true);
      }
    }
  };

  const cycleCpu = () => {
    const count = Number(cpuRepeatCountRef.current.value);
    for (let i = 0; i < count; i++) {
      try {
        cpu.nextCycle();
        checkAndHandleEnd();
      } catch (ex) {
        console.error(ex);
        setErrorText(ex.message);
      }
    }
    setFalseState(falseState + 1);
  };

  const commitCpu = () => {
    const count = Number(cpuRepeatCountRef.current.value);
    for (let i = 0; i < count; i++) {
      try {
        while (cpu.getRunningStatus()[coreIndex] && !cpu.nextCycle()[coreIndex]) {
          checkAndHandleEnd();
        }
        checkAndHandleEnd();
      } catch (ex) {
        console.error(ex);
        setErrorText(ex.message);
      }
    }
    setFalseState(falseState + 1);
  };

  const resetCore = () => {
    cpu.cores[coreIndex].restartCore();
    setFalseState(falseState + 1);
  };

  const determineRepeatCountValue = () => {
    const num = Number(cpuRepeatCountRef?.current?.value);
    if (Number.isNaN(num) || num <= 0) {
      return 1;
    }
    return num;
  };

  function Controls() {
    return (
      <Paper elevation={10}>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h4">Controls</Typography>
          </Grid>
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
              label="CPU Action Count"
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
          <Grid item xs={1}>
            <Tooltip title="Open Help">
              <IconButton
                color="primary"
                onClick={() => {
                  setHelpDialogOpen(true);
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
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
          </Grid>
          <Grid item>
            <GlobalCpuState cpu={cpu} />
          </Grid>
          <Grid item container justifyContent="center">
            <Box color="error.main">
              <pre>{errorText}</pre>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <WinDialog open={winDialogOpen} onClose={closeAll} />
      <LoseDialog open={loseDialogOpen} onClose={closeAll} />
      <HelpDialog open={helpDialogOpen} onClose={closeAll} />
    </>
  );
}
