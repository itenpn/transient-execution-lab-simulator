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

import { Program } from "../logic/Parser";
import LabeledInline from "./util/LabeledInline";
import { inlineDelete } from "../logic/util";

function FileCard(props) {
  const { file, removeFile } = props;

  const [isError, setIsError] = useState(true);
  const [showProgramText, setShowProgramText] = useState(false);
  const [programText, setProgramText] = useState("");
  const [errorText, setErrorText] = useState("");

  const doParse = () => {
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
  }, []);

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
  const [files, setFiles] = useState([]);

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
    setFiles(inlineDelete(files, file, "name"));
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
              Add Programs
              <input type="file" accept=".rrisc" multiple hidden onChange={onChange} />
            </Button>
          </Grid>
          <Grid item container justifyContent="center" xs={4}>
            <Button variant="contained" component="label">
              Start Simulation
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={10}>
        <Grid container direction="row" alignItems="center" justifyContent="center">
          {files.map((file) => (
            <Grid item xs={6}>
              <FileCard file={file} key={file.key} removeFile={removeFile}></FileCard>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
}
