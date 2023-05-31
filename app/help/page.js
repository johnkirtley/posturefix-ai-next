import Nav from '../components/Nav/Nav';

export default function Help() {
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
                    <a className="btn btn-info" href="mailto:john@greycloudllc.com">Email Us</a>
                </div>
            </div>
        </div>
    );
}
