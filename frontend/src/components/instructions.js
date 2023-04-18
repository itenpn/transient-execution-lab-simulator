import { Grid, Box } from "@mui/material";

import { instructionToString } from "../logic/Instructions";

export default function Instructions(props) {
  const { core, instructions, labels } = props;

  function LabelCell(props) {
    const { index } = props;
    const labelsForIndex = labels.filter((l) => l.index === index);
    return (
      <Grid container direction="row" alignItems="flex-end" justifyContent="flex-end">
        <Box sx={{ fontFamily: "Monospace" }} component="span" pr={2}>
          {labelsForIndex.map((label) => label.name).join(", ")}
        </Box>
      </Grid>
    );
  }

  function InstructionCell(props) {
    const { instruction, index } = props;

    let styling = { fontFamily: "Monospace" };
    if (core.instPointer === index) {
      styling.backgroundColor = "instruction.dispatchPointer";
    }
    if (core.instructionStream[core.commitPointer]?.instPointerOriginal === index) {
      styling.backgroundColor = "instruction.commitPointer";
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
          {instructions.map((instruction, index) => {
            return (
              <Grid item xs={12} container key={index}>
                <Grid item xs={6} container justifyContent="flex-end">
                  <LabelCell index={index} />
                </Grid>
                <Grid item xs={6}>
                  <InstructionCell instruction={instruction} index={index} />
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
