/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
// import { useContext } from 'react';
// import { UserContext } from '../../Context';

export function StatusBar({ count, curLevel }) {
    // const { userInfo } = useContext(UserContext);
    // const { currentLevel } = userInfo;

    const totalWorkouts = process.env.NEXT_PUBLIC_ENV === 'prod' ? 8 : 3;
    const finalWorkout = totalWorkouts - 1;

    return (
        <div className="flex flex-col gap-1 mb-10">
            <div className="font-bold">
                {curLevel <= 3 ? `Level ${curLevel}` : 'Maintenance Phase'}
            </div>
            {curLevel === 4 ? '' : (
                <div className="flex flex-col justify-center items-center">
                    {count && curLevel ? totalWorkouts - count[curLevel] : totalWorkouts - 0}
                    {' '}
                    {count && count[curLevel] === finalWorkout ? 'Workout Left' : 'Workouts Left'}
                    <progress className="progress progress-success w-56" value={count && curLevel ? count[curLevel] : 0} max={totalWorkouts} />
                </div>
            )}

        </div>
    );
}
