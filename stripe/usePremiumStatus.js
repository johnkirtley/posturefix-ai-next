import { useState, useEffect } from 'react';
import isUserPremium from './isUserPremium';

export default function usePremiumStatus(user) {
    const [premiumStatus, setPremiumStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const checkPremiumStatus = async () => {
                setLoading(true);
                setPremiumStatus(await isUserPremium(user));
                setLoading(false);
            };
            checkPremiumStatus();
        }
    }, [user]);

    return { premiumStatus, loading };
}
