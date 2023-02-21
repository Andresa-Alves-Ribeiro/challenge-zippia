/* This is the Header component. It has a dark color and the company's logo with width e height defined.
This component is responsive. 
To be visible on the site, it will be imported into the index.tsx component */

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ height: '10vh' }}>
                <div className="container-fluid d-flex align-items-center">
                    <a className="navbar-brand">
                        <div className="d-flex align-items-center">
                            <img src="https://static.zippia.com/ui-router/logo/full.png" alt="Zippia Official Logo" width="160" height="36" style={{ marginLeft: '40px' }} />
                        </div>
                    </a>
                </div>
            </nav>
        </header>
    );
}
