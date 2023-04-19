import { Paper } from "@mui/material";

const TallPaper = (props) => {
  return (
    <Paper {...props} elevation={10}>
      {props.children}
    </Paper>
  );
};

export default TallPaper;
