/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

'use client';

import { useCallback, useEffect, useState, useContext } from 'react';
import {
    collection, getDocs, query, where, updateDoc, doc,
} from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import { UserContext } from '../../Context';
import { firestore } from '../../../firebase/clientApp';
import { exerciseListL1 } from './exercises';
// import { useFirebase } from '../../hooks/useFirebase';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const defaultAnswers = {
    name: '',
    activityLevel: 'sedentary',
    equipment: [
        { name: 'None', valName: 'none', isChecked: true },
        { name: 'Resistance Bands', valName: 'resistanceBands', isChecked: false },
        { name: 'Weights', valName: 'weights', isChecked: false },
    ],
    painPoints: [
        { name: 'Neck', valName: 'neck', isChecked: false },
        { name: 'Upper Back', valName: 'upperBack', isChecked: false },
        { name: 'Lower Back', valName: 'lowerBack', isChecked: false },
        { name: 'Shoulders', valName: 'shoulders', isChecked: false },
        { name: 'Hips', valName: 'hips', isChecked: false },

    ],
    postureType: 'kyphosis',
    painAfterInjury: 'no',
    currentProtocol: [],
};

export default function Onboarding({ setLoading, showOnboard, setShowOnboard }) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [onboardingQuestions, setOnboardingQuestions] = useState(defaultAnswers);
    const { setUserInfo } = useContext(UserContext);

    const getQuery = useCallback(async (ref) => {
        const q = query(ref, where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
            if (document.data().email === user.email) {
                setShowOnboard(document.data().showOnboarding);
            }
        });
    }, [user]);

    useEffect(() => {
        if (user) {
            const colRef = collection(firestore, 'users');
            getQuery(colRef);
        }
    }, [user, getQuery]);

    const getRoutine = () => {
        const shuffled = exerciseListL1.sort(() => 0.5 - Math.random());

        const userEquipment = onboardingQuestions.equipment.filter((item) => item.isChecked);
        const equipment = userEquipment.map((item) => item.valName);
        const routine = {
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

        return routine;
    };

    const generateRoutine = async () => {
        setLoading(true);
        const routine = getRoutine();

        const userRef = doc(firestore, 'users', user.email);
        await updateDoc(userRef, { currentProtocol: [routine] });

        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    const finishOnboarding = async () => {
        const userRef = doc(firestore, 'users', user.email);

        await updateDoc(userRef, { showOnboarding: false });
        await updateDoc(userRef, onboardingQuestions);
        setShowOnboard(false);
        setUserInfo(onboardingQuestions);
        generateRoutine();
    };

    return (
        <div>
            {showOnboard ? (
                <div className="flex flex-col justify-center">
                    <ul className="steps steps-horizontal mt-10">
                        {step >= 1 ? <li className="step step-primary">Basic Info</li> : <li className="step ">Basic Info</li> }
                        {step >= 2 ? <li className="step step-primary">Pain Points</li> : <li className="step ">Paint Points</li> }
                        {step >= 3 ? <li className="step step-primary">Posture Type</li> : <li className="step ">Posture Type</li> }
                    </ul>
                    <div className="text-center mt-10">
                        {step === 1 ? <Step1 step={step} setStep={setStep} setOnboardingQuestions={setOnboardingQuestions} onboardingQuestions={onboardingQuestions} /> : ''}
                        {step === 2 ? <Step2 step={step} setStep={setStep} setOnboardingQuestions={setOnboardingQuestions} onboardingQuestions={onboardingQuestions} /> : ''}
                        {step === 3 ? <Step3 step={step} setStep={setStep} setOnboardingQuestions={setOnboardingQuestions} onboardingQuestions={onboardingQuestions} finishOnboarding={finishOnboarding} /> : ''}
                    </div>
                </div>
            ) : ''}
        </div>
    );
}
