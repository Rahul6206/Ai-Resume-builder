const NotFound = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-background text-foreground">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl mt-4">Page Not Found</p>
            <a
                href="/"
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            >
                Go Home
            </a>
        </div>
    );
};

export default NotFound;
