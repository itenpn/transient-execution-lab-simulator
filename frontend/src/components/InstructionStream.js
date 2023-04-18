import { Grid, Box } from "@mui/material";

import { instructionToString } from "../logic/Instructions";

export default function InstructionStream(props) {
  const { stream } = props;

  console.log("Stream", stream);

  function InstructionCell(props) {
    const { instruction } = props;

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

  return (
    <>
      <Box sx={{ border: 2 }}>
        <Grid container direction="row">
          {stream.map((instruction, index) => {
            return (
              <Grid item xs={12} key={index}>
                <InstructionCell instruction={instruction} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
