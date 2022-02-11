const Footer = () => {
    return (
        <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
            <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />
            <div className="sm:[90%] w-full flex justify-between items-center mt-3">
                <p className="text-white text-sm text-center"><a href="https://github.com/davidkhk" target="_blank" rel="noreferrer">Built by David Kang | 2022</a></p>
                <p className="text-white text-sm text-center"><a href="mailto:hello@davidkang.me">hello@davidkang.me</a></p>
            </div>
        </div>
    )
};

export default Footer;