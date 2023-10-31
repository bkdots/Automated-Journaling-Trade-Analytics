export type JournalType = {
    id: string,
    name: string;
    description: string;
}

export type TagType = {
    id: string,
    name: string;
    tagCategory: TagCategoryEnum;
}

export type TradeType = {
    id: string,
    favorited: boolean,
    entryDate: string,
    exitDate: string,
    instrument: string,
    tradeType: TradeTypeEnum,
    optionType: string,
    setup: string,
    tiltmeter: string,
    direction: DirectionEnum,
    quantity: number,
    entryPrice: number,
    exitPrice: number,
    takeProfitPrice: number,
    stopLossPrice: number,
    feesInDollar: number,
    gainOrLossInDollar: number,
    gainOrLossInPercent: number,
    accountSizeInDollar: number,
    riskPlanned: number,
    riskMultiple: number,
    originalTakeProfitHit: boolean,
    entryTags: TagType,
    exitTags: TagType,
    tradeManagementTags: TagType,
    pricePercentMove: number,
    expiryDate: string,
    personalNotes: string
}

export enum TradeTypeEnum {
    Spot = 'Spot',
    Option = 'Option',
    Future = 'Future'
}
export enum DirectionEnum {
    Long = 'Long',
    Short = 'Short'
}

export enum TagCategoryEnum {
    Setup = 'Setup',
    Mistake = 'Mistake',
    Management = 'Management'
}