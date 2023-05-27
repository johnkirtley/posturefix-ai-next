'use client';

import Nav from '../components/Nav/Nav';
import ExerciseList from '../components/exerciseList/ExerciseList';
import { useAuth } from '../Context/AuthContext';

export default function ExerciseListPage() {
    const { user } = useAuth();

    return (
        <div>
            {user ? (
                <div>
                    <Nav />
                    <ExerciseList />
                </div>
            ) : ''}
        </div>
    );
}
