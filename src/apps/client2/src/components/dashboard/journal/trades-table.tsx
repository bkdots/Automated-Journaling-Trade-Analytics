'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export enum TradeType {
  Spot = 'Spot',
  Option = 'Option',
  Future = 'Future',
}

export enum DirectionType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export enum OptionType {
  Call = 'Call',
  Put = 'Put',
}

export interface Trade {
  id: bigint;
  user_id: bigint;
  journal_id: bigint;

  trade_type: TradeType;
  instrument: string;
  entry_time: string; // Using string to represent ISO 8601 date
  exit_time: string | null;
  direction: DirectionType;
  option_type: OptionType | null;
  multiplier: number | null;
  entry_price: number;
  quantity: number;
  target_stop_loss: number | null;
  target_take_profit: number | null;
  exit_price: number | null;
  fees: number | null;
  notes: string | null;
  highest_price: number | null;
  lowest_price: number | null;
  origin_take_profit_hit: boolean | null;

  confidence: number | null;
  entry_rating: number | null;
  exit_rating: number | null;
  execution_rating: number | null;
  management_rating: number | null;
  net_profit_loss: number | null;
  gross_profit_loss: number | null;
  pnl_percentage: number | null;
  time_in_trade: string | null; // Using string to represent ISO 8601 date

  cid: bigint;
  ctime: string; // Using string to represent ISO 8601 date
  mid: bigint;
  mtime: string; // Using string to represent ISO 8601 date
}

interface TradesTableProps {
  count?: number;
  page?: number;
  rows?: Trade[];
  rowsPerPage?: number;
}

export function TradesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: TradesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((trade) => trade.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Side</TableCell>
              <TableCell>Instrument</TableCell>
              <TableCell>Entry Date</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell>Trade Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Entry</TableCell>
              <TableCell>Exit</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Return ($)</TableCell>
              <TableCell>Return (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  {/*<TableCell>*/}
                  {/*  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>*/}
                  {/*    <Avatar src={row.avatar} />*/}
                  {/*    <Typography variant="subtitle2">{row.name}</Typography>*/}
                  {/*  </Stack>*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>{row.email}</TableCell>*/}
                  {/*<TableCell>*/}
                  {/*  {row.address.city}, {row.address.state}, {row.address.country}*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>{row.phone}</TableCell>*/}
                  {/*<TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>*/}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
