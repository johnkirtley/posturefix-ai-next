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
    const [generateLoading, setGenerateLoading] = useState(false);
    const [showAlert] = useState(false);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [completedProgram, setCompletedProgram] = useState(false);
    const { premiumStatus } = usePremiumStatus(user.email);
    const [selected, setSelected] = useState({});
    const router = useRouter();
    const [curLevel, setCurLevel] = useState(1);
    const [showCompletedBadge, setShowCompletedBadge] = useState(false);
    const [curProtocol, setCurProtocol] = useState([]);

    useEffect(() => {
        setCount(userInfo.progressMade);
        setCurLevel(userInfo.currentLevel);
        setCurProtocol(userInfo.currentProtocol);
    }, [userInfo]);

    const handleShowDetails = (exercise) => {
        setSelected(exercise);
        // eslint-disable-next-line no-undef
        const btn = document.getElementById('my-modal');
        btn.checked = true;
        // eslint-disable-next-line no-undef
        const div = document.querySelectorAll('.scrollable-div');
        div[0].scrollTop = 0;
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

                const fisherYatesShuffle = (arr) => {
                    for (let i = arr.length - 1; i > 0; i -= 1) {
                        const j = Math.floor(Math.random() * (i + 1));
                        // eslint-disable-next-line no-param-reassign
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                    }

                    return arr;
                };

                // const shuffled = list.sort(() => 0.5 - Math.random());
                const shuffled = fisherYatesShuffle(list);

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
                    } else if (exercise.muscleGroup === 'neck') {
                        if (userEquipment.length > 0 && userEquipment.includes(exercise.equipmentNeeded)) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        if (userEquipment.length === 0) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        if (currentLevel < 4 && routine.neck.count < 2) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }

                        if (currentLevel === 4 && routine.neck.count < 1) {
                            routine.neck.exercises.push(exercise);
                            routine.neck.count += 1;
                        }
                    } else if (exercise.muscleGroup === 'back' && routine.back.count < 4) {
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
                    updateDoc(userRef, { currentLevel: 2 }).then(() => {
                        getRoutine().then(async (routine) => {
                            setCurProtocol([routine]);
                            await updateDoc(userRef, { currentProtocol: [routine] });
                            // setCurProtocol([routine]);
                            setTimeout(() => {
                                setCurLevel(2);
                                setShowAdvanceModal(false);
                                setLoading(false);
                                setGenerateLoading(false);
                                if (typeof window !== 'undefined') {
                                    // eslint-disable-next-line no-undef
                                    // window.location.reload();
                                }
                            }, 2000);
                        });
                    });
                }

                if (currentLevel === 2) {
                    updateDoc(userRef, { currentLevel: 3 }).then(() => {
                        getRoutine().then(async (routine) => {
                            setCurProtocol([routine]);
                            await updateDoc(userRef, { currentProtocol: [routine] });
                            // setCurProtocol([routine]);
                            setTimeout(() => {
                                setCurLevel(3);
                                setShowAdvanceModal(false);
                                setLoading(false);
                                setGenerateLoading(false);
                                if (typeof window !== 'undefined') {
                                    // eslint-disable-next-line no-undef
                                    // window.location.reload();
                                }
                            }, 2000);
                        });
                    });
                }

                if (currentLevel === 3) {
                    updateDoc(userRef, { currentLevel: 4 }).then(() => {
                        getRoutine().then(async (routine) => {
                            setCurProtocol([routine]);
                            await updateDoc(userRef, { currentProtocol: [routine] });
                            // setCurProtocol([routine]);
                            setTimeout(() => {
                                setCurLevel(4);
                                setShowAdvanceModal(false);
                                setLoading(false);
                                setGenerateLoading(false);
                                if (typeof window !== 'undefined') {
                                    // eslint-disable-next-line no-undef
                                    // window.location.reload();
                                }
                            }, 2000);
                        });
                    });
                }

                if (currentLevel === 4) {
                    const progressMade = { ...document.data().progressMade };
                    progressMade[4] = 0;

                    await updateDoc(userRef, { currentLevel: 4 });
                    await updateDoc(userRef, { progressMade });

                    getRoutine().then(async (routine) => {
                        setCurProtocol([routine]);
                        await updateDoc(userRef, { currentProtocol: [routine] });
                        // setCurProtocol([routine]);
                        setTimeout(() => {
                            setCount(progressMade);
                            setCurLevel(4);
                            setShowAdvanceModal(false);
                            setLoading(false);
                            setGenerateLoading(false);
                            if (typeof window !== 'undefined') {
                                // eslint-disable-next-line no-undef
                                // window.location.reload();
                            }
                        }, 2000);
                    });
                }

                setTimeout(() => {
                    setLoading(false);
                    setShowAdvanceModal(false);
                }, 1200);
            }
        });

        // potentially add timeout here. routine getting generated before level upgrade being detected
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
                const totalWorkouts = process.env.NEXT_PUBLIC_ENV === 'prod' ? 8 : 3;

                if (currentLevel === 1) {
                    if (progressMade[1] === undefined) {
                        progressMade[1] = 0;
                    }

                    if (progressMade[1] >= totalWorkouts - 1) {
                        progressMade[1] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        return;
                    }

                    if (progressMade[1] < totalWorkouts) {
                        progressMade[1] += 1;
                    }
                }

                if (currentLevel === 2) {
                    if (progressMade[2] >= totalWorkouts - 1) {
                        progressMade[2] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        return;
                    }

                    if (progressMade[2] < totalWorkouts) {
                        progressMade[2] += 1;
                    }
                }

                if (currentLevel === 3) {
                    if (progressMade[3] === undefined) {
                        progressMade[3] = 0;
                    }

                    if (progressMade[3] >= totalWorkouts - 1) {
                        progressMade[3] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        setCompletedProgram(true);
                        return;
                    }

                    if (progressMade[3] < totalWorkouts) {
                        progressMade[3] += 1;
                    }
                }

                if (currentLevel === 4) {
                    if (progressMade[4] >= totalWorkouts) {
                        progressMade[4] += 1;
                        setCount(progressMade);
                        handleAdvanceModal();
                        setLoading(false);
                        await updateDoc(userRef, { progressMade });
                        return;
                    }

                    if (progressMade[4] < totalWorkouts) {
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
                                    <h3 className="font-bold text-lg">{selected && selected.name}</h3>
                                    {/* {selected && !loadingAnimation ? <Image src={selected && selected.image} width={250} height={250} className="m-auto" alt={selected && selected.name} /> : <Loading text="Loading Animation..." />} */}
                                    <p className="pt-2"><span className="font-semibold text-normal underline">Instructions:</span></p>
                                    <div className="scrollable-div h-64 md:h-40 overflow-auto border border-primary rounded-md px-2 pb-2 md:px-4 mt-2">
                                        {selected && selected.description ? selected.description.map((step, idx) => (
                                            <div className="flex my-3">
                                                <div>
                                                    <p className="text-sm bg-info w-7 h-7 mr-2 rounded-full flex justify-center items-center">{idx + 1}</p>
                                                </div>
                                                <div className="flex justify-start items-center">
                                                    <p className="text-left text-sm">{step}</p>
                                                </div>
                                            </div>
                                        )) : ''}
                                        {selected && selected.tip ? <p className="text-sm bg-info my-3 p-3 w-11/12 m-auto rounded-md"><p><span className="font-semibold">💡 Tip: </span>{selected.tip}</p></p> : ''}
                                        {selected && selected.alternative ? <p className="pt-2"><span className="font-semibold text-normal">Alternative:</span></p> : ''}
                                        <p className="text-sm">{selected && selected.alternative ? selected.alternative : ''}</p>
                                    </div>
                                    <div className="modal-action">
                                        <label htmlFor="my-modal" className="btn btn-neutral">Close</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            {showAdvanceModal ? <AdvanceModal setCount={setCount} generateRoutine={generateRoutine} showAdvanceModal={showAdvanceModal} setShowAdvanceModal={setShowAdvanceModal} completedProgram={completedProgram} curLevel={curLevel} /> : ''}
                            {showCompletedBadge ? <div className="badge badge-success mb-5 p-4 shadow-xl"><p className="text-base-100">🐧🎉 Nice Job! Workout Completed.</p></div> : ''}
                            <StatusBar count={count} curLevel={curLevel} />
                            <div>
                                <div className="divider 3xl:divider-horizontal mb-8">
                                    <p className="badge badge-info p-4 text-base font-semibold">Warmups</p>
                                </div>
                                {curProtocol.length > 0
        && curProtocol[0].warmup.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 md:w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        {exercise ? <Image src={exercise && exercise.image} width={250} height={200} className="m-auto" alt={exercise && exercise.name} /> : <Loading text="Loading Animation..." />}
                    </div>
                </div>
                <p className="text-normal font-normal">{exercise.reps}</p>
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
                                <div className="divider 3xl:divider-horizontal my-8">
                                    <p className="badge badge-info p-4 text-base font-semibold">Back</p>
                                </div>
                                {curProtocol.length > 0
        && curProtocol[0].back.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 md:w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        {exercise ? <Image src={exercise && exercise.image} width={250} height={200} className="m-auto" alt={exercise && exercise.name} /> : <Loading text="Loading Animation..." />}
                    </div>
                </div>
                <p className="text-normal font-normal">{exercise.reps}</p>
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
                                <div className="divider 3xl:divider-horizontal my-8">
                                    <p className="badge badge-info p-4 text-base font-semibold">Core</p>
                                </div>
                                {curProtocol.length > 0
        && curProtocol[0].core.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 md:w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        {exercise ? <Image src={exercise && exercise.image} width={250} height={200} className="m-auto" alt={exercise && exercise.name} /> : <Loading text="Loading Animation..." />}
                    </div>
                </div>
                <p className="text-normal font-normal">{exercise.reps}</p>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div>
                            {/* <div className="pb-5">
                                <div className="divider 3xl:divider-horizontal my-8">
                                    <p className="badge badge-info p-4 text-base font-semibold">Neck</p>
                                </div>
                                {curProtocol.length > 0
        && curProtocol[0].neck.exercises.map((exercise, idx) => (
            <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 md:w-3/4 m-auto my-5 shadow-lg" key={idx}>
                <div className="text-base font-medium p-5">
                    <div>
                        <p>{exercise.name}</p>
                        {exercise ? <Image src={exercise && exercise.image} width={250} height={200} className="m-auto" alt={exercise && exercise.name} /> : <Loading text="Loading Animation..." />}
                    </div>
                </div>
                <p className="text-normal font-normal">{exercise.reps}</p>
                <button type="button" className="btn btn-secondary my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                    <div className="flex justify-center items-center gap-1">
                        <Icon icon="pepicons-pop:plus" />
                        <p>Exercise Details</p>
                    </div>
                </button>
            </div>
        ))}
                            </div> */}
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
