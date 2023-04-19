import { Grid, Box, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { range, stringifyData } from "../logic/util";

export default function Registers(props) {
  const { registers } = props;
  const BASE = 16;

  function RegisterCell(props) {
    const { value, index } = props;

    return (
      <TableCell align="right">
        <Box sx={{ fontFamily: "Monospace" }} component="span">
          <Box fontWeight="bold" component="span">
            R{(index + "").padEnd(3, " ")}
          </Box>
          {stringifyData(value, BASE, 8)}
        </Box>
      </TableCell>
    );
  }

  function RegisterRow(props) {
    const { row } = props;
    const rowData = Array.from(registers.slice(row * 4, row * 4 + 4));
    const indexes = range(row * 4, row * 4 + 4);

    return (
      <>
        <TableRow key={row}>
          <RegisterCell value={rowData[0]} index={indexes[0]}></RegisterCell>
          <RegisterCell value={rowData[1]} index={indexes[1]}></RegisterCell>
          <RegisterCell value={rowData[2]} index={indexes[2]}></RegisterCell>
          <RegisterCell value={rowData[3]} index={indexes[3]}></RegisterCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <Box sx={{ width: 1 }}>
        <Grid container>
          <TableContainer component={Paper}>
            <Table padding="checkbox">
              <TableBody>
                <RegisterRow row={0}></RegisterRow>
                <RegisterRow row={1}></RegisterRow>
                <RegisterRow row={2}></RegisterRow>
                <RegisterRow row={3}></RegisterRow>
                <RegisterRow row={4}></RegisterRow>
                <RegisterRow row={5}></RegisterRow>
                <RegisterRow row={6}></RegisterRow>
                <RegisterRow row={7}></RegisterRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </>
  );
}
