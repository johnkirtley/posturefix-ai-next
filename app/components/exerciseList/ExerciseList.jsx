/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { exerciseInfo } from './exerciseInfo';
import List from './List';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { useAuth } from '../../Context/AuthContext';
import { NoPlan } from './noPlan';
import { useFirebase } from '../../hooks/useFirebase';

export default function ExerciseList() {
    const [view] = useState(1);
    const [exercise, setExercise] = useState(null);
    const { user } = useAuth();
    const { premiumStatus } = usePremiumStatus(user.email);
    const [trimExercises, setTrimExercises] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    const [filteredExercises, setFilteredExercises] = useState([]);
    const { userInfo } = useFirebase();

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchVal(val);
    };

    useEffect(() => {
        const filtered = exerciseInfo.filter((ex) => ex.name.toLowerCase().includes(searchVal.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(searchVal.toLowerCase()));

        if (searchVal.trim() === '') {
            setFilteredExercises(exerciseInfo);
        } else {
            setFilteredExercises(filtered);
        }
    }, [searchVal]);

    const selectRandomExercise = () => {
        const shuffled = exerciseInfo.sort(() => 0.5 - Math.random());
        const randomDecimal = Math.random();
        const randomNumGenerator = Math.floor(randomDecimal * (shuffled.length - 0 + 1) + 0);
        setExercise(exerciseInfo[randomNumGenerator]);

        console.log('num', premiumStatus);
    };

    useEffect(() => {
        if (premiumStatus.planName === '') {
            const exercises = exerciseInfo.slice(0, 4);
            setTrimExercises(exercises);
        }

        if (premiumStatus.planName !== '') {
            const exercises = exerciseInfo;
            setTrimExercises(exercises);
        }
    }, [premiumStatus]);

    useEffect(() => {
        if (exercise) {
            // eslint-disable-next-line no-undef
            const btn = document.getElementById('my-modal-shuffle');
            btn.checked = true;
            console.log('exercise', exercise);
        }
    }, [exercise]);

    if (userInfo.currentLevel === 1) {
        return <p className="text-center">Section Unlocked After Level 1</p>;
    }

    return (
        <div>
            {premiumStatus.planName !== '' ? (
                <div>
                    <div className="flex justify-center items-center">
                        <button type="button" htmlFor="my-modal" className="btn btn-secondary" onClick={selectRandomExercise}>Pick Random Exercise</button>
                        <input type="checkbox" id="my-modal-shuffle" className="modal-toggle" />
                        <div className="modal justify-center items-center text-center">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">{exercise && exercise.name}</h3>
                                <p className="py-4">10 reps x 3 sets</p>
                                <p className="py-4">{exercise && exercise.description}</p>
                                <p className="py-4">{exercise && exercise.image}</p>
                                <p className="py-4">{exercise && exercise.video}</p>
                                <div className="modal-action">
                                    <label htmlFor="my-modal-shuffle" className="btn">Done</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-5 flex flex-col justify-center items-center gap-5">
                        {/* <h2 className="text-center">Exercise Library</h2> */}
                        {/* <div className="tabs justify-center items-center mt-5">
                <button type="button" onClick={() => setView(1)} className={`tab tab-bordered ${view === 1 ? 'tab-active' : ''}`}>Exercise List</button>
                <button type="button" onClick={() => setView(2)} className={`tab tab-bordered ${view === 2 ? 'tab-active' : ''}`}>Saved Workouts</button>
            </div> */}
                        <div>
                            <input value={searchVal} className="input w-80" placeholder="Search For An Exercise..." onChange={handleSearch} />
                        </div>
                        {view === 1 ? <List exerciseInfo={filteredExercises} /> : ''}
                    </div>
                </div>
            ) : <div><NoPlan /><List exerciseInfo={trimExercises} /></div>}
        </div>
    );
}
