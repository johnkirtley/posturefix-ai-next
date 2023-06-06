// import { firebaseAuth } from '../firebase/clientApp';

async function getSubscriber(email) {
    const response = await fetch('/api/get-subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return data;
}

async function isUserPremium(email) {
    const subscriber = await getSubscriber(email);

    let role;
    let planStatus;
    if (subscriber.data.length > 0) {
        role = subscriber.data[0].plan.nickname;
        planStatus = subscriber.data[0].status;
    } else {
        role = '';
        planStatus = '';
    }

    return { planName: role, status: planStatus };
}

export default isUserPremium;
