import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    onLoaded = (newCharacters) => {
        let end = false;
        if (newCharacters.length < 9) {
            end = true;
        }

        this.setState(({characters, offset}) => ({
            characters: [...characters, ...newCharacters], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: end
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
         this.setState({newItemLoading: true});
    }

    render() {

        const {characters, loading, error, newItemLoading, offset, charEnded} = this.state;

        console.log(characters);

        const elements = characters.map(char => {
            const {id, name, thumbnail} = char;
            return (
                <CharItem key={id} id={id} name={name} thumbnail={thumbnail} onCharSelected={this.props.onCharSelected}/>
            );
        })

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? elements : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const CharItem = ({id, name, thumbnail, onCharSelected}) => {
    let objectFitStyle = "";

    if (thumbnail.indexOf("image_not_available") > -1) {
        objectFitStyle += "contain";
    }else {
        objectFitStyle += "cover";
    }

    return (
        <li className="char__item" onClick={() => onCharSelected(id)}>
            <img src={thumbnail} style={{objectFit: objectFitStyle}} alt={name}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;