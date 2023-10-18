import React, { useState } from "react";
import {Box, Button} from "@mui/material";
import TabsComponent from '../../components/TabsComponent';
import {useHeaderContent} from "../../context/HeaderContent";
import ItemForm from "./ItemForm";
import { JournalType, TagType } from '../../types/types';
import {Tag} from "styled-components/native/dist/sheet/types";

const Journal = () => {
    const FAKE_JOURNALS = [
        { name: 'Journal 1', description: 'Description for Journal 1' },
        { name: 'Journal 2', description: 'Description for Journal 2' },
    ];

    const FAKE_TAGS: TagType[] = [
        { name: 'Tag 1', tagCategory: 'setup' },
        { name: 'Tag 2', tagCategory: 'mistake' },
    ];

    const [journals, setJournals] = useState<JournalType[]>(FAKE_JOURNALS);
    const [tags, setTags] = useState<TagType[]>(FAKE_TAGS);
    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<JournalType | TagType | undefined>();
    const setHeaderContent = useHeaderContent();
    const [selectedTab, setSelectedTab] = useState<"journals" | "tags">("journals");

    const handleAddItem = () => {
        setSelectedItem(undefined);
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
    };

    // TODO handle editing a journal
    const handleSelectItem = (item: JournalType | TagType) => {
        //...
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
                        content: <div>Content for Item One</div>,
                        route: "journals",
                        onClick: () => {
                            setSelectedTab("journals");
                            setShowForm(false);
                        }
                    },
                    {
                        label: "Tags",
                        content: <div>Content for Item Two</div>,
                        route: "tags",
                        onClick: () => {
                            setSelectedTab("tags")
                            setShowForm(false);
                        }
                    },
                ]}
            />
            {showForm && (
                <ItemForm
                    type={selectedTab === 'journals' ? 'journal' : 'tag'}
                    existingItem={selectedItem}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            {selectedTab === "journals" &&
                journals.map(journal => (
                    <Box key={journal.name} m={2} p={2} border="1px solid #ccc" borderRadius="4px">
                        <h4>{journal.name}</h4>
                        <p>{journal.description}</p>
                        <Button onClick={() => handleSelectItem(journal)}>Edit</Button>
                    </Box>
                ))
            }

            {selectedTab === "tags" &&
                tags.map(tag => (
                    <Box key={tag.name} m={2} p={2} border="1px solid #ccc" borderRadius="4px">
                        <h4>{tag.name}</h4>
                        <p>Category: {tag.tagCategory}</p>
                        <Button onClick={() => handleSelectItem(tag)}>Edit</Button>
                    </Box>
                ))
            }

        </Box>
    );
};

export default Journal;