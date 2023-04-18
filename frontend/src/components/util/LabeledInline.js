import { Typography, Box } from "@mui/material";

function LabeledInline(props) {
  const { labelText, children } = props;

  return (
    <Typography component="div">
      <Box fontWeight="bold" display="inline">
        {labelText}:{" "}
      </Box>
      {children}
    </Typography>
  );
}

export default LabeledInline;
