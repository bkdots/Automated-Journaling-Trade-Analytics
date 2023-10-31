import React, {ReactNode, useState} from 'react';
import {useReactTable, ColumnDef, getCoreRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import {TradeType} from '../../types/types';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export type TradeTableProps = {
    trades: TradeType[];
};

const TradeTable: React.FC<TradeTableProps> = ({trades}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [favorited, setFavorited] = useState<Record<string, boolean>>({});

    const columns = React.useMemo<ColumnDef<TradeType>[]>(
        () => [
            {accessorKey: 'select', header: ''},
            {accessorKey: 'favorited', header: ''},
            {accessorKey: 'entryDate', header: 'Entry Date'},
            {accessorKey: 'exitDate', header: 'Exit Date'},
            {accessorKey: 'instrument', header: 'Instrument'},
            {accessorKey: 'tradeType', header: 'Trade Type'},
            {accessorKey: 'optionType', header: 'Option Type'},
            {accessorKey: 'setup', header: 'Setup'},
            {accessorKey: 'tiltmeter', header: 'Tiltmeter'},
            {accessorKey: 'direction', header: 'Direction'},
            {accessorKey: 'quantity', header: 'Quantity'},
            {accessorKey: 'entryPrice', header: 'Entry Price'},
            {accessorKey: 'exitPrice', header: 'Exit Price'},
            {accessorKey: 'takeProfitPrice', header: 'Take Profit Price'},
            {accessorKey: 'stopLossPrice', header: 'Stop Loss Price'},
            {accessorKey: 'feesInDollar', header: 'Fees ($)'},
            {accessorKey: 'gainOrLossInDollar', header: 'Gain / Loss ($)'},
            {accessorKey: 'accountSizeInDollar', header: 'Account Size ($)'},
            {accessorKey: 'riskPlanned', header: 'R Planned'},
            {accessorKey: 'riskMultiple', header: 'R Multiple'},
            {accessorKey: 'originalTakeProfitHit', header: 'Original TP Hit?'},
            {accessorKey: 'entryTags', header: "Entry Tags"},
            {accessorKey: 'exitTags', header: "Exits Tags"},
            {accessorKey: 'tradeManagementTags', header: "Trade Management Tags"},
            {accessorKey: 'pricePercentMove', header: "Price (%)"},
            {accessorKey: 'expiryDate', header: 'Expiry Date'},
            {accessorKey: 'personalNotes', header: 'Personal Notes'},
        ],
        []
    );

    const toggleFavorite = (id: string) => {
        setFavorited(prevFavorited => ({ ...prevFavorited, [id]: !prevFavorited[id] }));
    };

    const toggleSelected = (id: string) => {
        setSelected(prevSelected => ({ ...prevSelected, [id]: !prevSelected[id] }));
    };

    const table = useReactTable({
        data: trades,
        columns,
        state: {sorting},
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-2" style={{maxWidth: '100%', overflowX: 'auto'}}>
            <table style={{borderCollapse: 'collapse', minWidth: '100%'}}>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} style={{border: '1px solid black', padding: '10px', minWidth: '150px'}}>
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
                    <tr key={row.id} className={selected[row.id] ? "selected-row" : ""}>
                        <td style={{border: '1px solid black', padding: '10px'}}>
                            <input type="checkbox" checked={selected[row.id]}
                                   onChange={() => toggleSelected(row.id)}/>
                        </td>
                        <td style={{border: '1px solid black', padding: '10px'}}>
                                <span onClick={() => toggleFavorite(row.id)}>
                                    {favorited[row.id] ? <StarIcon/> : <StarBorderIcon/>}
                                </span>
                        </td>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} style={{border: '1px solid black', padding: '10px', minWidth: '150px'}}>
                                {typeof cell.getValue() === 'object' && 'name' in (cell.getValue() as any) && 'tagCategory' in (cell.getValue() as any)
                                    ? `${(cell.getValue() as {
                                        name: string,
                                        tagCategory: string
                                    }).name} (${(cell.getValue() as {
                                        name: string,
                                        tagCategory: string
                                    }).tagCategory})`
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