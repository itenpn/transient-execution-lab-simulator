import { useEffect, useState } from "react";

import {
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Box,
  Collapse,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";

import { CpuSim } from "../../logic/CpuSim";
import { Program } from "../../logic/Parser";
import LabeledInline from "../util/LabeledInline";
import { inlineDelete, sleep } from "../../logic/util";
import { global } from "../../logic/global";

function FileCard(props) {
  const { file, removeFile, isVictim } = props;

  const [isError, setIsError] = useState(true);
  const [showProgramText, setShowProgramText] = useState(false);
  const [programText, setProgramText] = useState("");
  const [errorText, setErrorText] = useState("");

  const doParse = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setProgramText(text);
      try {
        new Program(text, []);
        setIsError(false);
      } catch (error) {
        setErrorText(error.message);
        setIsError(true);
      }
    };
    reader.onerror = (e) => {
      console.error(e.target.error.name);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    doParse();
  }, [doParse]);

  if (!file) return;

  return (
    <>
      <Paper elevation={15}>
        <Grid container direction="column">
          <Grid item container direction="row" alignItems="center">
            <Grid item lg={10} xs={8}>
              <LabeledInline labelText="Name">{file.name}</LabeledInline>
            </Grid>
            <Grid item lg={1} xs={2}>
              <Tooltip title={`${showProgramText ? "Hide" : "Show"} instructions`}>
                <IconButton color="primary" onClick={() => setShowProgramText(!showProgramText)}>
                  {showProgramText ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            {!isVictim && (
              <Grid item lg={1} xs={2}>
                <Tooltip title="Remove Program">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      removeFile(file);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <LabeledInline labelText="Parse Status">
              {isError ? "❌ Error" : "✅ Success"}
            </LabeledInline>
          </Grid>
          {isError && (
            <Grid item>
              <Box color="error.main">{errorText}</Box>
            </Grid>
          )}
          <Collapse in={showProgramText}>
            <Grid item>
              <Typography component="div">
                <Box fontWeight="bold" display="inline">
                  Instructions
                </Box>
              </Typography>
            </Grid>
            <Grid item>
              <pre>{programText}</pre>
            </Grid>
          </Collapse>
        </Grid>
      </Paper>
    </>
  );
}

export default function SelectPrograms(props) {
  const [victimFile, setVictimFile] = useState(null);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const onChangeVictim = (e) => {
    const newVictim = Array.from(e.target.files)[0];
    setVictimFile(newVictim);
  };

  const onChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Assign a random key to each file for react key's sake
    const filesWithKeys = newFiles.map((nf) => {
      nf.key = Math.random();
      return nf;
    });
    setFiles(files.concat(filesWithKeys));
  };

  const removeFile = (file) => {
    setFiles(inlineDelete(files, file, "key"));
  };

  const startSimulation = async () => {
    const allFiles = [victimFile].concat(files);
    const done = allFiles.map((_) => false);
    const programs = allFiles.map((_) => null);
    const readers = allFiles.map((_) => new FileReader());
    readers.forEach((reader, index) => {
      reader.onload = (e) => {
        const text = e.target.result;
        try {
          const program = new Program(text, []);
          programs[index] = program;
        } catch (error) {
          // Nothing, intentionally
        }
        done[index] = true;
      };
    });
    for (let i = 0; i < readers.length; i++) {
      readers[i].readAsText(allFiles[i]);
    }
    while (!done.every((p) => p)) {
      // Terrible handling of event-based code -- just sleep till every program is parsed
      await sleep(100);
    }
    if (programs.every((p) => p)) {
      const cpu = new CpuSim(programs);
      global.cpu = cpu;
      navigate("/simulate");
    } else {
      /**
       * Ideally, this wouldn't be neccesary since the start button would just be unclickable unless every
       * program was parseable. Unfortunately I don't know to to useRef or useImperativeHandle
       * (or whatever lets this parent access the children programs), so this is the backup solution.
       */
      alert("Unparsable program, simulation cannot start.");
    }
  };

  return (
    <>
      <Paper elevation={10}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item container xs={12} justifyContent="center">
            <Typography variant="h5">RRISC CPU Simulator</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          </Grid>

          <Grid item container justifyContent="center" xs={4}>
            <Button variant="contained" component="label">
              Select Victim
              <input type="file" accept=".rrisc" hidden onChange={onChangeVictim} />
            </Button>
          </Grid>
          <Grid item container justifyContent="center" xs={4}>
            <Button variant="contained" component="label">
              Add Other Programs
              <input type="file" accept=".rrisc" multiple hidden onChange={onChange} />
            </Button>
          </Grid>
          <Grid item container justifyContent="center" xs={4}>
            <Button
              variant="contained"
              component="label"
              onClick={startSimulation}
              disabled={!victimFile || files.length === 0}
            >
              Start Simulation
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={10}>
        <Grid container direction="row" alignItems="center" justifyContent="center">
          <Grid item xs={6}>
            <FileCard file={victimFile} isVictim></FileCard>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={10}>
        <Grid container direction="row" alignItems="center" justifyContent="center">
          {files.map((file) => (
            <Grid item xs={6} key={file.key}>
              <FileCard file={file} removeFile={removeFile}></FileCard>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
}
