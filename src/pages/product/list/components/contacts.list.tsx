import { List } from "antd";
import { useEffect, useState } from "react";
import { listContacts } from "../../../../services/contacts";

type SearchByContactDropdownProps = {
    query: string
}

export const SearchByContactDropdown = (props: SearchByContactDropdownProps) => {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadContacts(props.query);
    }, [props.query])

    const loadContacts = async (queryParams?: string) => {
        setLoading(true);
        try {
            const res = await listContacts({
                query: queryParams
            });
            // console.log(res);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return <List
        size="small"
        bordered
        loading={loading}
        dataSource={contacts}
        renderItem={(contact) => <List.Item>{contact}</List.Item>}
    />;
};
