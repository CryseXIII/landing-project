import { useNavigate } from 'react-router-dom';
import './Button.css';

function Button({ text, to }) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (to) {
			navigate(to);
		}
	};

	return (
		<button className="nav-button" onClick={handleClick}>
			{text}
		</button>
	);
}

export default Button;
