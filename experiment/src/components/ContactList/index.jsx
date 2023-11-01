import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

class ContactDirectory extends Component {
    state = {
        contacts: [],
        editingIndex: -1,
        editedContact: {
            name: '',
            address: '',
            phone: '',
        },
        addingContact: {
            name: '',
            address: '',
            phone: '',
        },
    };

    componentDidMount() {
        this.fetchContacts();
    }

    fetchContacts = async () => {
        try {
            const response = await api.get('/api/contacts');
            this.setState({ contacts: response.data });
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        if (this.state.editingIndex !== -1) {
            this.setState((prevState) => ({
                editedContact: {
                    ...prevState.editedContact,
                    [name]: value,
                },
            }));
        } else {
            this.setState((prevState) => ({
                addingContact: {
                    ...prevState.addingContact,
                    [name]: value,
                },
            }));
        }
    };

    addContact = async () => {
        try {
            const response = await api.post('/api/contacts', this.state.addingContact);
            this.setState((prevState) => ({
                contacts: [...prevState.contacts, response.data],
                addingContact: { name: '', address: '', phone: '' },
            }));
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    editContact = (index) => {
        this.setState({ editingIndex: index, editedContact: { ...this.state.contacts[index] } });
    };

    saveContact = async (index) => {
        try {
            const { contacts, editedContact } = this.state;
            const response = await api.put(`/api/contacts/${contacts[index]._id}`, editedContact);
            contacts[index] = response.data;
            this.setState({ contacts, editingIndex: -1 });
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    deleteContact = async (index) => {
        try {
            const { contacts } = this.state;
            await api.delete(`/api/contacts/${contacts[index]._id}`);
            contacts.splice(index, 1);
            this.setState({ contacts });
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    render() {
        const { contacts, addingContact, editedContact, editingIndex } = this.state;

        return (
            <div className="contact-directory">
                <h1>个人通讯录系统</h1>
                <div className="add-contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="姓名"
                        value={addingContact.name}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="住址"
                        value={addingContact.address}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="电话"
                        value={addingContact.phone}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.addContact}>添加联系人</button>
                </div>
                <ul className="contact-list">
                    {contacts.map((contact, index) => (
                        <li key={index} className="contact-item">
                            {editingIndex === index ? (
                                <div className="edit-contact-form">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="姓名"
                                        value={editedContact.name}
                                        onChange={this.handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="住址"
                                        value={editedContact.address}
                                        onChange={this.handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="电话"
                                        value={editedContact.phone}
                                        onChange={this.handleInputChange}
                                    />
                                    <button onClick={() => this.saveContact(index)}>保存</button>
                                    <button onClick={() => this.setState({ editingIndex: -1 })}>取消</button>
                                </div>
                            ) : (
                                <div className="contact-info">
                                    <span>{contact.name}</span>
                                    <span>{contact.address}</span>
                                    <span>{contact.phone}</span>
                                    <button onClick={() => this.editContact(index)}>编辑</button>
                                    <button onClick={() => this.deleteContact(index)}>删除</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default ContactDirectory;