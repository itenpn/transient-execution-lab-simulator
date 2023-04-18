import { Grid, Typography } from "@mui/material";
import Registers from "./registers";
import { useState } from "react";

export default function Core(props) {
  const { core, program, index } = props;

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={6} sx={{ height: "90vh" }}>
          Instruction stream goes here
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item sx={{ height: "45vh" }}>
            <Typography variant="h4">{`Core ${index}: ${program.name}`}</Typography>
          </Grid>
          <Grid item sx={{ height: "45vh" }} container justifyContent="center">
            <Grid item xs={10}>
              <Registers registers={core.registers}></Registers>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
