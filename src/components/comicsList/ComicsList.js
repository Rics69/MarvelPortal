import useMarvelService from '../../services/MarvelService';
import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = (props) => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(200);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onLoaded = (newComics) => {
        let end = false;
        if (newComics.onLoaded < 8) {
            end = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => end);
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getComics(offset)
            .then(onLoaded);
    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        // itemsRef.current.forEach(item => {
        //     item.classList.remove();
        // });
        itemsRef.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li 
                    className="comics__item"
                    tabIndex={0}
                    ref={el => itemsRef.current[i] = el}
                    onClick={() => {
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            focusOnItem(i);
                        }
                    }}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{`${item.price}$`}</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const elements = renderItems(comics);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            <>
                {errorMessage}
                {spinner}
                {elements}
            </>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display':comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;