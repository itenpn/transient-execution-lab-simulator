import { useState } from "react";

import { Button, Grid, Dialog, DialogActions, Typography, DialogTitle } from "@mui/material";

import ProgrammerGuideDialog from "./ProgrammerGuideDialog";

const HelpDialog = (props) => {
  const { open, onClose } = props;

  const [guideDialogOpen, setGuideDialogOpen] = useState(false);

  const guideDialogOnClose = () => {
    setGuideDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>Help</DialogTitle>
        <Grid item container direction="column">
          <Typography backgroundColor="instruction.flushed">
            Instruction flushed (branch misprediction) color
          </Typography>
          <Typography backgroundColor="instruction.committed">
            Instruction already committed color
          </Typography>
          <Typography backgroundColor="instruction.dispatchPointer">
            Next instruction to be dispatched color
          </Typography>
          <Typography backgroundColor="instruction.commitPointer">
            Next instruction to be committed color
          </Typography>
          <ul>
            <li>
              <Typography>
                Keep in mind that a process can only legally access memory 0x1000 = 4096 bytes of
                memory corresponding to its core index plus one. For example, process 0 (always the
                victim) can access memory addresses 0x1000-0x1fff, process 1 can access memory
                addresses 0x2000-0x2fff, etc...
              </Typography>
            </li>
          </ul>
        </Grid>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setGuideDialogOpen(true);
            }}
          >
            Open Programmer Guide
          </Button>
          <Button variant="contained" onClick={onClose}>
            Close Help
          </Button>
        </DialogActions>
      </Dialog>
      <ProgrammerGuideDialog open={guideDialogOpen} onClose={guideDialogOnClose} />
    </>
  );
};

export default HelpDialog;
