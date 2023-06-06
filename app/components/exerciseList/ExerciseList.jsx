/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { exerciseInfo, stretchInfo } from './exerciseInfo';
// import List from './List';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { useAuth } from '../../Context/AuthContext';
import { NoPlan } from './noPlan';
import { useFirebase } from '../../hooks/useFirebase';

export default function ExerciseList() {
    const [exercise, setExercise] = useState('');
    const { user } = useAuth();
    const { premiumStatus } = usePremiumStatus(user.email);
    const [type, setType] = useState('');
    const [loadingStretch, setLoadingStretch] = useState(false);
    const [loadingExercise, setLoadingExercise] = useState(false);
    const [stretchChecked, setStretchChecked] = useState(false);
    const [exerciseChecked, setExerciseChecked] = useState(false);
    const { userInfo } = useFirebase();

    const selectRandomExercise = (list, selectedType) => {
        if (selectedType === 'stretch') {
            setLoadingStretch(true);
            const shuffled = list.sort(() => 0.5 - Math.random());
            const randomDecimal = Math.random();
            const randomNumGenerator = Math.floor(randomDecimal * (shuffled.length - 0 + 1) + 0);
            setType(selectedType);
            setExercise(list[randomNumGenerator]);
            setTimeout(() => {
                setLoadingStretch(false);
            }, 1200);
        }

        if (selectedType === 'exercise') {
            setLoadingExercise(true);
            const shuffled = list.sort(() => 0.5 - Math.random());
            const randomDecimal = Math.random();
            const randomNumGenerator = Math.floor(randomDecimal * (shuffled.length - 0 + 1) + 0);
            setType(selectedType);
            setExercise(list[randomNumGenerator]);
            setTimeout(() => {
                setLoadingExercise(false);
            }, 1200);
        }
    };

    useEffect(() => {
        if (exercise && type) {
            if (type === 'stretch' && !loadingStretch) {
                // eslint-disable-next-line no-undef
                setStretchChecked(true);
                // eslint-disable-next-line no-undef
                const div = document.querySelectorAll('.scrollable-div');
                div[0].scrollTop = 0;
            }

            if (type === 'exercise' && !loadingExercise) {
                // eslint-disable-next-line no-undef
                setExerciseChecked(true);
                // eslint-disable-next-line no-undef
                const div = document.querySelectorAll('.scrollable-div');
                div[1].scrollTop = 0;
            }
        }
    }, [exercise, type, loadingStretch, loadingExercise]);

    if (userInfo.currentLevel === 1) {
        return <div className="flex flex-col justify-center items-center p-4 gap-5"><p className="text-center font-semibold">Section Unlocked After Level 1</p><p className="text-center">We Want You To Establish A Stronger Foundation Before Trying Out Random Exercises.</p><Image style={{ opacity: '80%' }} src="https://posturepal.s3.us-east-2.amazonaws.com/images/flat_vector_penguin_wearing_a_large_clock_as_a__241ffe03-9bae-4608-b2a5-f0d2eb72e6a6-removebg-preview.png" alt="Penguin Clock" width={300} height={300} /></div>;
    }

    return (
        <div>
            {premiumStatus.planName !== '' ? (
                <div>
                    <div className="flex flex-col justify-center items-center gap-5">
                        <p className="text-lg font-semibold text-center">Short On Time? <br />Let Us Pick A Quick Workout For You!</p>
                        <Image style={{ opacity: '80%' }} src="https://posturepal.s3.us-east-2.amazonaws.com/images/rJ4VktZB_4x.jpeg" alt="penguin random" width={250} height={250} />
                        <div>
                            <button type="button" htmlFor="my-modal-stretch" className="btn btn-secondary" onClick={() => selectRandomExercise(stretchInfo, 'stretch')}>{loadingStretch ? 'Spinning...' : 'Random Stretch'}</button>
                            <input checked={stretchChecked} type="checkbox" id="my-modal-shuffle-stretch" className="modal-toggle" />
                            <div className="modal justify-center items-center text-center">
                                <div className="modal-box pt-0">
                                    {exercise ? <Image className="m-auto" src={exercise && exercise.image} alt={exercise && exercise.name} width={250} height={250} /> : ''}
                                    <h3 className="font-bold text-lg">{exercise && exercise.name}</h3>
                                    <p className="py-2 text-normal font-semibold">{exercise && exercise.reps}</p>
                                    <p className="pt-2"><span className="font-semibold text-normal underline">Instructions:</span></p>
                                    <div className="scrollable-div h-32 md:h-40 overflow-auto border border-primary rounded-md px-2 pb-2 mt-2">
                                        {exercise && exercise.description ? exercise.description.map((step, idx) => (
                                            <div className="flex my-3">
                                                <div>
                                                    <p className="text-sm bg-info w-7 h-7 mr-2 rounded-full flex justify-center items-center">{idx + 1}</p>
                                                </div>
                                                <div className="flex justify-start items-center">
                                                    <p className="text-left text-sm">{step}</p>
                                                </div>
                                            </div>
                                        )) : ''}
                                        {exercise && exercise.tip ? <p className="text-sm bg-info my-3 p-3 w-11/12 m-auto rounded-md"><p><span className="font-semibold">💡 Tip: </span>{exercise.tip}</p></p> : ''}
                                        {exercise && exercise.alternative ? <p className="pt-2"><span className="font-semibold text-normal">Alternative:</span></p> : ''}
                                        <p className="text-sm">{exercise && exercise.alternative ? exercise.alternative : ''}</p>
                                    </div>
                                    <div className="modal-action">
                                        <button type="button" onClick={() => setStretchChecked(false)} className="btn btn-primary">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="button" htmlFor="my-modal-exercise" className="btn btn-secondary" onClick={() => selectRandomExercise(exerciseInfo, 'exercise')}>{loadingExercise ? 'Spinning...' : 'Random Exercise'}</button>
                            <input checked={exerciseChecked} type="checkbox" id="my-modal-shuffle-exercise" className="modal-toggle" />
                            <div className="modal justify-center items-center text-center">
                                <div className="modal-box pt-0">
                                    {exercise ? <Image className="m-auto" src={exercise && exercise.image} alt={exercise && exercise.name} width={250} height={250} /> : ''}
                                    <h3 className="font-bold text-lg">{exercise && exercise.name}</h3>
                                    <p className="py-2 text-normal font-semibold">{exercise && exercise.reps}</p>
                                    <p className="pt-2"><span className="font-semibold text-normal underline">Instructions:</span></p>
                                    <div className="scrollable-div h-32 md:h-40 overflow-auto border border-primary rounded-md px-2 pb-2 mt-2">
                                        {exercise && exercise.description ? exercise.description.map((step, idx) => (
                                            <div className="flex my-3">
                                                <div>
                                                    <p className="text-sm bg-info w-7 h-7 mr-2 rounded-full flex justify-center items-center">{idx + 1}</p>
                                                </div>
                                                <div className="flex justify-start items-center">
                                                    <p className="text-left text-sm">{step}</p>
                                                </div>
                                            </div>
                                        )) : ''}
                                        {exercise && exercise.tip ? <p className="text-sm bg-info my-3 p-3 w-11/12 m-auto rounded-md"><p><span className="font-semibold">💡 Tip: </span>{exercise.tip}</p></p> : ''}
                                        {exercise && exercise.alternative ? <p className="pt-2"><span className="font-semibold text-normal">Alternative:</span></p> : ''}
                                        <p className="text-sm">{exercise && exercise.alternative ? exercise.alternative : ''}</p>
                                    </div>
                                    <div className="modal-action">
                                        <button type="button" onClick={() => setExerciseChecked(false)} className="btn btn-primary">Close</button>
                                    </div>
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
                        {/* <div>
                            <input value={searchVal} className="input w-80" placeholder="Search For An Exercise..." onChange={handleSearch} />
                        </div> */}
                        {/* {view === 1 ? <List exerciseInfo={filteredExercises} /> : ''} */}
                    </div>
                </div>
            ) : (
                <div><NoPlan />
                    {/* <List exerciseInfo={trimExercises} /> */}
                </div>
            )}
        </div>
    );
}
