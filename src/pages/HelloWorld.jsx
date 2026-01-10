import { useNavigate } from 'react-router-dom';
import './HelloWorld.css';

function HelloWorld() {
	const navigate = useNavigate();

	return (
		<div className="hello-container">
			<h1 className="hello-title">Hello World!</h1>
			<p className="hello-text">Welcome to your first route in React Router.</p>
			<button className="back-button" onClick={() => navigate('/')}>
				← Back to Home
			</button>
		</div>
	);
}

export default HelloWorld;
