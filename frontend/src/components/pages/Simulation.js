import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button, Box, Tooltip, Paper, Grid, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { CACHE_SIZE } from "../../logic/MemorySim";
import { range } from "../../logic/util";
import { global } from "../../logic/global";

function Cache(props) {
  const { cache, height, width } = props;
  const BASE = 16;

  const stringifyData = (data, base) => {
    return data.toString(base).padStart(2, "0");
  };

  if (height * width !== cache.length)
    console.error(
      `Cache display height ${height} and width ${width} do not match cache length ${cache.length}`
    );

  const CacheRow = (row) => {
    const rowData = Array.from(cache.slice(row * width, row * width + width));
    const addresses = range(row * width, row * width + width);

    return (
      <TableRow key={row}>
        {rowData.map((data, index) => {
          return (
            <Tooltip title={`@0x${stringifyData(addresses[index], 16)}`} key={addresses[index]}>
              <TableCell>
                <Box sx={{ fontFamily: "Monospace" }} component="span">
                  {stringifyData(data, BASE)}
                </Box>
              </TableCell>
            </Tooltip>
          );
        })}
      </TableRow>
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" padding="none">
          <TableBody>{[...Array(height).keys()].map(CacheRow)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function Simulation() {
  const [cache, setCache] = useState(new Uint8Array(CACHE_SIZE));

  const cpu = global?.cpu;
  const height = 16;
  const width = 16;

  if (!cpu) {
    return (
      <Typography>
        No programs selected, go to <Link to="/select">select</Link> to choose programs.
      </Typography>
    );
  }

  const randomizeCache = () => {
    const newCache = new Uint8Array(CACHE_SIZE);
    for (let i = 0; i < CACHE_SIZE; i++) {
      newCache[i] = 256 * Math.random();
    }
    setCache(newCache);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          <Cache cache={cache} height={height} width={width}></Cache>
        </Grid>
      </Grid>
      <Button onClick={randomizeCache}>Randomize Cache</Button>
    </>
  );
}
