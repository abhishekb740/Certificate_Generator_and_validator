import 'bootstrap/dist/css/bootstrap.min.css';

export default function Carousel() {
    // useEffect(() => {
    //     // Initialize the carousel when the component mounts
    //     var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleFade'), {
    //       interval: 2000, // Adjust the interval as needed
    //       wrap: true // Enable continuous looping
    //     });

    //     // Clean up and destroy the carousel when the component unmounts
    //     return () => myCarousel.dispose();
    //   }, []);

    return (
        <div>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: 'contain !important' }}>
                <div className="carousel-inner" id="carousel">
                    <div className="carousel-caption d-flex justify-content-center align-items-center d-none d-md-block" style={{ zIndex: '10' }} >
                        <form className="d-flex">
                            <button className="btn btn-outline-success text-white bg-success" type="submit">Select</button>
                        </form>
                    </div>
                    <div className="carousel-item active">
                        <img src="https://i.imgur.com/idG3CLO.png" className="d-block w-100" alt="..." style={{ filter: "brightness(60%)" }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://i.imgur.com/RFeCLoi.png" className="d-block w-100" alt="..." style={{ filter: "brightness(40%)" }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://i.imgur.com/XmfD44T.png" className="d-block w-100" alt="..." style={{ filter: "brightness(40%)" }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://i.imgur.com/oTYOlAM.png" className="d-block w-100" alt="..." style={{ filter: "brightness(40%)" }} />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}
