import React, { useState } from "react";
import {Box, Button} from "@mui/material";
import TabsComponent from '../../components/TabsComponent';
import {useHeaderContent} from "../../context/HeaderContent";
import ItemForm from "./ItemForm";
import { JournalType, TagType } from '../../types/types';
import {Link, useNavigate} from "react-router-dom";

const Journal = () => {
    const FAKE_JOURNALS = [
        { id: 'j1', name: 'Journal 1', description: 'Description for Journal 1' },
        { id: 'j2', name: 'Journal 2', description: 'Description for Journal 2' },
    ];

    const FAKE_TAGS: TagType[] = [
        { id: 't1', name: 'Tag 1', tagCategory: 'setup' },
        { id: 't2', name: 'Tag 2', tagCategory: 'mistake' },
    ];

    const navigate = useNavigate();
    const [journals, setJournals] = useState<JournalType[]>(FAKE_JOURNALS);
    const [tags, setTags] = useState<TagType[]>(FAKE_TAGS);
    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<JournalType | TagType | undefined>();
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const setHeaderContent = useHeaderContent();
    const [selectedTab, setSelectedTab] = useState<"journals" | "tags">("journals");

    const renderListItem = (item: JournalType | TagType, type: 'journal' | 'tag') => {
        const handleItemClick = () => {
            if (type === 'journal') {
                navigate(`./${(item as JournalType).id}`);
            }
        };

        return editingItem === item.name ? (
            <ItemForm
                type={type}
                existingItem={item}
                onSave={handleSave}
                onCancel={() => setEditingItem(null)}
            />
        ) : (
            <Box
                key={item.name} m={2} p={2}
                border="1px solid #ccc"
                borderRadius="4px"
                style={{cursor: type === 'journal' ? 'pointer' : 'default'}}
                onClick={handleItemClick}>
                <h4>{item.name}</h4>
                <p>
                    {
                        type === 'journal'
                            ? (item as JournalType).description
                            : `Category: ${(item as TagType).tagCategory}`
                    }
                </p>
                <Button onClick={(e) => {
                    e.stopPropagation();
                    handleSelectItem(item);
                }}>Edit</Button>
            </Box>
        );
    }

    const handleAddItem = () => {
        setSelectedItem(undefined);
        setEditingItem(null);
        setShowForm(true);
    };

    // TODO handle saving into database
    const handleSave = (item: JournalType | TagType) => {
        console.log(item);
        if (selectedTab === 'journals') {
            setJournals(prev => [...prev, item as JournalType]);
        } else {
            setTags(prev => [...prev, item as TagType]);
        }
        setShowForm(false);
    }

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    // TODO handle editing a journal
    const handleSelectItem = (item: JournalType | TagType) => {
        setSelectedItem(item);
        setShowForm(false);
        setEditingItem(item.name);
    };

    React.useEffect(() => {
        if (setHeaderContent) {
            const content = selectedTab === "journals" ? (
                <>
                    <Button onClick={handleAddItem}>+ Add Journal</Button>
                    <span>Total Money: $5000</span>
                </>
            ) : (
                <>
                    <Button onClick={handleAddItem}>+ Add Tag</Button>
                    <span>Total Tags: 5</span>
                </>
            );

            setHeaderContent(content);

            return () => setHeaderContent(null);
        }
    }, [setHeaderContent, selectedTab]);

    return (
        <Box m="20px">
            <TabsComponent
                tabs={[
                    {
                        label: "Journals",
                        content: (
                            <>
                                {showForm && !editingItem && selectedTab === 'journals' && (
                                    <ItemForm
                                        type="journal"
                                        existingItem={selectedItem}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                    />
                                )}
                                {journals.map(journal => renderListItem(journal, 'journal'))}
                            </>
                        ),
                        route: "journals",
                        onClick: () => {
                            setSelectedTab("journals");
                            setShowForm(false);
                        }
                    },
                    {
                        label: "Tags",
                        content: (
                            <>
                                {showForm && !editingItem && selectedTab === 'tags' && (
                                    <ItemForm
                                        type="tag"
                                        existingItem={selectedItem}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                    />
                                )}
                                {tags.map(tag => renderListItem(tag, 'tag'))}
                            </>
                        ),
                        route: "tags",
                        onClick: () => {
                            setSelectedTab("tags");
                            setShowForm(false);
                        }
                    },
                ]}
            />
        </Box>
    );
};

export default Journal;