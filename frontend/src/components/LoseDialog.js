import { Button, Dialog, DialogActions, Typography } from "@mui/material";

const LoseDialog = (props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <Typography variant="h3">🤓🤓🤓 You Lose! 🤓🤓🤓</Typography>
      <Typography variant="body1">Better luck next time...</Typography>
      <img src="https://thumbs.dreamstime.com/b/male-hacker-hacking-security-firewall-late-office-190919149.jpg" />
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Back to the drawing board
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoseDialog;
