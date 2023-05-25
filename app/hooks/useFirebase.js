/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */

'use client';

import { useState, useEffect, useContext } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useAuth } from '../Context/AuthContext';
import { UserContext } from '../Context';
import { firestore } from '../../firebase/clientApp';

export function useFirebase() {
    const [loading, setLoading] = useState(true);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { user } = useAuth();

    const getQuery = async (ref) => {
        const q = query(ref, where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
            if (document.data().email === user.email) {
                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    email: document.data().email,
                    name: document.data().name,
                    painPoints: document.data().painPoints,
                    equipment: document.data().equipment,
                    postureType: document.data().postureType,
                    currentLevel: document.data().currentLevel,
                    currentProtocol: document.data().currentProtocol,
                    progressMade: document.data().progressMade,
                }));
                setLoading(false);
            }

            setLoading(false);
        });
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        if (user) {
            const colRef = collection(firestore, 'users');
            getQuery(colRef);
        }
    }, [user]);

    return { userInfo, setUserInfo, loading };
}
