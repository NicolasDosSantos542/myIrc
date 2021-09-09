import React, {useEffect, useState} from 'react';
import Bus from '../../Utils/Bus';

const Flash = () => {
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [title, setTitle] = useState('');
    let [type, setType] = useState('');

    useEffect(() => {
        Bus.addListener('flash', ({title, message, type}) => {
            setVisibility(true);
            setTitle(title);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setVisibility(false);
            }, 6000);
        });

    }, []);

    useEffect(() => {
        if (document.querySelector('.close') !== null) {
            document.querySelector('.close').addEventListener('click', () => setVisibility(false));
        }
    })
    return (
        visibility &&

        <div className={`p-2 text-center alert alert-${type}`}>
            <div><strong>{title}</strong></div>
            <div>{message}</div>
        </div>

    )
}
export default Flash
