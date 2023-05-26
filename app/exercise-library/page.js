'use client';

import { useContext } from 'react';
import Nav from '../components/Nav/Nav';
import ExerciseList from '../components/exerciseList/ExerciseList';
import { useAuth } from '../Context/AuthContext';
import { UserContext } from '../Context';

export default function ExerciseListPage() {
    const { user } = useAuth();
    const { userInfo } = useContext(UserContext);

    return (
        <div>
            {user ? (
                <div>
                    <Nav />
                    <ExerciseList userInfo={userInfo} />
                </div>
            ) : ''}
        </div>
    );
}
