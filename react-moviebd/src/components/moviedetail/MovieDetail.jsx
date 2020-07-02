import React, { useState, useEffect } from 'react';
import { fetchMovieDetail, fetchMovieVideos, fetchCasts, fetchSimilarMovie } from '../../service';
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactStars from 'react-rating-stars-component';
import {Link} from "react-router-dom";

export function MovieDetail({match}){
	let params = match.params;
	let genres = [];
	const [isOpen, setIsOpen] = useState(false);
	const [detail, setDetail] = useState([]);
	const [video, setVideo] = useState([]);
	const [casts, setCasts] = useState([]);
	const [similarMovie, setSimilarMovie] = useState([]);
		
	useEffect(() => {
		const fetchAPI = async () => {
			setDetail(await fetchMovieDetail(params.id));
			setVideo(await fetchMovieVideos(params.id));
			setCasts(await fetchCasts(params.id));
			setSimilarMovie(await fetchSimilarMovie(params.id));
		}

		fetchAPI();
	}, [params.id]);

	genres = detail.genres;

	const MoviePlayerModal = (props) => {
		const youtubeUrl = "https://www.youtube.com/watch?v=";
		return (
		<Modal
			{...props}
			size="lg"
			aria-abeledby="contained-modal-title-vcenter"
			centered			
		>
			<Modal.Header closeButton>
				<Modal.Title
					id="contained-modal-title-vcenter"
					style={{color: '#000000', fontWeight: 'bolder'}}
				>
					{detail.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{backgroundColor:"#000000"}}>
				<ReactPlayer
					className="container-fluid"
					url={youtubeUrl + video.key}
					playing
					width="100%"
				></ReactPlayer>
			</Modal.Body>
			</Modal>
		);
	};

	let genresList;
	if(genres) {
		genresList = genres.map((g, i) => {
			return(
				<li className="list-inline-item" key={i}>
					<button type="button" className="btn btn-outline-info">
						{g.name}
					</button>
				</li>
			);
		});
	}

	/*const  genresList = genres.map((g, i) => {
		return(
			<li className="list-inline-item" key={i}>
				<button type="button" className="btn btn-outline-info">
					{g.name}
				</button>
			</li>
		);
	});*/

	const castList = casts && casts.slice(0, 4).map((c, i) => {
		return (
			<div className="col-md-3 text-center" key={i}>
				<img
					className="img-fluid rounded-circle mx-auto d-block"
					src={c.img}
					alt={c.name}
				></img>
				<p className="font-weight-bold text-center">{c.name}</p>
				<p className="font-weight-light text-center" style={{color:"#5a606b"}}>
				 {c.character}
				</p>
			</div>
		);
	});

	const similarMovieList = similarMovie.slice(0, 4).map((item, index) => {
		return (
            <div className="col-md-3 col-sm-6" key={index}>
                <div className="card">
                    <Link to={`/movie/${item.id}`}>
                        <img className="img-fluid" src={item.poster} alt={item.title}></img>
                    </Link>
                </div>
                <div className="mt-3">
                    <p style={{ fontWeight: "bolder"}}>{item.title}</p>
                    <p>Rated: {item.rating}</p>
                    <ReactStars count={item.rating} size={20} color1={'#f4c10f'}></ReactStars>
                </div>
            </div>

		)
	})

  return (
		<div className="container">
			<div className="row mt-2">
				<MoviePlayerModal
					show={isOpen}
					onHide= {() => {
						setIsOpen(false);
					}}
				></MoviePlayerModal>
				<div className="col text-center" style={{width: '100%'}}>
					<img className="img-fluid" src={`http://image.tmdb.org/t/p/original/${detail.backdrop_path}`} alt={detail.title}></img>
					<div className="carousel-center">
						<i 
							onClick={() => setIsOpen(true)}
							className="far fa-play-circle" 
							style={{fontSize: 95, color: '#f4c10f', cursor: "pointer"}}
						></i>
					</div>
  					<div className="carousel-caption" style={{textAlign: 'center', fontSize: 35 }}>{detail.title}</div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col">
					<p style={{ color: '#5a606b', fontWeight: 'bolder' }}>GENRE</p>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col">
					<ul className="list-inline">
						{genresList}
					</ul>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col">
					<div className="text-center">
						<ReactStars
							count={detail.vote_average}
							size={20}
							color1={'#f4c10f'}
						></ReactStars>
					</div>
					<div className="mt-3">
						<p style={{ color: "#5a606b" , fontWeight: "bold"}}>OVERVIEW</p>
						{detail.overview}
					</div>
				</div>
			</div>
			
			<div className="row mt-3">
				<div className="col">
					<p style={{ color: "#5a606b", fontWeight: "bolder"}}>RELEASE DATE</p>
					<p style={{ color: "#f4c10f"}}>{detail.release_date}</p>
				</div>
				<div className="col">
					<p style={{ color: "#5a606b", fontWeight: "bolder"}}>RUN TIME</p>
					<p style={{ color: "#f4c10f"}}>{detail.runtime}</p>
				</div>
				<div className="col">
					<p style={{ color: "#5a606b", fontWeight: "bolder"}}>BUDGET</p>
					<p style={{ color: "#f4c10f"}}>{detail.budget}</p>
				</div>
				<div className="col">
					<p style={{ color: "#5a606b", fontWeight: "bolder"}}>HOMEPAGE</p>
					<p style={{ color: "#f4c10f"}}>{detail.homepage}</p>
				</div>
			</div>

			<div className="row mt-3">
				<div className="col">
					<p style={{ color: '#5a606b', fontWeight: 'bolder' }}>CASTE</p>
				</div>
			</div>

			<div className="row mt-3">{castList}</div>

			<div className="row mt-3">
				<div className="col">
					<p style={{ color: '#5a606b', fontWeight: 'bolder' }}>SIMILAR MOVIES</p>
				</div>
			</div>

			<div className="row mt-3">
				{similarMovieList}
			</div>

			<hr className="mt-5" style={{ borderTop: "1px solid #5a606b"}}></hr>

            <div className="row mt-3">
                <div className="col-md-8 col-sm-6" style={{color: '#5a606b'}}>
                    <h3>ABOUT ME</h3>
                    <p>While theaters are closed, some features like Top Box Office, In Theaters, Coming Soon to Theaters, and Showtimes are on intermission. </p>
                    <p>We look forward to bringing them back as soon as possible. In the meantime, check out our What's on TV and Streaming section.</p>
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <a href="/" style={{color: '#f4c10f'}}>
                                <i className="fab fa-facebook"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="/" style={{color: '#f4c10f'}}>
                                <i className="fab fa-youtube"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="/" style={{color: '#f4c10f'}}>
                                <i className="fab fa-instagram"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="/" style={{color: '#f4c10f'}}>
                                <i className="fab fa-twitter"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col-md-4 col-sm-6" style={{color: '#5a606b'}}>
                    <h3>KEEP IN TOUCH</h3>
                    <ul className="list-unstyled">
                        <li>
                            <p>
                                <strong>
                                    <i className="fas fa-map-marker-alt"></i>Address:</strong>city, state, country
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>
                                    <i className="fas fa-map-marker-alt"></i>phone:</strong>+00 00 000 00
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>
                                    <i className="fas fa-envelope"></i>E-mail:</strong> aswath@info.com
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
		</div>
    );
}