import { Grid, Typography, Paper } from "@mui/material";

import Registers from "./registers";
import Instructions from "./instructions";
import InstructionStream from "./InstructionStream";

export default function Core(props) {
  const { core, program, index } = props;

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={6} container justifyContent="center">
          <InstructionStream stream={core.instructionStream} />
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={10}>
            <Grid
              item
              xs={12}
              container
              direction="column"
              alignItems="center"
              justifyContent="space-around"
            >
              <Grid item>
                <Typography variant="h4">{`Core ${index}: ${program.name}`}</Typography>
              </Grid>
              <Grid item>
                <Instructions
                  core={core}
                  labels={core.labels}
                  instructions={core.program.instructions}
                ></Instructions>
              </Grid>
              <Grid item container>
                <Grid item xs={12}>
                  <Registers registers={core.registers}></Registers>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
