/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import {
    updateDoc, doc, query, where, collection, getDocs,
} from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import { firestore } from '../../../firebase/clientApp';
import { exerciseListL1, exerciseListL2, exerciseListL3 } from '../onboarding/exercises';
import { StatusBar } from './StatusBar';
import { AdvanceModal } from './AdvanceModal';

export function CurrentProtocol({ userInfo, showOnboard }) {
    const { user } = useAuth();
    const [count, setCount] = useState({ 1: 0, 2: 0, 3: 0 });
    const [loading, setLoading] = useState(false);
    const [showAlert] = useState(false);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [completedProgram, setCompletedProgram] = useState(false);

    useEffect(() => {
        setCount(userInfo.progressMade);
    }, [userInfo]);

    const getRoutine = async () => {
        const q = query(collection(firestore, 'users'), where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        let routine;

        querySnapshot.forEach((document) => {
            if (document.data().email === user.email) {
                let list;
                const { currentLevel } = document.data();
                switch (currentLevel) {
                case 1:
                    list = exerciseListL1;
                    break;
                case 2:
                    list = exerciseListL2;
                    break;
                case 3:
                    list = exerciseListL3;
                    break;
                default:
                    break;
                }

                const shuffled = list.sort(() => 0.5 - Math.random());

                const userEquipment = userInfo.equipment.filter((item) => item.isChecked);
                const equipment = userEquipment.map((item) => item.valName);
                console.log('userEquipment', equipment);
                routine = {
                    warmup: {
                        exercises: [],
                        count: 0,
                    },
                    core: {
                        exercises: [],
                        count: 0,
                    },
                    neck: {
                        exercises: [],
                        count: 0,
                    },
                    back: {
                        exercises: [],
                        count: 0,
                    },
                };

                shuffled.forEach((exercise) => {
                    if (exercise.muscleGroup === 'core' && routine.core.count < 2) {
                        if (userEquipment.length > 0 && equipment.includes(exercise.equipmentNeeded)) {
                            routine.core.exercises.push(exercise);
                            routine.core.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.core.exercises.push(exercise);
                            routine.core.count += 1;
                        }

                        routine.core.exercises.push(exercise);
                        routine.core.count += 1;
                    } else if (exercise.muscleGroup === 'neck' && routine.neck.count < 2) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        routine.neck.exercises.push(exercise);
                        routine.neck.count += 1;
                    } else if (exercise.muscleGroup === 'back' && routine.back.count < 2) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.back.exercises.push(exercise);
                            routine.back.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.back.exercises.push(exercise);
                            routine.back.count += 1;
                        }

                        routine.back.exercises.push(exercise);
                        routine.back.count += 1;
                    } else if (exercise.muscleGroup === 'warmup' && routine.warmup.count < 3) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.warmup.exercises.push(exercise);
                            routine.warmup.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.warmup.exercises.push(exercise);
                            routine.warmup.count += 1;
                        }
                        routine.warmup.exercises.push(exercise);
                        routine.warmup.count += 1;
                    }
                });

                console.log('generated', routine);
            }

            if (!routine) {
                // default to this routine
                const shuffled = exerciseListL1.sort(() => 0.5 - Math.random());

                const userEquipment = userInfo.equipment.filter((item) => item.isChecked);
                const equipment = userEquipment.map((item) => item.valName);
                console.log('userEquipment', equipment);
                routine = {
                    warmup: {
                        exercises: [],
                        count: 0,
                    },
                    core: {
                        exercises: [],
                        count: 0,
                    },
                    neck: {
                        exercises: [],
                        count: 0,
                    },
                    back: {
                        exercises: [],
                        count: 0,
                    },
                };

                shuffled.forEach((exercise) => {
                    if (exercise.muscleGroup === 'core' && routine.core.count < 2) {
                        if (userEquipment.length > 0 && equipment.includes(exercise.equipmentNeeded)) {
                            routine.core.exercises.push(exercise);
                            routine.core.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.core.exercises.push(exercise);
                            routine.core.count += 1;
                        }

                        routine.core.exercises.push(exercise);
                        routine.core.count += 1;
                    } else if (exercise.muscleGroup === 'neck' && routine.neck.count < 2) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        routine.neck.exercises.push(exercise);
                        routine.neck.count += 1;
                    } else if (exercise.muscleGroup === 'back' && routine.back.count < 2) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.back.exercises.push(exercise);
                            routine.back.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.back.exercises.push(exercise);
                            routine.back.count += 1;
                        }

                        routine.back.exercises.push(exercise);
                        routine.back.count += 1;
                    } else if (exercise.muscleGroup === 'warmup' && routine.warmup.count < 3) {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.warmup.exercises.push(exercise);
                            routine.warmup.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.warmup.exercises.push(exercise);
                            routine.warmup.count += 1;
                        }
                        routine.warmup.exercises.push(exercise);
                        routine.warmup.count += 1;
                    }
                });

                console.log('default', routine);
            }
        });
        return routine;
    };

    const generateRoutine = async () => {
        setLoading(true);
        const userRef = doc(firestore, 'users', user.email);
        const q = query(collection(firestore, 'users'), where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            if (document.data().email === user.email) {
                const { currentLevel } = document.data();

                if (currentLevel === 1) {
                    await updateDoc(userRef, { currentLevel: 2 });
                }

                if (currentLevel === 2) {
                    await updateDoc(userRef, { currentLevel: 3 });
                }

                if (currentLevel === 3) {
                    const progressMade = { ...document.data().progressMade };
                    progressMade[3] = 0;

                    setCount(progressMade);
                    await updateDoc(userRef, { currentLevel: 3 });
                    await updateDoc(userRef, { progressMade });
                }

                setTimeout(() => {
                    setLoading(false);
                    setShowAdvanceModal(false);
                }, 1200);
            }
        });

        const routine = await getRoutine();
        console.log('routine', routine);
        await updateDoc(userRef, { currentProtocol: [routine] });

        setTimeout(() => {
            setShowAdvanceModal(false);
            setLoading(false);
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-undef
                window.location.reload();
            }
        }, 2000);
    };

    const handleAdvanceModal = () => {
        setShowAdvanceModal(true);
    };

    const completeWorkout = async () => {
        setLoading(true);
        const userRef = doc(firestore, 'users', user.email);
        const q = query(collection(firestore, 'users'), where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            if (document.data().email === user.email) {
                const progressMade = { ...document.data().progressMade };
                const { currentLevel } = document.data();

                if (currentLevel === 1) {
                    if (progressMade[1] === undefined) {
                        progressMade[1] = 0;
                    }

                    if (progressMade[1] >= 4) {
                        progressMade[1] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        return;
                    }

                    if (progressMade[1] < 4) {
                        progressMade[1] += 1;
                    }
                }

                if (currentLevel === 2) {
                    if (progressMade[2] >= 4) {
                        progressMade[2] += 1;
                        setCount(progressMade);

                        // await updateDoc(userRef, { currentLevel: 3 });
                        // generateRoutine();
                        handleAdvanceModal();
                        setLoading(false);
                        return;
                    }

                    if (progressMade[2] < 4) {
                        progressMade[2] += 1;
                    }
                }

                if (currentLevel === 3) {
                    if (progressMade[3] === undefined) {
                        progressMade[3] = 0;
                    }

                    if (progressMade[3] >= 4) {
                        progressMade[3] += 1;
                        handleAdvanceModal();
                        setLoading(false);
                        setCount(progressMade);
                        setCompletedProgram(true);
                        await updateDoc(userRef, { progressMade });
                        return;
                    }

                    if (progressMade[3] < 4) {
                        progressMade[3] += 1;
                    }
                }

                setCount(progressMade);
                await updateDoc(userRef, { progressMade });

                setTimeout(() => {
                    setLoading(false);
                }, 1200);
            }
        });
    };

    return (
        <div className="flex flex-col justify-center items-center text-center">
            {showOnboard ? ''
                : (
                    <div className="flex flex-col gap-10 w-full">
                        {showAdvanceModal ? <AdvanceModal setCount={setCount} generateRoutine={generateRoutine} showAdvanceModal={showAdvanceModal} setShowAdvanceModal={setShowAdvanceModal} completedProgram={completedProgram} /> : ''}
                        <StatusBar count={count} />
                        <div className="border-t-4 py-5">
                            <div className="badge w-52 h-10 text-lg">
                            Warmups/Stretches
                            </div>
                            {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].warmup.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box w-3/4 m-auto my-4" key={idx}>
                <div className="collapse-title text-base font-medium">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">10 Reps x 3 Sets</p>
                    </div>
                </div>
                <div className="collapse-content">
                    <ul className="flex flex-col justify-center items-start mt-5 text-sm gap-1">
                        <li><span className="font-medium">Description:</span></li>
                        <li><span className="font-medium">Example:</span></li>
                        <li><span className="font-medium">Recommended Explanation Video:</span> </li>
                        <li><span className="font-medium">Alternative Exercise:</span></li>
                    </ul>
                </div>
            </div>
        ))}
                        </div>
                        <div className="border-t-4 py-5">
                            <div className="badge w-52 h-10 text-lg">
                            Back
                            </div>
                            {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].back.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box w-3/4 m-auto my-4" key={idx}>
                <div className="collapse-title text-base font-medium">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">10 Reps x 3 Sets</p>
                    </div>
                </div>
                <div className="collapse-content">
                    <ul className="flex flex-col justify-center items-start mt-5 text-sm gap-1">
                        <li><span className="font-medium">Description:</span></li>
                        <li><span className="font-medium">Example:</span></li>
                        <li><span className="font-medium">Recommended Explanation Video:</span> </li>
                        <li><span className="font-medium">Alternative Exercise:</span></li>
                    </ul>
                </div>
            </div>
        ))}
                        </div>
                        <div className="border-t-4 py-5">
                            <div className="badge w-52 h-10 text-lg">
                            Core
                            </div>
                            {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].core.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box w-3/4 m-auto my-4" key={idx}>
                <div className="collapse-title text-base font-medium">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">10 Reps x 3 Sets</p>
                    </div>
                </div>
                <div className="collapse-content">
                    <ul className="flex flex-col justify-center items-start mt-5 text-sm gap-1">
                        <li><span className="font-medium">Description:</span></li>
                        <li><span className="font-medium">Example:</span></li>
                        <li><span className="font-medium">Recommended Explanation Video:</span> </li>
                        <li><span className="font-medium">Alternative Exercise:</span></li>
                    </ul>
                </div>
            </div>
        ))}
                        </div>
                        <div className="border-t-4 py-5">
                            <div className="badge w-52 h-10 text-lg">
                            Neck
                            </div>
                            {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].neck.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box w-3/4 m-auto my-4" key={idx}>
                <div className="collapse-title text-base font-medium">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">10 Reps x 3 Sets</p>
                    </div>
                </div>
                <div className="collapse-content">
                    <ul className="flex flex-col justify-center items-start mt-5 text-sm gap-1">
                        <li><span className="font-medium">Description:</span></li>
                        <li><span className="font-medium">Example:</span></li>
                        <li><span className="font-medium">Recommended Explanation Video:</span> </li>
                        <li><span className="font-medium">Alternative Exercise:</span></li>
                    </ul>
                </div>
            </div>
        ))}
                        </div>
                        <button disabled={!!loading || showAlert} type="button" className="btn btn-success mt-5 h-20 text-lg w-full" onClick={completeWorkout}>{loading ? 'Submitting...' : 'Complete Workout'}</button>

                    </div>

                )}

        </div>
    );
}
