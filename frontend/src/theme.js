import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#ba0c2f",
    },
    secondary: {
      main: "#a7b1b7",
    },
    error: {
      main: "#ba0c2f",
    },
    warning: {
      main: "#ffb600",
    },
    info: {
      main: "#c6e9f8",
    },
    background: {
      default: "#ffffff",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          margin: 15,
          padding: 15,
          backgroundColor: "#eff1f2",
        },
      },
    },
  },
});

export default theme;
