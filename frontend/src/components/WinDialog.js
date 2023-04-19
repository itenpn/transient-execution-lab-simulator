import { Button, Dialog, DialogActions, Typography } from "@mui/material";

const WinDialog = (props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <Typography variant="h3">😎🔥😎🔥😎 You Win! 😎🔥😎🔥😎</Typography>
      <Typography variant="body1">Continue your hacking journey below...</Typography>
      <iframe src="https://hackertyper.net/" title="Maximum Hacking" height="600"></iframe>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Celebrate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WinDialog;
