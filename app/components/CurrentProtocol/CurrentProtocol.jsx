/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import {
    updateDoc, doc, query, where, collection, getDocs,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useAuth } from '../../Context/AuthContext';
import { firestore } from '../../../firebase/clientApp';
import { exerciseListL1, exerciseListL2, exerciseListL3 } from '../onboarding/exercises';
import { StatusBar } from './StatusBar';
import { AdvanceModal } from './AdvanceModal';
import { Loading } from '../loading';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { exerciseStretchCombo } from '../exerciseList/exerciseInfo';

export function CurrentProtocol({ userInfo, showOnboard }) {
    const { user } = useAuth();
    const [count, setCount] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [loading, setLoading] = useState(false);
    const [loadingAnimation, setLoadingAnimation] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [showAlert] = useState(false);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [completedProgram, setCompletedProgram] = useState(false);
    const { premiumStatus } = usePremiumStatus(user.email);
    const [selected, setSelected] = useState({});
    const router = useRouter();
    const [curLevel, setCurLevel] = useState(1);
    const [showCompletedBadge, setShowCompletedBadge] = useState(false);

    useEffect(() => {
        setCount(userInfo.progressMade);
        setCurLevel(userInfo.currentLevel);
    }, [userInfo]);

    const handleShowDetails = (exercise) => {
        setLoadingAnimation(true);
        setSelected(exercise);
        console.log(exercise);
        // eslint-disable-next-line no-undef
        const btn = document.getElementById('my-modal');
        btn.checked = true;
        setTimeout(() => {
            setLoadingAnimation(false);
        }, 1000);
    };

    const getRoutine = async () => {
        setGenerateLoading(true);
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
                case 4:
                    list = exerciseStretchCombo;
                    break;
                default:
                    break;
                }

                const shuffled = list.sort(() => 0.5 - Math.random());

                const userEquipment = userInfo.equipment.filter((item) => item.isChecked);
                const equipment = userEquipment.map((item) => item.valName);
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
                    } else if (exercise.muscleGroup === 'back' && routine.back.count < 3) {
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
                console.log('current level', currentLevel);

                if (currentLevel === 1) {
                    await updateDoc(userRef, { currentLevel: 2 });
                }

                if (currentLevel === 2) {
                    await updateDoc(userRef, { currentLevel: 3 });
                }

                if (currentLevel === 3) {
                    await updateDoc(userRef, { currentLevel: 4 });
                }

                if (currentLevel === 4) {
                    const progressMade = { ...document.data().progressMade };
                    progressMade[4] = 0;

                    setCount(progressMade);
                    await updateDoc(userRef, { currentLevel: 4 });
                    await updateDoc(userRef, { progressMade });
                }

                setTimeout(() => {
                    setLoading(false);
                    setShowAdvanceModal(false);
                }, 1200);
            }
        });

        // potentially add timeout here. routine getting generated before level upgrade being detected
        const routine = await getRoutine();
        console.log('routine', routine);
        await updateDoc(userRef, { currentProtocol: [routine] });
        // setCurProtocol([routine]);
        setTimeout(() => {
            setShowAdvanceModal(false);
            setLoading(false);
            setGenerateLoading(false);
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-undef
                window.location.reload();
            }
        }, 2000);
    };

    if (generateLoading) {
        return <Loading text="Generating New Routine..." />;
    }

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
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        setCompletedProgram(true);
                        return;
                    }

                    if (progressMade[3] < 4) {
                        progressMade[3] += 1;
                    }
                }

                if (currentLevel === 4) {
                    if (progressMade[4] >= 4) {
                        progressMade[4] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        await updateDoc(userRef, { progressMade });
                        return;
                    }

                    if (progressMade[4] < 4) {
                        progressMade[4] += 1;
                    }
                }

                setCount(progressMade);
                await updateDoc(userRef, { progressMade });

                setTimeout(() => {
                    setLoading(false);
                    if (typeof window !== 'undefined') {
                        // eslint-disable-next-line no-undef
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setShowCompletedBadge(true);
                        setTimeout(() => {
                            setShowCompletedBadge(false);
                        }, 2500);
                    }
                }, 1200);
            }
        });
    };

    return (
        <div className="flex flex-col justify-center items-center text-center lg:w-1/2 lg:m-auto">
            {showOnboard ? ''
                : (
                    <div className="w-full">
                        <div className="flex justify-center items-center">
                            <input type="checkbox" id="my-modal" className="modal-toggle" />
                            <div className="modal justify-center items-center text-center">
                                <div className="modal-box">
                                    <div className="modal-action mt-0">
                                        <label htmlFor="my-modal" className="btn btn-neutral">X</label>
                                    </div>
                                    <h3 className="font-bold text-lg">{selected && selected.name}</h3>
                                    <p className="py-4">10 reps x 3 sets</p>
                                    {selected && !loadingAnimation ? <Image src={selected && selected.image} width={250} height={250} className="m-auto" alt={selected && selected.name} /> : <Loading text="Loading Animation..." />}
                                    <p className="pt-4"><span className="font-bold">Explanation:</span></p>
                                    <p>{selected && selected.description}</p>
                                    <p className="pt-4"><span className="font-bold">Reference Video:</span></p>
                                    <p>{selected && selected.video}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            {showAdvanceModal ? <AdvanceModal setCount={setCount} generateRoutine={generateRoutine} showAdvanceModal={showAdvanceModal} setShowAdvanceModal={setShowAdvanceModal} completedProgram={completedProgram} curLevel={curLevel} /> : ''}
                            {showCompletedBadge ? <div className="badge badge-success mb-5 p-4"><p className="text-base-100">🐧🎉 Nice Job! Workout Completed.</p></div> : ''}
                            <StatusBar count={count} />
                            <div>
                                <div className="divider xl:divider-horizontal">
                                    <p className="badge badge-info p-3 font-semibold">Warmups</p>
                                </div>
                                {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].warmup.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">{exercise.reps}</p>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div>
                            <div className="pb-5">
                                <div className="divider xl:divider-horizontal">
                                    <p className="badge badge-info p-3 font-semibold">Back</p>
                                </div>
                                {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].back.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">{exercise.reps}</p>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div>
                            <div className="pb-5">
                                <div className="divider xl:divider-horizontal">
                                    <p className="badge badge-info p-3 font-semibold">Core</p>
                                </div>
                                {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].core.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">{exercise.reps}</p>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div>
                            <div className="pb-5">
                                <div className="divider xl:divider-horizontal">
                                    <p className="badge badge-info p-3 font-semibold">Neck</p>
                                </div>
                                {userInfo.currentProtocol.length > 0
        && userInfo.currentProtocol[0].neck.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        <p className="text-sm font-light">{exercise.reps}</p>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div>
                            {premiumStatus.planName === '' ? <button type="button" className="btn btn-warning mt-5 h-20 text-sm w-full" onClick={() => router.push('/plans')}>Please Choose Plan To Log Workout</button>
                                : '' }
                            {premiumStatus.planName !== '' && curLevel !== 4 ? <button disabled={!!loading || showAlert} type="button" className="btn btn-success mt-5 h-20 text-lg w-full" onClick={completeWorkout}>{loading ? 'Submitting...' : 'Complete Workout'}</button> : ''}
                            {premiumStatus.planName !== '' && curLevel === 4 ? (
                                <button disabled={!!loading || showAlert} type="button" className="btn btn-success mt-5 h-20 text-lg w-full" onClick={generateRoutine}>{loading ? 'Generating...' : (
                                    <div>
                                        <p className="text-xs">Ready To Switch It Up?</p>
                                        <div className="flex justify-center items-center gap-2">
                                            <Icon icon="ep:refresh" height={25} width={25} />
                                            <p>Generate New Workout</p>
                                        </div>
                                    </div>
                                )}
                                </button>
                            ) : ''}

                        </div>
                    </div>
                )}

        </div>
    );
}
