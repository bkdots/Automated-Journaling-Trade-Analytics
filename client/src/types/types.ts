export type JournalType = {
    id: string,
    name: string;
    description: string;
}

export type TagType = {
    id: string,
    name: string;
    tagCategory: 'setup' | 'mistake';
}