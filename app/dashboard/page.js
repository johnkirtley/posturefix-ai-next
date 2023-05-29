'use client';

import { useState, useContext } from 'react';
import { UserContext } from '../Context';
import Nav from '../components/Nav/Nav';
import { CurrentProtocol } from '../components/CurrentProtocol/CurrentProtocol';
import { useAuth } from '../Context/AuthContext';
import Onboarding from '../components/Onboarding/Onboarding';
import { Loading } from '../components/Loading';
// import { useFirebase } from '../hooks/useFirebase';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [showOnboard, setShowOnboard] = useState(false);
    const { user } = useAuth();
    const { userInfo } = useContext(UserContext);

    return (
        <div>
            {user ? (
                <div>
                    {showOnboard || loading ? '' : <Nav />}
                    {loading ? <Loading text="Generating Routine" /> : ''}
                    {showOnboard || loading ? '' : (
                        <CurrentProtocol
                            userInfo={userInfo}
                            showOnboard={showOnboard}
                        />
                    )}

                    <Onboarding
                        setLoading={setLoading}
                        showOnboard={showOnboard}
                        setShowOnboard={setShowOnboard}
                    />
                </div>
            ) : ''}
        </div>
    );
}
