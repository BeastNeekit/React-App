import React, { useState, useRef } from 'react';
import {
    FaShoppingCart,
    FaCookie,
    FaHamburger,
    FaPizzaSlice,
    FaIceCream,
    FaCoffee,
    FaTrash,
    FaWineBottle,
    FaSmoking
} from 'react-icons/fa';
import './style.css';
import Notification from './components/Notification';
import { jsPDF } from 'jspdf';
import ReactDOMServer from 'react-dom/server';
import {GiFastNoodles, GiFlour, GiWrappedSweet} from "react-icons/gi";
import {LuBean} from "react-icons/lu";
import {MdSurfing} from "react-icons/md";


const iconOptions = [
    { name: 'Shopping', icon: FaShoppingCart },
    { name: 'Cookies', icon: FaCookie },
    { name: 'Wine', icon: FaWineBottle },
    { name: 'Noodle', icon: GiFastNoodles },
    { name: 'Cigarette', icon: FaSmoking },
    { name: 'Chocolate', icon: GiWrappedSweet },
    { name: 'Flour', icon: GiFlour},
    { name: 'Beans', icon: LuBean },
    { name: 'Surf', icon: MdSurfing },
];

function ItemInsert() {
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState('');
    const [items, setItems] = useState([]);
    const [notification, setNotification] = useState({});
    const itemsListRef = useRef(null);

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(parseInt(e.target.value));
    };

    const handleIconChange = (iconName) => {
        setSelectedIcon(iconName);
    };

    const addItem = () => {
        if (!selectedIcon) {
            setNotification({ message: 'Please select an icon!', type: 'error' });
            return;
        }
        if (itemName && amount > 0) {
            const newItem = {
                id: Date.now(), // Unique ID for each item
                name: itemName,
                amount: amount,
                icon: selectedIcon,
                time: new Date().toLocaleTimeString()
            };
            setItems([...items, newItem]);
            setItemName('');
            setAmount(0);
            setSelectedIcon('');
            setNotification({ message: 'Item added successfully', type: 'success' });
        } else {
            setNotification({ message: 'Please enter valid item name and amount!', type: 'error' });
        }
    };

    const deleteItem = (itemId) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        setNotification({ message: 'Item deleted successfully', type: 'success' });
    };

    const closeNotification = () => {
        setNotification({});
    };

    const generatePDF = () => {
        if (items.length === 0) {
            setNotification({ message: 'No items to generate PDF!', type: 'error' });
            return;
        }
        const doc = new jsPDF();

        let y = 10;
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(20);
        doc.text(`ORDER LISTS - ${currentDate}`, 60, y);

        y += 10;

        items.forEach((item, index) => {
            const IconComponent = iconOptions.find((option) => option.name === item.icon).icon;
            const iconSvg = ReactDOMServer.renderToString(<IconComponent />);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(iconSvg);
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imgData = canvas.toDataURL('image/png');


                doc.addImage(imgData, 'PNG', 5, y, 10, 10);


                const text = `${item.name} ---- Quantity: ${item.amount} `;
                doc.text(text, 30, y + 5);

                y += 20;

                if (index === items.length - 1) {
                    doc.save('items_list.pdf');
                }
            };
        });
    };


    return (
        <div className="container">
            <h1>Item Insert</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={handleItemNameChange}
                />
                <input
                    type="number"
                    className="input-field"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                />
                {itemName && (
                    <div className="icon-buttons">
                        {iconOptions.map((option, index) => (
                            <button
                                key={index}
                                className={`icon-button ${selectedIcon === option.name ? 'selected' : ''}`}
                                onClick={() => handleIconChange(option.name)}
                            >
                                <option.icon/>
                            </button>
                        ))}
                    </div>
                )}
                <button className="add-button" onClick={addItem}>Add Item</button>
            </div>
            <div>
                {notification.message && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={closeNotification}
                    />
                )}
                <h2>Items List</h2>
                <button className="pdf-button" onClick={generatePDF}>Download</button>
                <ul className="items-list" ref={itemsListRef}>
                    {items.map((item, index) => {
                        const Icon = iconOptions.find((option) => option.name === item.icon).icon;
                        return (
                            <li key={index} className="item">
                                <span className="item-icon"><Icon/></span> {item.name} - Amount: {item.amount}
                                <time className="item-time">{item.time}</time>
                                <button className="delete-button" onClick={() => deleteItem(item.id)}>
                                    <FaTrash/> Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ItemInsert;
