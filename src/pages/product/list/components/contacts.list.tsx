import { Input, List } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listContacts } from "../../../../services/contacts";


type Contact = {
    id: string,
    code: string,
    companyName: string
}

export const SearchByContact = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<Array<Contact>>([]);
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

    useEffect(() => {
        loadContacts(searchQuery);

        if (!searchQuery) { // When the search input is cleared (i.e press X), reset the contact query param
            searchParams.delete("contact");
            setSearchParams(searchParams);
        }
    }, [searchQuery])

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

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchQuery(e.target.value);
    };

    const onFocus = () => { setShowSearchResults(true); }
    const onBlur = () => { setShowSearchResults(false); }    // Fix this

    const onSearchResultClick = useCallback((contact: Contact) => {
        setSearchQuery(contact.companyName);
        setSearchParams({ contact: contact.id });
        setShowSearchResults(false);
    }, []);

    return (
        <>
            <Input
                size="middle"
                placeholder="Search for Supplier"
                allowClear
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                value={searchQuery} />

            {<List
                style={{ backgroundColor: 'white', fontSize: '0.4rem', cursor: 'pointer' }}
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
            />}
        </>
    )
}