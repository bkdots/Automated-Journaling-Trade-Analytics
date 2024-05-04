"use client";
import * as React from 'react';
import { useEffect } from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { TradesThread } from '@/components/dashboard/trade/trades-thread';
import { TradesData } from '@/components/dashboard/trade/trades-data';
import type { Trade } from '@/components/dashboard/journal/trades-table';

// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"subaccounts": { "address": "0x34838E8E11400272a12b4459a4e9CF31c07a5998" }}' \
//   https://archive.prod.vertexprotocol.com/v1
interface EventsRequestBody {
    events: {
        subaccount: string;
        event_types: string[];
        limit: {
            raw: number;
        };
    };
}

const customers = [
    {
        id: 'USR-010',
        name: 'Alcides Antonio',
        avatar: '/assets/avatar-10.png',
        email: 'alcides.antonio@devias.io',
        phone: '908-691-3242',
        address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-009',
        name: 'Marcus Finn',
        avatar: '/assets/avatar-9.png',
        email: 'marcus.finn@devias.io',
        phone: '415-907-2647',
        address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-008',
        name: 'Jie Yan',
        avatar: '/assets/avatar-8.png',
        email: 'jie.yan.song@devias.io',
        phone: '770-635-2682',
        address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-007',
        name: 'Nasimiyu Danai',
        avatar: '/assets/avatar-7.png',
        email: 'nasimiyu.danai@devias.io',
        phone: '801-301-7894',
        address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-006',
        name: 'Iulia Albu',
        avatar: '/assets/avatar-6.png',
        email: 'iulia.albu@devias.io',
        phone: '313-812-8947',
        address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-005',
        name: 'Fran Perez',
        avatar: '/assets/avatar-5.png',
        email: 'fran.perez@devias.io',
        phone: '712-351-5711',
        address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },

    {
        id: 'USR-004',
        name: 'Penjani Inyene',
        avatar: '/assets/avatar-4.png',
        email: 'penjani.inyene@devias.io',
        phone: '858-602-3409',
        address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-003',
        name: 'Carson Darrin',
        avatar: '/assets/avatar-3.png',
        email: 'carson.darrin@devias.io',
        phone: '304-428-3097',
        address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-002',
        name: 'Siegbert Gottfried',
        avatar: '/assets/avatar-2.png',
        email: 'siegbert.gottfried@devias.io',
        phone: '702-661-1654',
        address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-001',
        name: 'Miron Vitold',
        avatar: '/assets/avatar-1.png',
        email: 'miron.vitold@devias.io',
        phone: '972-333-4106',
        address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
] satisfies Trade[];

const fetchEventsForSubaccount = async (subaccount: string) => {
    const endpoint = 'https://archive.prod.vertexprotocol.com/v1';
    const requestBody = {
        events: {
            subaccount: subaccount,
            event_types: ["liquidate_subaccount", "deposit_collateral", "withdraw_collateral", "settle_pnl", "match_orders", "mint_lp", "burn_lp"], // Assuming you want all types
            limit: { raw: 100 } // Fetch up to 100 events
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default function Page(): React.JSX.Element {
    const page = 0;
    const rowsPerPage = 5;

    const subaccount = '0x34838e8e11400272a12b4459a4e9cf31c07a599864656661756c740000000000';

    const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

    useEffect(() => {
        fetchEventsForSubaccount(subaccount);
    }, [subaccount]);

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
                    <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                        Add
                    </Button>
                </div>
            </Stack>
            <TradesThread/>
            <TradesData/>
        </Stack>
    );
}

function applyPagination(rows: Trade[], page: number, rowsPerPage: number): Trade[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
