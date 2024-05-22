'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { ExchangeCard } from '@/components/dashboard/exchanges/exchanges-card';
import type { Exchange, ApiKey } from '@/components/dashboard/exchanges/exchanges-card';
import { ExchangesFilters } from '@/components/dashboard/exchanges/exchanges-filters';

export default function Page(): React.JSX.Element {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchExchanges() {
      try {
        const response = await fetch('/api/rpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'list_exchanges',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exchanges');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Unknown error');
        }

        const exchangesArray: Exchange[] = Object.values(data.result.data);
        setExchanges(exchangesArray);
      } catch (error) {
        console.error('Error fetching exchanges:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchApiKeys() {
      try {
        const response = await fetch('/api/rpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'list_apikeys',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch apikeys');
        }

        const data = await response.json();
        console.log(data.result.data)

        if (data.error) {
          throw new Error(data.error.message || 'Unknown error');
        }

        const apiKeys: ApiKey[] = data.result.data.map((item: any) => ({
          id: item.id,
          exchange_id: item.exchange_id,
          title: item.title,
          api_key_value: item.api_key_value,
          api_referral: item.api_referral,
        }));

        setApiKeys(apiKeys);
        console.log('Processed ApiKeys:', apiKeys);
      } catch (error) {
        console.error('Error fetching ApiKeys:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExchanges();
    fetchApiKeys();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Exchanges</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <ExchangesFilters />
      <Grid container spacing={3}>
        {exchanges.map((exchange) => (
          <Grid key={exchange.id} lg={4} md={6} xs={12}>
            <ExchangeCard exchange={exchange} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}
