
export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ height: '10vh'}}>
                <div className="container-fluid d-flex align-items-center">
                    <a>
                        <div className="d-flex align-items-center">
                            <img src="https://static.zippia.com/ui-router/logo/full.png" alt="Zippia Official Logo" width="160" height="36" style={{ marginLeft: '100px' }} />
                        </div>
                    </a>

                    <div>
                        <div className="d-flex justify-content-center">
                            <input type="text" placeholder="Search for jobs"></input>
                            <input type="text" placeholder="Location"></input>
                            <button className="btn btn-primary">
                                <span>
                                    <img src="https://www.zippia.com/ui-router/images/new-search.svg" />
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="d-flex">
                        <ul className="list-unstyled d-flex mb-0">
                            <li className="me-4">
                                <span style={{ textTransform: "uppercase", color: "#aaa" }}>
                                    Jobs
                                </span>
                            </li>

                            <li className="me-4">
                                <span style={{ textTransform: "uppercase", color: "#aaa" }}>
                                    Careers
                                </span>
                            </li>

                            <li className="me-4">
                                <span style={{ textTransform: "uppercase", color: "#aaa" }}>
                                    Post Job
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <button className="btn btn-primary" style={{ marginRight: '100px', width: '8vw', textTransform: "uppercase"}}>Sign In</button>
                    </div>
                </div>
            </nav>
        </header>

    );
}
