import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Paper,
} from "@mui/material";

import LabeledInline from "./util/LabeledInline";
import { INSTRUCTIONS } from "../logic/Instructions";

const InstructionInputBlurb = (props) => {
  const { index, input } = props;

  return (
    <LabeledInline labelText={`Input${index}`}>
      {`Dependency: ${input.dependency}; Allowed Types: [${input.allowed_types.join(", ")}]`}
    </LabeledInline>
  );
};

const InstructionDescriptionCard = (props) => {
  const { instruction } = props;

  return (
    <Paper elevation={10}>
      <Grid container>
        <Grid item xs={12}>
          <LabeledInline labelText="Name">{instruction.name}</LabeledInline>
        </Grid>
        <Grid item xs={6}>
          <LabeledInline labelText="Class">{instruction.class}</LabeledInline>
        </Grid>
        <Grid item xs={6}>
          <LabeledInline labelText="Cycle Count">{instruction.cycles}</LabeledInline>
        </Grid>
        <Grid item xs={12}>
          <LabeledInline labelText="Description">{instruction.description}</LabeledInline>
        </Grid>
        {instruction.inputs.length > 0 && (
          <Grid item xs={12}>
            <LabeledInline labelText="Inputs"></LabeledInline>
            <ol>
              {instruction.inputs.map((input, index) => {
                return (
                  <li key={index}>
                    <InstructionInputBlurb input={input} index={index} />
                  </li>
                );
              })}
            </ol>
          </Grid>
        )}
        <Grid item xs={6}></Grid>
      </Grid>
    </Paper>
  );
};

const ProgrammerGuideDialog = (props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} maxWidth="xl" fullWidth>
      <DialogTitle>Programmer Guide</DialogTitle>
      <DialogContent>
        <Grid container>
          {Object.values(INSTRUCTIONS).map((instruction, index) => {
            return (
              <Grid item sm={6} xs={12} key={index}>
                <InstructionDescriptionCard instruction={instruction} />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close Programmer Guide
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgrammerGuideDialog;
