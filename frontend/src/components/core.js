import { Grid, Typography } from "@mui/material";
import Registers from "./registers";
import Instructions from "./instructions";

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
          <Grid item container justifyContent="center">
            <Grid item xs={10}>
              <Registers registers={core.registers}></Registers>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
