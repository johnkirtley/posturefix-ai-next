/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { useContext } from 'react';
import { UserContext } from '../../Context';

export function StatusBar({ count }) {
    const { userInfo } = useContext(UserContext);
    const { currentLevel } = userInfo;

    return (
        <div className="flex flex-col gap-1">
            <div className="font-bold">
            Level {currentLevel}
            </div>
            <div className="flex flex-col justify-center items-center">
            Progress To Next Level ({count && currentLevel ? count[currentLevel] : 0}/5)
                <progress className="progress progress-secondary w-56" value={count && currentLevel ? count[currentLevel] : 0} max="5" />
            </div>
        </div>
    );
}
