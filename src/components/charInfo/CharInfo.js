import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = ({charId}) => {

    const [char, setChar] = useState(null);

    useEffect(() => {
        updateChar();
    }, [charId])

    const {loading, error, getCharacter, clearError} = useMarvelService();

    const onLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        if (!charId) {
            return;
        }

        clearError();

        getCharacter(charId)
            .then(onLoaded);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {

    let objectFitStyle = {'objectFit': "cover"}
    if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        objectFitStyle = {'objectFit': "contain"};
    }

    return (
        <>
            <div className="char__basics">
                <img src={char.thumbnail} style={objectFitStyle} alt={char.name}/>
                <div>
                    <div className="char__info-name">{char.name}</div>
                    <div className="char__btns">
                        <a href={char.homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={char.wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {char.description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {char.comics.length > 0 ? null : "У этого персонажа нет комиксов!"}
                {
                    char.comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
};

export default CharInfo;