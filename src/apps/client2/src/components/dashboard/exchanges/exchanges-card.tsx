import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import {paths} from "@/paths";

export interface Exchange {
  id: string;
  exchange_name: string;
  image_id: string;
  exchange_referral: string;
  instruction: string;
}

export interface ApiKey {
  id: string;
  exchange_id: string;
  title: string;
  api_key_value: string;
  api_referral: boolean;
}

export interface ExchangeCardProps {
  exchange: Exchange;
}

export function ExchangeCard({ exchange }: ExchangeCardProps): React.JSX.Element {
  return (
    <a href={paths.dashboard.exchange}>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardContent sx={{ flex: '1 1 auto' }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar src={exchange.exchange_referral} variant="square" />
            </Box>
            <Stack spacing={1}>
              <Typography align="center" variant="h5">
                {exchange.exchange_name}
              </Typography>
              <Typography align="center" variant="body1">
                {exchange.image_id}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <DownloadIcon fontSize="var(--icon-fontSize-sm)" />
            <Typography color="text.secondary" display="inline" variant="body2">
              {exchange.instruction} installs
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </a>
  );
}
