import { Button, Grid, Dialog, DialogActions, Typography, DialogTitle } from "@mui/material";

const HelpDialog = (props) => {
  const { open, onClose } = props;

  return (
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
              Keep in mind that a process can only legally access memory 0x100 = 256 bytes of memory
              corresponding to its core index. For example, process 0 (always the victim) can access
              memory addresses 0x1000-0x10ff, process 1 can access memory addresses 0x1100-0x11ff,
              process 2 can access memory addresses 0x1200-0x12ff, etc...
            </Typography>
          </li>
        </ul>
      </Grid>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close Help
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;
