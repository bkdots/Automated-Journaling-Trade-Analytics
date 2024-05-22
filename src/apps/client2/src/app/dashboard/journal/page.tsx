'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { paths } from '@/paths';
import { TradesFilters } from '@/components/dashboard/journal/trades-filters';
import { TradesTable } from '@/components/dashboard/journal/trades-table';
import type { Trade } from '@/components/dashboard/journal/trades-table';

export default function Page(): React.JSX.Element {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const page = 0;
  const rowsPerPage = 5;

  const paginatedTrades = applyPagination(trades, page, rowsPerPage);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch('/api/rpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'list_trades',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trades');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Unknown error');
        }

        const tradesArray: Trade[] = Object.values(data.result.data);
        console.log(tradesArray)
        setTrades(tradesArray);
      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrades();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Trades</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button href={paths.dashboard.trade} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <TradesFilters />
      <TradesTable
        count={paginatedTrades.length}
        page={page}
        rows={paginatedTrades}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Trade[], page: number, rowsPerPage: number): Trade[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
