import React, { ReactNode } from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { TradeType } from '../../types/types';

export type TradeTableProps = {
    trades: TradeType[];
};

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns = React.useMemo<ColumnDef<TradeType>[]>(
        () => [
            {
                header: 'Trade Info',
                columns: [
                    { accessorKey: 'favorited', header: 'Favorited' },
                    { accessorKey: 'entryDate', header: 'Entry Date' },
                    { accessorKey: 'exitDate', header: 'Exit Date' },
                    { accessorKey: 'instrument', header: 'Instrument' },
                    { accessorKey: 'tradeType', header: 'Trade Type' },
                    { accessorKey: 'optionType', header: 'Option Type' },
                    { accessorKey: 'setup', header: 'Setup' },
                    { accessorKey: 'tiltmeter', header: 'Tiltmeter' },
                    { accessorKey: 'direction', header: 'Direction' },
                    { accessorKey: 'quantity', header: 'Quantity' },
                    { accessorKey: 'entryPrice', header: 'Entry Price' },
                    { accessorKey: 'exitPrice', header: 'Exit Price' },
                    { accessorKey: 'takeProfitPrice', header: 'Take Profit Price' },
                    { accessorKey: 'stopLossPrice', header: 'Stop Loss Price' },
                    { accessorKey: 'feesInDollar', header: 'Fees ($)' },
                    { accessorKey: 'gainOrLossInDollar', header: 'Gain / Loss ($)' },
                    { accessorKey: 'accountSizeInDollar', header: 'Account Size ($)' },
                    { accessorKey: 'riskPlanned', header: 'R Planned' },
                    { accessorKey: 'riskMultiple', header: 'R Multiple' },
                    { accessorKey: 'originalTakeProfitHit', header: 'Original TP Hit?' },
                    { accessorKey: 'entryTags', header: "Entry Tags" },
                    { accessorKey: 'exitTags', header: "Exits Tags" },
                    { accessorKey: 'tradeManagementTags', header: "Trade Management Tags" },
                    { accessorKey: 'pricePercentMove', header: "Price (%)" },
                    { accessorKey: 'expiryDate', header: 'Expiry Date' },
                    { accessorKey: 'personalNotes', header: 'Personal Notes' },
                ],
            },
        ],
        []
    );

    const table = useReactTable({
        data: trades,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-2">
            <table>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                <div onClick={header.column.getToggleSortingHandler()}>
                                    {header.column.columnDef.header as ReactNode}
                                    {(header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : null) as ReactNode}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {typeof cell.getValue() === 'object' && 'name' in (cell.getValue() as any) && 'tagCategory' in (cell.getValue() as any)
                                    ? `${(cell.getValue() as {name: string, tagCategory: string}).name} (${(cell.getValue() as {name: string, tagCategory: string}).tagCategory})`
                                    : cell.getValue() as ReactNode
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <pre>{JSON.stringify(sorting, null, 2)}</pre>
        </div>
    );
};

export default TradeTable;