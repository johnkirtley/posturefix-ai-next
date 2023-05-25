/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import {
    updateDoc, doc, query, where, collection, getDocs,
} from 'firebase/firestore';
import { firestore } from '../../../firebase/clientApp';
import { useAuth } from '../../Context/AuthContext';

export function AdvanceModal({
    showAdvanceModal,
    setShowAdvanceModal,
    completedProgram,
    generateRoutine,
    setCount,
    level,
}) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const restartLevel = async () => {
        setLoading(true);
        const userRef = doc(firestore, 'users', user.email);
        const q = query(collection(firestore, 'users'), where('email', '==', user.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            if (document.data().email === user.email) {
                const progressMade = { ...document.data().progressMade };
                const { currentLevel } = document.data();
                progressMade[currentLevel] = 0;

                console.log('progress', progressMade);

                setCount(0);
                await updateDoc(userRef, { progressMade });

                setTimeout(() => {
                    setLoading(false);
                    setShowAdvanceModal(false);
                }, 1200);
            }
        });
    };

    useEffect(() => {
        if (showAdvanceModal) {
            // eslint-disable-next-line no-undef
            const modalBtn = document.getElementById('my-modal');
            modalBtn.checked = true;
        }
    }, [showAdvanceModal]);

    return (
        <div>
            {showAdvanceModal
                ? (
                    <div>
                        <label htmlFor="my-modal" className="btn">open modal</label>
                        <input type="checkbox" id="my-modal" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                {loading ? <p className="py-4">Restarting Current Level...</p> : ''}
                                <h3 className="font-bold text-lg">Congrats! {completedProgram ? 'Full Program Completed!' : 'Level Completed!'}</h3>
                                {!completedProgram && !loading ? <p className="py-4">You can either advance to the next level or restart this level if it was too difficult.</p> : ''}
                                {completedProgram && !loading ? <p className="py-4">You finished the PostureFix program! Now what? Clicking Continue generates a new workout program or head over to the Exercises Menu for more posture-focused exercises.</p> : ''}
                                <div className="modal-action">
                                    <button disabled={loading} type="button" className="btn" onClick={restartLevel}>Restart Level</button>
                                    <button disabled={loading} type="button" className="btn" onClick={() => generateRoutine(level)}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ''}
        </div>
    );
}
