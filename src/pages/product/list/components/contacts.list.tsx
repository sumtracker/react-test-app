import { Input, List } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { SEARCH_DEBOUNCE_MILLIS } from "../../../../constants/app.constants";
import { listContacts } from "../../../../services/contacts";


type Contact = {
    id: string,
    code: string,
    companyName: string
}

export const SearchByContact = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSearchQuery = useDebounce<string>(searchQuery, SEARCH_DEBOUNCE_MILLIS);

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<Array<Contact>>([]);
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

    useEffect(() => {
        loadContacts(debouncedSearchQuery);
    }, [debouncedSearchQuery])

    const loadContacts = async (searchQuery?: string) => {
        setLoading(true);
        try {
            const res = await listContacts({ search: searchQuery });
            const contacts = res.data.results.map((contact: any) => ({
                id: contact.id,
                code: contact.code,
                companyName: contact.company_name
            }));
            setContacts(contacts);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    const onInputFocused = () => { setShowSearchResults(true); }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowSearchResults(true);

        if (!query) { // When the search input is cleared (i.e press X), reset the contact query param
            searchParams.delete("contact");
            setSearchParams(searchParams);
            setShowSearchResults(false);
        }
    };

    const onSearchResultClick = (contact: Contact) => {
        setSearchParams({ contact: contact.id });
        setSearchQuery(contact.companyName);
        setShowSearchResults(false);
    };

    return (
        <div style={{ position: 'relative', overflow: 'visible', marginLeft: '8px', width: '24rem' }}>
            <Input
                size="middle"
                placeholder="Search for Supplier"
                allowClear
                onChange={onChange}
                onClick={onInputFocused}
                value={searchQuery} />

            {showSearchResults && <div style={{ position: 'relative' }}>
                <List
                    style={{ position: 'absolute', top: '4px', minWidth: '24rem', backgroundColor: 'white', fontSize: '0.4rem', cursor: 'pointer', zIndex: '10' }}
                    size="small"
                    bordered
                    loading={loading}
                    dataSource={contacts}
                    renderItem={(contact: Contact) => <List.Item onClick={() => { onSearchResultClick(contact) }}>
                        <>
                            {contact.code}
                            <br />
                            Company: {contact.companyName}
                        </>
                    </List.Item>}
                />
            </div>}
        </div>
    )
}