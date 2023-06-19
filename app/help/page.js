'use client';

import { usePlausible } from 'next-plausible';
import Nav from '../components/Nav/Nav';
import { useAuth } from '../Context/AuthContext';

export default function Help() {
    const { user } = useAuth();
    const plausible = usePlausible();

    const trackHelpClick = (email) => {
        plausible('Help Button Click', { props: { email } });
    };

    return (
        <div>
            <Nav />
            <div className="flex flex-col justify-center items-center gap-5">
                <div className="text-center">
                    <p>Need Help?</p>
                    <p>Have a Question?</p>
                    <p>Want To Request a Feature?</p>
                </div>
                <div>
                    <a className="btn btn-info" href="mailto:john@posturefix.io" onClick={() => trackHelpClick(user.email)}>Email Us</a>
                </div>
            </div>
        </div>
    );
}
