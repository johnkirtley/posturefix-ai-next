/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { useContext } from 'react';
import { UserContext } from '../../Context';

export function StatusBar({ count }) {
    const { userInfo } = useContext(UserContext);
    const { currentLevel } = userInfo;
    const totalWorkouts = 5;

    return (
        <div className="flex flex-col gap-1 mb-10">
            <div className="font-bold">
            Level {currentLevel}
            </div>
            <div className="flex flex-col justify-center items-center">
                {count && currentLevel ? totalWorkouts - count[currentLevel] : totalWorkouts - 0}
                {' '}
                {count && count[currentLevel] === 4 ? 'Workout Until Level Completed' : 'Workouts Until Level Completed'}
                <progress className="progress progress-success w-56" value={count && currentLevel ? count[currentLevel] : 0} max="5" />
            </div>
        </div>
    );
}
